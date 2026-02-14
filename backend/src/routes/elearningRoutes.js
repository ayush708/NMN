/**
 * E-Learning Routes
 * /api/elearning (public)
 * /api/admin/elearning (admin)
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const {
  getAllCategories,
  getContentsByCategory,
  getContentBySlug,
  createContent,
  updateContent,
  deleteContent,
  getAdminContents
} = require('../controllers/elearningController');

// Validation rules
const contentValidation = [
  body('category_id').notEmpty().withMessage('Category is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('content_type').notEmpty().withMessage('Content type is required')
];

// Public routes
router.get('/categories', getAllCategories);
router.get('/category/:categorySlug', getContentsByCategory);
router.get('/content/:slug', getContentBySlug);

// Admin routes
router.get('/admin/all', authenticate, getAdminContents);
router.post('/admin', authenticate, contentValidation, validate, createContent);
router.put('/admin/:id', authenticate, contentValidation, validate, updateContent);
router.delete('/admin/:id', authenticate, deleteContent);

module.exports = router;
