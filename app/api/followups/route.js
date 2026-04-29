import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import { withAuth } from '@/middleware/authMiddleware';
import { withRateLimit } from '@/middleware/rateLimiter';

// GET overdue and upcoming follow-ups
async function getFollowUps(request) {
  try {
    await connectDB();
    const now = new Date();
    const query = request.user.role === 'agent' ? { assignedTo: request.user.id } : {};

    // Overdue: followUpDate is in the past and lead is not closed
    const overdue = await Lead.find({
      ...query,
      followUpDate: { $lt: now },
      status: { $nin: ['Closed', 'Lost'] },
      followUpDate: { $ne: null },
    }).populate('assignedTo', 'name').sort({ followUpDate: 1 });

    // Upcoming: follow-up in next 3 days
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const upcoming = await Lead.find({
      ...query,
      followUpDate: { $gte: now, $lte: threeDaysFromNow },
      status: { $nin: ['Closed', 'Lost'] },
    }).populate('assignedTo', 'name').sort({ followUpDate: 1 });

    // Stale: no activity for 7+ days and not closed
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const stale = await Lead.find({
      ...query,
      lastActivityAt: { $lt: sevenDaysAgo },
      status: { $nin: ['Closed', 'Lost'] },
    }).populate('assignedTo', 'name').sort({ lastActivityAt: 1 });

    return NextResponse.json({ success: true, overdue, upcoming, stale });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export const GET = withAuth(withRateLimit(getFollowUps));