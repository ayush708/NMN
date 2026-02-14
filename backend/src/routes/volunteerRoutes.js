/**
 * Volunteer Routes
 * /api/volunteer (public)
 * /api/admin/volunteers (admin)
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { formLimiter } = require('../middleware/rateLimiter');
const {
  submitVolunteer,
  getAllVolunteers,
  getVolunteerById,
  approveVolunteer,
  deleteVolunteer
} = require('../controllers/volunteerController');

// Validation rules
const volunteerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone is required')
];

// Public routes (with rate limiting to prevent spam)
router.post('/', formLimiter, volunteerValidation, validate, submitVolunteer);

// Admin routes
router.get('/admin/all', authenticate, getAllVolunteers);
router.get('/admin/:id', authenticate, getVolunteerById);
router.put('/admin/:id/approve', authenticate, approveVolunteer);
router.delete('/admin/:id', authenticate, deleteVolunteer);

module.exports = router;
