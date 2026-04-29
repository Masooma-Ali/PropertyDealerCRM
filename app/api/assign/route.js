import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import User from '@/models/User';
import Activity from '@/models/Activity';
import { withAuth } from '@/middleware/authMiddleware';
import { withRole } from '@/middleware/roleMiddleware';
import { sendEmail, leadAssignedEmailTemplate } from '@/lib/email';

async function assignLead(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { leadId, agentId } = body;

    if (!leadId || !agentId) {
      return NextResponse.json(
        { success: false, message: 'leadId and agentId are required' },
        { status: 400 }
      );
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
    }

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'agent') {
      return NextResponse.json({ success: false, message: 'Agent not found' }, { status: 404 });
    }

    const wasAssigned = lead.assignedTo;
    const action = wasAssigned ? 'reassigned' : 'assigned';

    lead.assignedTo = agentId;
    lead.lastActivityAt = new Date();
    await lead.save();

    // Get admin info
    const admin = await User.findById(request.user.id);

    // Log activity
    await Activity.create({
      lead: lead._id,
      performedBy: request.user.id,
      action,
      description: wasAssigned
        ? `Lead reassigned to ${agent.name}`
        : `Lead assigned to ${agent.name}`,
      metadata: { agentId, agentName: agent.name },
    });

    // Send email to agent
    await sendEmail({
      to: agent.email,
      subject: `Lead Assigned: ${lead.name}`,
      html: leadAssignedEmailTemplate(lead, agent.name, admin.name),
    });

    // Real-time notification
    if (global.io) {
      global.io.to(`agent-${agentId}`).emit('lead:assigned', { lead, agentId });
      global.io.emit('lead:assignment-changed', { lead, agentId, agentName: agent.name });
    }

    const updatedLead = await Lead.findById(leadId)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export const POST = withAuth(withRole('admin')(assignLead));