import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Activity from '@/models/Activity';
import Lead from '@/models/Lead';
import { withAuth } from '@/middleware/authMiddleware';
import { withRateLimit } from '@/middleware/rateLimiter';

async function getActivities(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const lead = await Lead.findById(id);
    if (!lead) {
      return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
    }

    if (
      request.user.role === 'agent' &&
      lead.assignedTo?.toString() !== request.user.id
    ) {
      return NextResponse.json({ success: false, message: 'Access denied' }, { status: 403 });
    }

    const activities = await Activity.find({ lead: id })
      .populate('performedBy', 'name role')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, activities });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export const GET = withAuth(withRateLimit(getActivities));