/**
 * Email Service
 * Send emails for various events
 */

const { createTransporter, getSenderEmail, getOrgName } = require('../config/email');

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
  sendContactAcknowledgment
};
