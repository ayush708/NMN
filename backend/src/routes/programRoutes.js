/**
 * Program Routes
 * /api/programs (public)
 * /api/admin/programs (admin)
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const {
  getAllPrograms,
  getProgramBySlug,
  createProgram,
  updateProgram,
  deleteProgram,
  getAdminPrograms
} = require('../controllers/programController');

// Validation rules
const programValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required')
];

// Admin routes (must come before dynamic routes)
router.get('/admin/all', authenticate, getAdminPrograms);
router.post('/admin', authenticate, programValidation, validate, createProgram);
router.put('/admin/:id', authenticate, programValidation, validate, updateProgram);
router.delete('/admin/:id', authenticate, deleteProgram);

// Public routes
router.get('/', getAllPrograms);
router.get('/:slug', getProgramBySlug);

module.exports = router;
