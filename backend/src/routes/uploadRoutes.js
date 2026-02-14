/**
 * Upload Routes
 * /api/upload (admin only)
 */

const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { authenticate } = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimiter');
const {
  uploadSingleFile,
  uploadMultipleFiles
} = require('../controllers/uploadController');

// All upload routes require authentication and have rate limiting
router.post('/single', authenticate, uploadLimiter, upload.single('file'), uploadSingleFile);
router.post('/multiple', authenticate, uploadLimiter, upload.array('files', 10), uploadMultipleFiles);

module.exports = router;
