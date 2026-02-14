/**
 * Contact Routes
 * /api/contact (public)
 * /api/admin/contact (admin)
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { formLimiter } = require('../middleware/rateLimiter');
const {
  submitContact,
  getAllMessages,
  markAsRead,
  deleteMessage
} = require('../controllers/contactController');

// Validation rules
const contactValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message is required')
];

// Public routes (with rate limiting to prevent spam)
router.post('/', formLimiter, contactValidation, validate, submitContact);

// Admin routes
router.get('/admin/messages', authenticate, getAllMessages);
router.put('/admin/messages/:id/read', authenticate, markAsRead);
router.delete('/admin/messages/:id', authenticate, deleteMessage);

module.exports = router;
