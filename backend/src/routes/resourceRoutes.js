/**
 * Resource Routes
 * /api/resources (public)
 * /api/admin/resources (admin)
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  getAdminResources
} = require('../controllers/resourceController');

// Validation rules
const resourceValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('file_url').notEmpty().withMessage('File URL is required')
];

// Admin routes (must come before dynamic routes)
router.get('/admin/all', authenticate, getAdminResources);
router.post('/admin', authenticate, resourceValidation, validate, createResource);
router.put('/admin/:id', authenticate, resourceValidation, validate, updateResource);
router.delete('/admin/:id', authenticate, deleteResource);

// Public routes
router.get('/', getAllResources);
router.get('/:id', getResourceById);

module.exports = router;
