/**
 * Email Service
 * Send emails for various events
 */

const { createTransporter, getSenderEmail, getOrgName } = require('../config/email');

const getAdminNotificationEmail = () => {
  return process.env.ADMIN_NOTIFICATION_EMAIL || process.env.EMAIL_ADMIN_TO || getSenderEmail();
};

// Send volunteer submission acknowledgment email to applicant
const sendVolunteerSubmissionAcknowledgment = async (volunteer) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('📧 Email not configured. Skipping volunteer submission acknowledgment.');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const { name, email } = volunteer;
    const orgName = getOrgName();

    const mailOptions = {
      from: `"${orgName}" <${getSenderEmail()}>`,
      to: email,
      subject: `${orgName} - We received your volunteer request`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 24px; }
            .title { font-size: 22px; font-weight: 700; margin: 0 0 10px; color: #111827; }
            .footer { margin-top: 20px; font-size: 13px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1 class="title">Thank you for volunteering, ${name}!</h1>
            <p>We have successfully received your volunteer application for <strong>${orgName}</strong>.</p>
            <p>Our team will review your application and contact you soon with next steps.</p>
            <p>If you need any help, you can reply through our contact channels on the website.</p>
            <p>Best regards,<br /><strong>${orgName} Team</strong></p>
          </div>
          <p class="footer">This is an automated email confirmation.</p>
        </body>
        </html>
      `,
      text: `Hi ${name},\n\nWe have received your volunteer application for ${orgName}. Our team will review it and contact you soon with next steps.\n\nBest regards,\n${orgName} Team`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Volunteer submission acknowledgment sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending volunteer submission acknowledgment:', error);
    return { success: false, error: error.message };
  }
};

// Send volunteer submission notification to admin inbox
const sendVolunteerSubmissionAdminNotification = async (volunteer) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('📧 Email not configured. Skipping volunteer admin notification.');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const orgName = getOrgName();
    const adminEmail = getAdminNotificationEmail();
    const {
      name,
      email,
      phone,
      city,
      country,
      occupation,
      availability,
      motivation,
      id,
      created_at,
    } = volunteer;

    const submittedAt = created_at ? new Date(created_at).toLocaleString() : new Date().toLocaleString();

    const mailOptions = {
      from: `"${orgName}" <${getSenderEmail()}>`,
      to: adminEmail,
      subject: `New volunteer request: ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px; }
            .card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            td { border-bottom: 1px solid #f3f4f6; padding: 8px 0; vertical-align: top; }
            td:first-child { width: 180px; color: #6b7280; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2 style="margin: 0 0 8px;">New Volunteer Request</h2>
            <p style="margin: 0 0 16px; color: #6b7280;">A new volunteer form has been submitted.</p>
            <table>
              <tr><td>Applicant ID</td><td>${id || 'N/A'}</td></tr>
              <tr><td>Name</td><td>${name || 'N/A'}</td></tr>
              <tr><td>Email</td><td>${email || 'N/A'}</td></tr>
              <tr><td>Phone</td><td>${phone || 'N/A'}</td></tr>
              <tr><td>Location</td><td>${[city, country].filter(Boolean).join(', ') || 'N/A'}</td></tr>
              <tr><td>Occupation</td><td>${occupation || 'N/A'}</td></tr>
              <tr><td>Availability</td><td>${availability || 'N/A'}</td></tr>
              <tr><td>Motivation</td><td>${motivation || 'N/A'}</td></tr>
              <tr><td>Submitted At</td><td>${submittedAt}</td></tr>
            </table>
          </div>
        </body>
        </html>
      `,
      text: `New volunteer request\n\nName: ${name || 'N/A'}\nEmail: ${email || 'N/A'}\nPhone: ${phone || 'N/A'}\nLocation: ${[city, country].filter(Boolean).join(', ') || 'N/A'}\nOccupation: ${occupation || 'N/A'}\nAvailability: ${availability || 'N/A'}\nMotivation: ${motivation || 'N/A'}\nSubmitted At: ${submittedAt}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Volunteer admin notification sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending volunteer admin notification:', error);
    return { success: false, error: error.message };
  }
};

// Send volunteer approval email
const sendVolunteerApprovalEmail = async (volunteer) => {
  const transporter = createTransporter();

  // If email is not configured, skip sending
  if (!transporter) {
    console.log('📧 Email not configured. Skipping volunteer approval email.');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const { name, email } = volunteer;
    const orgName = getOrgName();

    const mailOptions = {
      from: `"${orgName}" <${getSenderEmail()}>`,
      to: email,
      subject: `Welcome to ${orgName} - Your Volunteer Application is Approved! 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border: 1px solid #e5e7eb;
            }
            .button {
              display: inline-block;
              background: #2563eb;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              background: #f3f4f6;
              padding: 20px;
              text-align: center;
              font-size: 14px;
              color: #6b7280;
              border-radius: 0 0 10px 10px;
            }
            .highlight {
              background: #dbeafe;
              padding: 15px;
              border-left: 4px solid #2563eb;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Congratulations, ${name}!</h1>
          </div>

          <div class="content">
            <p>Dear ${name},</p>

            <p>We are thrilled to inform you that your volunteer application with <strong>${orgName}</strong> has been <strong>approved</strong>!</p>

            <div class="highlight">
              <strong>Welcome to our team!</strong><br>
              Your dedication to supporting migrant workers and advancing human rights is exactly what we need to make a real difference in our community.
            </div>

            <h3>What's Next?</h3>
            <ul>
              <li>Our volunteer coordinator will contact you within 2-3 business days</li>
              <li>You'll receive details about upcoming orientation sessions</li>
              <li>We'll discuss volunteer opportunities that match your skills and interests</li>
              <li>You'll get access to our volunteer resources and training materials</li>
            </ul>

            <h3>In the meantime:</h3>
            <p>Feel free to explore our website and learn more about our current programs and initiatives. If you have any questions, don't hesitate to reach out!</p>

            <center>
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" class="button">Visit Our Website</a>
            </center>

            <p>Thank you for choosing to be part of our mission. Together, we can create positive change!</p>

            <p>Best regards,<br>
            <strong>${orgName} Team</strong></p>
          </div>

          <div class="footer">
            <p>${orgName}<br>
            Working for Migrant Workers' Rights and Social Justice</p>
            <p style="font-size: 12px; margin-top: 10px;">
              This is an automated email. Please do not reply to this message.<br>
              If you need assistance, please contact us through our website.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
Dear ${name},

Congratulations! Your volunteer application with ${orgName} has been approved!

Welcome to our team! Your dedication to supporting migrant workers and advancing human rights is exactly what we need to make a real difference in our community.

What's Next?
- Our volunteer coordinator will contact you within 2-3 business days
- You'll receive details about upcoming orientation sessions
- We'll discuss volunteer opportunities that match your skills and interests
- You'll get access to our volunteer resources and training materials

Thank you for choosing to be part of our mission. Together, we can create positive change!

Best regards,
${orgName} Team

---
This is an automated email. Please do not reply to this message.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Volunteer approval email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending volunteer approval email:', error);
    console.error('❌ Full error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    return { success: false, error: error.message };
  }
};

// Send contact form acknowledgment (optional - can be added later)
const sendContactAcknowledgment = async (contact) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('📧 Email not configured. Skipping contact acknowledgment.');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const { name, email } = contact;
    const orgName = getOrgName();

    const mailOptions = {
      from: `"${orgName}" <${getSenderEmail()}>`,
      to: email,
      subject: `Thank you for contacting ${orgName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank you for reaching out!</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and appreciate you taking the time to contact us.</p>
          <p>Our team will review your message and get back to you within 2-3 business days.</p>
          <p>Best regards,<br>${orgName} Team</p>
        </div>
      `,
      text: `Dear ${name},\n\nThank you for contacting us. We have received your message and will get back to you within 2-3 business days.\n\nBest regards,\n${orgName} Team`
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Error sending contact acknowledgment:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVolunteerApprovalEmail,
  sendContactAcknowledgment,
  sendVolunteerSubmissionAcknowledgment,
  sendVolunteerSubmissionAdminNotification
};
