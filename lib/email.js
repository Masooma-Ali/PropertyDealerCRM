import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email send error:', error);
  }
}

export function newLeadEmailTemplate(lead, createdByName) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 24px; border-radius: 12px;">
      <div style="background: #10b981; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
        <h1 style="color: white; margin: 0; font-size: 22px;">🏢 New Lead Created</h1>
      </div>
      <div style="background: white; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <p style="color: #6b7280; margin-top: 0;">A new lead has been added to the CRM system.</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Name</td><td style="padding: 8px 0; font-weight: bold; color: #111827;">${lead.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td><td style="padding: 8px 0; color: #111827;">${lead.email || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone</td><td style="padding: 8px 0; color: #111827;">${lead.phone || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Interest</td><td style="padding: 8px 0; color: #111827;">${lead.propertyInterest}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Budget</td><td style="padding: 8px 0; color: #111827;">PKR ${Number(lead.budget).toLocaleString()}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Priority</td><td style="padding: 8px 0;"><span style="background: ${lead.score === 'High' ? '#fef2f2' : lead.score === 'Medium' ? '#fffbeb' : '#f0fdf4'}; color: ${lead.score === 'High' ? '#dc2626' : lead.score === 'Medium' ? '#d97706' : '#16a34a'}; padding: 2px 10px; border-radius: 20px; font-size: 13px; font-weight: bold;">${lead.score}</span></td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Source</td><td style="padding: 8px 0; color: #111827;">${lead.source}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Added By</td><td style="padding: 8px 0; color: #111827;">${createdByName}</td></tr>
        </table>
        <div style="margin-top: 20px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/dashboard" style="background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View in CRM</a>
        </div>
      </div>
    </div>
  `;
}

export function leadAssignedEmailTemplate(lead, agentName, adminName) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 24px; border-radius: 12px;">
      <div style="background: #3b82f6; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
        <h1 style="color: white; margin: 0; font-size: 22px;">📋 Lead Assigned to You</h1>
      </div>
      <div style="background: white; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <p style="color: #6b7280; margin-top: 0;">Hi <strong>${agentName}</strong>, a new lead has been assigned to you by <strong>${adminName}</strong>.</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Lead Name</td><td style="padding: 8px 0; font-weight: bold; color: #111827;">${lead.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone</td><td style="padding: 8px 0; color: #111827;">${lead.phone || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Interest</td><td style="padding: 8px 0; color: #111827;">${lead.propertyInterest}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Budget</td><td style="padding: 8px 0; color: #111827;">PKR ${Number(lead.budget).toLocaleString()}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Priority</td><td style="padding: 8px 0; color: #111827;">${lead.score}</td></tr>
        </table>
        <div style="margin-top: 20px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/agent/leads/${lead._id}" style="background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Lead</a>
        </div>
      </div>
    </div>
  `;
}