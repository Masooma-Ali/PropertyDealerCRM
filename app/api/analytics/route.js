import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import User from '@/models/User';
import { withAuth } from '@/middleware/authMiddleware';
import { withRole } from '@/middleware/roleMiddleware';

async function getAnalytics(request) {
  try {
    await connectDB();

    const totalLeads = await Lead.countDocuments();

    // Status distribution
    const statusDist = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Priority distribution
    const priorityDist = await Lead.aggregate([
      { $group: { _id: '$score', count: { $sum: 1 } } },
    ]);

    // Source distribution
    const sourceDist = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);

    // Agent performance
    const agentPerformance = await Lead.aggregate([
      { $match: { assignedTo: { $ne: null } } },
      {
        $group: {
          _id: '$assignedTo',
          totalAssigned: { $sum: 1 },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] } },
          new: { $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] } },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'agent',
        },
      },
      { $unwind: '$agent' },
      {
        $project: {
          agentName: '$agent.name',
          agentEmail: '$agent.email',
          totalAssigned: 1,
          closed: 1,
          inProgress: 1,
          new: 1,
        },
      },
    ]);

    // Recent leads (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentLeads = await Lead.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    // Unassigned leads
    const unassignedLeads = await Lead.countDocuments({ assignedTo: null });

    // High priority unhandled
    const highPriorityNew = await Lead.countDocuments({ score: 'High', status: 'New' });

    return NextResponse.json({
      success: true,
      analytics: {
        totalLeads,
        recentLeads,
        unassignedLeads,
        highPriorityNew,
        statusDistribution: statusDist,
        priorityDistribution: priorityDist,
        sourceDistribution: sourceDist,
        agentPerformance,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export const GET = withAuth(withRole('admin')(getAnalytics));