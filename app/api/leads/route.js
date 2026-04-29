import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import Activity from '@/models/Activity';
import User from '@/models/User';
import { withAuth } from '@/middleware/authMiddleware';
import { withRateLimit } from '@/middleware/rateLimiter';
import { sendEmail, newLeadEmailTemplate } from '@/lib/email';

// GET all leads
async function getLeads(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const score = searchParams.get('score');
    const source = searchParams.get('source');
    const search = searchParams.get('search');

    let query = {};

    // Agents only see their assigned leads
    if (request.user.role === 'agent') {
      query.assignedTo = request.user.id;
    }

    if (status) query.status = status;
    if (score) query.score = score;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// POST create lead
async function createLead(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, phone, propertyInterest, budget, source, notes, location } = body;

    if (!name || !propertyInterest || !budget) {
      return NextResponse.json(
        { success: false, message: 'Name, property interest, and budget are required' },
        { status: 400 }
      );
    }

    const lead = await Lead.create({
      name, email, phone, propertyInterest,
      budget: Number(budget),
      source: source || 'Other',
      notes, location,
      createdBy: request.user.id,
    });

    // Log activity
    await Activity.create({
      lead: lead._id,
      performedBy: request.user.id,
      action: 'created',
      description: `Lead "${lead.name}" was created`,
      metadata: { score: lead.score },
    });

    // Send email notification to all admins
    const admins = await User.find({ role: 'admin' });
    const creator = await User.findById(request.user.id);
    for (const admin of admins) {
      await sendEmail({
        to: admin.email,
        subject: `New Lead: ${lead.name}`,
        html: newLeadEmailTemplate(lead, creator.name),
      });
    }

    // Real-time notification
    if (global.io) {
      global.io.emit('lead:created', { lead: await lead.populate('createdBy', 'name') });
    }

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export const GET = withAuth(withRateLimit(getLeads));
export const POST = withAuth(withRateLimit(createLead));