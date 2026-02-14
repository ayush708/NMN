/**
 * E-Learning Controller
 * Handle CRUD operations for e-learning categories and contents
 */

const { query } = require('../config/database');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { generateSlug } = require('../utils/slug');

// Get all e-learning categories (Public)
const getAllCategories = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM elearning_categories WHERE is_active = true ORDER BY display_order ASC'
    );

    return successResponse(res, result.rows);

  } catch (error) {
    console.error('Get categories error:', error);
    return errorResponse(res, 'Failed to get categories', 500);
  }
};

// Get e-learning contents by category (Public)
const getContentsByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Get category
    const categoryResult = await query(
      'SELECT id FROM elearning_categories WHERE slug = $1 AND is_active = true',
      [categorySlug]
    );

    if (categoryResult.rows.length === 0) {
      return errorResponse(res, 'Category not found', 404);
    }

    const categoryId = categoryResult.rows[0].id;

    const result = await query(
      `SELECT * FROM elearning_contents
       WHERE category_id = $1 AND is_published = true
       ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [categoryId, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) FROM elearning_contents WHERE category_id = $1 AND is_published = true',
      [categoryId]
    );
    const total = parseInt(countResult.rows[0].count);

    return paginatedResponse(res, result.rows, page, limit, total);

  } catch (error) {
    console.error('Get contents error:', error);
    return errorResponse(res, 'Failed to get contents', 500);
  }
};

// Get single e-learning content (Public)
const getContentBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await query(
      `SELECT ec.*, cat.name as category_name, cat.slug as category_slug
       FROM elearning_contents ec
       JOIN elearning_categories cat ON ec.category_id = cat.id
       WHERE ec.slug = $1 AND ec.is_published = true`,
      [slug]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Content not found', 404);
    }

    // Increment views
    await query('UPDATE elearning_contents SET views = views + 1 WHERE id = $1', [result.rows[0].id]);

    return successResponse(res, result.rows[0]);

  } catch (error) {
    console.error('Get content error:', error);
    return errorResponse(res, 'Failed to get content', 500);
  }
};

// Create e-learning content (Admin)
const createContent = async (req, res) => {
  try {
    const {
      category_id, title, description, content, content_type, file_url,
      video_url, duration, difficulty_level, language, is_published
    } = req.body;

    const slug = generateSlug(title);

    const result = await query(
      `INSERT INTO elearning_contents (category_id, title, slug, description, content, content_type,
       file_url, video_url, duration, difficulty_level, language, is_published, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [category_id, title, slug, description, content, content_type, file_url,
       video_url, duration, difficulty_level, language, is_published, req.admin.id]
    );

    return successResponse(res, result.rows[0], 'Content created successfully', 201);

  } catch (error) {
    console.error('Create content error:', error);
    return errorResponse(res, 'Failed to create content', 500);
  }
};

// Update e-learning content (Admin)
const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      category_id, title, description, content, content_type, file_url,
      video_url, duration, difficulty_level, language, is_published
    } = req.body;

    const slug = generateSlug(title);

    const result = await query(
      `UPDATE elearning_contents
       SET category_id = $1, title = $2, slug = $3, description = $4, content = $5,
           content_type = $6, file_url = $7, video_url = $8, duration = $9,
           difficulty_level = $10, language = $11, is_published = $12
       WHERE id = $13 RETURNING *`,
      [category_id, title, slug, description, content, content_type, file_url,
       video_url, duration, difficulty_level, language, is_published, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Content not found', 404);
    }

    return successResponse(res, result.rows[0], 'Content updated successfully');

  } catch (error) {
    console.error('Update content error:', error);
    return errorResponse(res, 'Failed to update content', 500);
  }
};

// Delete e-learning content (Admin)
const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM elearning_contents WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Content not found', 404);
    }

    return successResponse(res, null, 'Content deleted successfully');

  } catch (error) {
    console.error('Delete content error:', error);
    return errorResponse(res, 'Failed to delete content', 500);
  }
};

// Get all e-learning contents for admin (Admin)
const getAdminContents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT ec.*, cat.name as category_name
       FROM elearning_contents ec
       JOIN elearning_categories cat ON ec.category_id = cat.id
       ORDER BY ec.created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) FROM elearning_contents');
    const total = parseInt(countResult.rows[0].count);

    return paginatedResponse(res, result.rows, page, limit, total);

  } catch (error) {
    console.error('Get admin contents error:', error);
    return errorResponse(res, 'Failed to get contents', 500);
  }
};

module.exports = {
  getAllCategories,
  getContentsByCategory,
  getContentBySlug,
  createContent,
  updateContent,
  deleteContent,
  getAdminContents
};
