import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import Activity from '@/models/Activity';
import { withAuth } from '@/middleware/authMiddleware';
import { withRateLimit } from '@/middleware/rateLimiter';

// GET single lead
async function getLead(request, { params }) {
  try {
    await connectDB();
    const lead = await Lead.findById(params.id)
      .populate('assignedTo', 'name email phone')
      .populate('createdBy', 'name email');

    if (!lead) {
      return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
    }

    // Agents can only view their assigned leads
    if (
      request.user.role === 'agent' &&
      lead.assignedTo?._id?.toString() !== request.user.id
    ) {
      return NextResponse.json({ success: false, message: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// PUT update lead
async function updateLead(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    const existingLead = await Lead.findById(params.id);

    if (!existingLead) {
      return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
    }

    // Agents can only update their own leads
    if (
      request.user.role === 'agent' &&
      existingLead.assignedTo?.toString() !== request.user.id
    ) {
      return NextResponse.json({ success: false, message: 'Access denied' }, { status: 403 });
    }

    const allowedUpdates = ['name', 'email', 'phone', 'propertyInterest', 'budget',
      'status', 'notes', 'source', 'location', 'followUpDate'];

    const updates = {};
    for (const key of allowedUpdates) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    // Track what changed for activity log
    const activities = [];

    if (body.status && body.status !== existingLead.status) {
      activities.push({
        lead: params.id,
        performedBy: request.user.id,
        action: 'status_updated',
        description: `Status changed from "${existingLead.status}" to "${body.status}"`,
        metadata: { from: existingLead.status, to: body.status },
      });
    }

    if (body.notes && body.notes !== existingLead.notes) {
      activities.push({
        lead: params.id,
        performedBy: request.user.id,
        action: 'notes_updated',
        description: 'Notes were updated',
      });
    }

    if (body.followUpDate && body.followUpDate !== existingLead.followUpDate?.toString()) {
      activities.push({
        lead: params.id,
        performedBy: request.user.id,
        action: 'follow_up_set',
        description: `Follow-up date set to ${new Date(body.followUpDate).toLocaleDateString()}`,
        metadata: { followUpDate: body.followUpDate },
      });
    }

    updates.lastActivityAt = new Date();

    const lead = await Lead.findByIdAndUpdate(params.id, updates, { new: true, runValidators: true })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    // Save all activities
    if (activities.length > 0) {
      await Activity.insertMany(activities);
    }

    // Real-time notification
    if (global.io) {
      global.io.emit('lead:updated', { lead });
    }

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// DELETE lead (admin only)
async function deleteLead(request, { params }) {
  try {
    await connectDB();

    if (request.user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const lead = await Lead.findByIdAndDelete(params.id);
    if (!lead) {
      return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
    }

    // Delete related activities
    await Activity.deleteMany({ lead: params.id });

    if (global.io) {
      global.io.emit('lead:deleted', { leadId: params.id });
    }

    return NextResponse.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export const GET = withAuth(withRateLimit(getLead));
export const PUT = withAuth(withRateLimit(updateLead));
export const DELETE = withAuth(withRateLimit(deleteLead));