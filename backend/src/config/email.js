/**
 * Email Configuration
 * Using nodemailer for sending emails
 */

const nodemailer = require('nodemailer');

const resolveDefaultHost = () => {
  if (process.env.EMAIL_HOST) return process.env.EMAIL_HOST;
  if ((process.env.EMAIL_USER || '').toLowerCase().endsWith('@gmail.com')) return 'smtp.gmail.com';
  return 'smtp-relay.brevo.com';
};

// Create reusable transporter
const createTransporter = () => {
  // Default to Brevo SMTP, but keep this configurable for any SMTP provider.

  const config = {
    host: resolveDefaultHost(),
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    connectionTimeout: parseInt(process.env.EMAIL_CONNECTION_TIMEOUT || '8000', 10),
    greetingTimeout: parseInt(process.env.EMAIL_GREETING_TIMEOUT || '8000', 10),
    socketTimeout: parseInt(process.env.EMAIL_SOCKET_TIMEOUT || '10000', 10),
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
