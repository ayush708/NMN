/**
 * Event Routes
 * /api/events (public)
 * /api/admin/events (admin)
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const {
  getAllEvents,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent,
  getAdminEvents
} = require('../controllers/eventController');

// Validation rules
const eventValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('event_date').notEmpty().withMessage('Event date is required')
];

// Admin routes (must come before dynamic routes)
router.get('/admin/all', authenticate, getAdminEvents);
router.post('/admin', authenticate, eventValidation, validate, createEvent);
router.put('/admin/:id', authenticate, eventValidation, validate, updateEvent);
router.delete('/admin/:id', authenticate, deleteEvent);

// Public routes
router.get('/', getAllEvents);
router.get('/:slug', getEventBySlug);

module.exports = router;
