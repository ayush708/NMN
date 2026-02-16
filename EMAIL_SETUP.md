# Email Notification Setup Guide

## Overview
Email notifications are now configured to automatically send approval emails to volunteers when their application is approved by an admin.

## Installation

### 1. Install nodemailer package
```bash
cd backend
npm install nodemailer
```

## Configuration

### 2. Configure Email Settings in `.env`

Open `backend/.env` and update the email configuration:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
EMAIL_FROM=noreply@nmn.org
ORG_NAME=National Migrant Network
```

## Gmail Setup (Recommended for Development)

### Option 1: Using Gmail App Password (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Create an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "NMN Backend" as the name
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

3. **Update .env**:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=youremail@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop
   ```

### Option 2: Using Other Email Services

#### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

#### AWS SES
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your-ses-smtp-username
EMAIL_PASSWORD=your-ses-smtp-password
```

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-outlook-email@outlook.com
EMAIL_PASSWORD=your-password
```

## Features Implemented

### 1. Volunteer Approval Email
When an admin approves a volunteer application:
- ✅ Professional HTML email sent to volunteer
- ✅ Includes welcome message and next steps
- ✅ Branded with organization name and colors
- ✅ Plain text fallback for email clients that don't support HTML

### 2. Graceful Failure
- If email is not configured, the system continues to work
- Admin approval still succeeds
- Warning logged in console
- No errors thrown to admin

### 3. Email Template Includes:
- Personalized greeting with volunteer's name
- Congratulations message
- What happens next (timeline and steps)
- Call-to-action button to visit website
- Professional footer with organization details

## Testing

### 1. Test Email Configuration
```bash
# Start the backend server
cd backend
npm run dev
```

### 2. Approve a Volunteer
1. Go to Admin Panel → Volunteers
2. Click "Approve" on any pending volunteer
3. Check the console for email status:
   - ✅ Success: "Approval email sent to volunteer@email.com"
   - ⚠️  Failed: "Volunteer approved but email failed: [reason]"

### 3. Check Volunteer's Email
- Check inbox (and spam folder)
- Email should arrive within 1-2 minutes

## Troubleshooting

### "Email not configured" warning
- Check that `EMAIL_USER` and `EMAIL_PASSWORD` are set in `.env`
- Restart the backend server after updating `.env`

### "Invalid login" error
- For Gmail: Make sure you're using an App Password, not your regular password
- For other services: Verify credentials are correct

### "Connection timeout" error
- Check that `EMAIL_HOST` and `EMAIL_PORT` are correct
- Ensure your firewall isn't blocking SMTP connections
- Some networks block port 587 - try port 465 with `secure: true`

### Emails going to spam
- Add SPF and DKIM records to your domain
- Use a verified sender email
- Consider using professional email services like SendGrid or AWS SES for production

## Production Recommendations

For production deployment:

1. **Use Professional Email Service**:
   - SendGrid (recommended)
   - AWS SES
   - Mailgun
   - Postmark

2. **Domain Verification**:
   - Set up SPF records
   - Configure DKIM
   - Add DMARC policy

3. **Monitoring**:
   - Track email delivery rates
   - Monitor bounce rates
   - Log failed emails for retry

4. **Security**:
   - Never commit `.env` file to git
   - Use environment variables in production
   - Rotate email credentials regularly

## Email Preview

### Subject Line
```
Welcome to National Migrant Network - Your Volunteer Application is Approved! 🎉
```

### Email Content
- Professional header with gradient background
- Personalized greeting
- Congratulations message
- "What's Next?" section with timeline
- Call-to-action button
- Organization footer

## Optional: Contact Form Acknowledgment

The email service also includes a function for sending acknowledgment emails when users submit the contact form. To enable this:

1. Import the function in `contactController.js`:
```javascript
const { sendContactAcknowledgment } = require('../services/emailService');
```

2. Call it after successful submission:
```javascript
await sendContactAcknowledgment({
  name: contact.name,
  email: contact.email
});
```

## Support

If you encounter issues:
1. Check the backend console logs for detailed error messages
2. Verify `.env` configuration
3. Test email credentials manually
4. Check spam folder
5. Review firewall/network settings

## Files Modified

- ✅ `backend/src/config/email.js` - Email configuration
- ✅ `backend/src/services/emailService.js` - Email templates and sending logic
- ✅ `backend/src/controllers/volunteerController.js` - Integrated email sending on approval
- ✅ `backend/.env` - Added email configuration variables
- ✅ `EMAIL_SETUP.md` - This setup guide
