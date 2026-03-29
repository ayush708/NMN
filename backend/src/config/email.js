/**
 * Email Configuration
 * Using nodemailer for sending emails
 */

const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  // Default to Brevo SMTP, but keep this configurable for any SMTP provider.

  const config = {
    host: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  // If no email credentials, log warning and return null
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('⚠️  Email credentials not configured. Email notifications will be disabled.');
    return null;
  }

  return nodemailer.createTransport(config);
};

// Get sender email
const getSenderEmail = () => {
  return process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@nmn.org';
};

// Get organization name
const getOrgName = () => {
  return process.env.ORG_NAME || 'National Migrant Network';
};

module.exports = {
  createTransporter,
  getSenderEmail,
  getOrgName
};
