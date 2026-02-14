/**
 * Gallery Routes
 * /api/gallery (public)
 * /api/admin/gallery (admin)
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const {
  getAllAlbums,
  getAlbumBySlug,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addImageToAlbum,
  deleteImage,
  getAdminAlbums
} = require('../controllers/galleryController');

// Validation rules
const albumValidation = [
  body('title').notEmpty().withMessage('Title is required')
];

const imageValidation = [
  body('album_id').notEmpty().withMessage('Album ID is required'),
  body('image_url').notEmpty().withMessage('Image URL is required')
];

// Public routes
router.get('/albums', getAllAlbums);
router.get('/albums/:slug', getAlbumBySlug);

// Admin routes
router.get('/admin/albums', authenticate, getAdminAlbums);
router.post('/admin/albums', authenticate, albumValidation, validate, createAlbum);
router.put('/admin/albums/:id', authenticate, albumValidation, validate, updateAlbum);
router.delete('/admin/albums/:id', authenticate, deleteAlbum);
router.post('/admin/images', authenticate, imageValidation, validate, addImageToAlbum);
router.delete('/admin/images/:id', authenticate, deleteImage);

module.exports = router;
