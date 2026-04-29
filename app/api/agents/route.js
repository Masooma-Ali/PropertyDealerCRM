import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { withAuth } from '@/middleware/authMiddleware';
import { withRole } from '@/middleware/roleMiddleware';
import bcrypt from 'bcryptjs';

// GET all agents
async function getAgents(request) {
  try {
    await connectDB();
    const agents = await User.find({ role: 'agent', isActive: true }).select('-password');
    return NextResponse.json({ success: true, agents });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// POST create agent (admin only)
async function createAgent(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 409 }
      );
    }

    const agent = await User.create({ name, email, password, phone, role: 'agent' });

    return NextResponse.json(
      { success: true, agent: { id: agent._id, name: agent.name, email: agent.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export const GET = withAuth(withRole('admin')(getAgents));
export const POST = withAuth(withRole('admin')(createAgent));