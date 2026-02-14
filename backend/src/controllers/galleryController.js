/**
 * Gallery Controller
 * Handle CRUD operations for gallery albums and images
 */

const { query } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');
const { generateSlug } = require('../utils/slug');

// Get all gallery albums (Public)
const getAllAlbums = async (req, res) => {
  try {
    const result = await query(
      `SELECT a.*, COUNT(i.id) as image_count
       FROM gallery_albums a
       LEFT JOIN gallery_images i ON a.id = i.album_id
       WHERE a.is_published = true
       GROUP BY a.id
       ORDER BY a.created_at DESC`
    );

    return successResponse(res, result.rows);

  } catch (error) {
    console.error('Get albums error:', error);
    return errorResponse(res, 'Failed to get albums', 500);
  }
};

// Get album with images (Public)
const getAlbumBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const albumResult = await query(
      'SELECT * FROM gallery_albums WHERE slug = $1 AND is_published = true',
      [slug]
    );

    if (albumResult.rows.length === 0) {
      return errorResponse(res, 'Album not found', 404);
    }

    const album = albumResult.rows[0];

    const imagesResult = await query(
      'SELECT * FROM gallery_images WHERE album_id = $1 ORDER BY display_order ASC',
      [album.id]
    );

    return successResponse(res, {
      ...album,
      images: imagesResult.rows
    });

  } catch (error) {
    console.error('Get album error:', error);
    return errorResponse(res, 'Failed to get album', 500);
  }
};

// Create album (Admin)
const createAlbum = async (req, res) => {
  try {
    const { title, description, cover_image_url, is_published } = req.body;

    const slug = generateSlug(title);

    const result = await query(
      `INSERT INTO gallery_albums (title, slug, description, cover_image_url, is_published, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, slug, description, cover_image_url, is_published, req.admin.id]
    );

    return successResponse(res, result.rows[0], 'Album created successfully', 201);

  } catch (error) {
    console.error('Create album error:', error);
    return errorResponse(res, 'Failed to create album', 500);
  }
};

// Update album (Admin)
const updateAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, cover_image_url, is_published } = req.body;

    const slug = generateSlug(title);

    const result = await query(
      `UPDATE gallery_albums
       SET title = $1, slug = $2, description = $3, cover_image_url = $4, is_published = $5
       WHERE id = $6 RETURNING *`,
      [title, slug, description, cover_image_url, is_published, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Album not found', 404);
    }

    return successResponse(res, result.rows[0], 'Album updated successfully');

  } catch (error) {
    console.error('Update album error:', error);
    return errorResponse(res, 'Failed to update album', 500);
  }
};

// Delete album (Admin)
const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM gallery_albums WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Album not found', 404);
    }

    return successResponse(res, null, 'Album deleted successfully');

  } catch (error) {
    console.error('Delete album error:', error);
    return errorResponse(res, 'Failed to delete album', 500);
  }
};

// Add image to album (Admin)
const addImageToAlbum = async (req, res) => {
  try {
    const { album_id, title, description, image_url, display_order } = req.body;

    const result = await query(
      `INSERT INTO gallery_images (album_id, title, description, image_url, display_order, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [album_id, title, description, image_url, display_order || 0, req.admin.id]
    );

    return successResponse(res, result.rows[0], 'Image added successfully', 201);

  } catch (error) {
    console.error('Add image error:', error);
    return errorResponse(res, 'Failed to add image', 500);
  }
};

// Delete image (Admin)
const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM gallery_images WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Image not found', 404);
    }

    return successResponse(res, null, 'Image deleted successfully');

  } catch (error) {
    console.error('Delete image error:', error);
    return errorResponse(res, 'Failed to delete image', 500);
  }
};

// Get all albums for admin (Admin)
const getAdminAlbums = async (req, res) => {
  try {
    const result = await query(
      `SELECT a.*, COUNT(i.id) as image_count
       FROM gallery_albums a
       LEFT JOIN gallery_images i ON a.id = i.album_id
       GROUP BY a.id
       ORDER BY a.created_at DESC`
    );

    return successResponse(res, result.rows);

  } catch (error) {
    console.error('Get admin albums error:', error);
    return errorResponse(res, 'Failed to get albums', 500);
  }
};

module.exports = {
  getAllAlbums,
  getAlbumBySlug,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addImageToAlbum,
  deleteImage,
  getAdminAlbums
};
