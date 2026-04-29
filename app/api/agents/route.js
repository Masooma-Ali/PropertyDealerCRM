import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { withAuth } from '@/middleware/authMiddleware';
import { withRole } from '@/middleware/roleMiddleware';

async function handler(request) {
  try {
    await connectDB();
    const agents = await User.find({ role: 'agent', isActive: true }).select('-password');
    return NextResponse.json({ success: true, agents });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export const GET = withAuth(withRole('admin')(handler));