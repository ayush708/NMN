/**
 * News Routes
 * /api/news (public)
 * /api/admin/news (admin)
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const {
  getAllNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
  getAdminNews
} = require('../controllers/newsController');

// Validation rules
const newsValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
];

// Admin routes (must come before dynamic routes)
router.get('/admin/all', authenticate, getAdminNews);
router.post('/admin', authenticate, newsValidation, validate, createNews);
router.put('/admin/:id', authenticate, newsValidation, validate, updateNews);
router.delete('/admin/:id', authenticate, deleteNews);

// Public routes
router.get('/', getAllNews);
router.get('/:slug', getNewsBySlug);

module.exports = router;
