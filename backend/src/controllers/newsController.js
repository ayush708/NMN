/**
 * News Controller
 * Handle CRUD operations for news articles
 */

const { query } = require('../config/database');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { generateSlug } = require('../utils/slug');

// Get all news (Public)
const getAllNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const offset = (page - 1) * limit;

    let queryText = 'SELECT * FROM news WHERE is_published = true';
    const params = [];

    if (category) {
      queryText += ' AND category = $1';
      params.push(category);
    }

    queryText += ` ORDER BY published_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    let countQuery = 'SELECT COUNT(*) FROM news WHERE is_published = true';
    const countParams = category ? [category] : [];
    if (category) countQuery += ' AND category = $1';

    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return paginatedResponse(res, result.rows, page, limit, total);

  } catch (error) {
    console.error('Get news error:', error);
    return errorResponse(res, 'Failed to get news', 500);
  }
};

// Get single news by slug (Public)
const getNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await query(
      'SELECT * FROM news WHERE slug = $1 AND is_published = true',
      [slug]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'News not found', 404);
    }

    // Increment views
    await query('UPDATE news SET views = views + 1 WHERE id = $1', [result.rows[0].id]);

    return successResponse(res, result.rows[0]);

  } catch (error) {
    console.error('Get news error:', error);
    return errorResponse(res, 'Failed to get news', 500);
  }
};

// Create news (Admin)
const createNews = async (req, res) => {
  try {
    const {
      title, summary, content, image_url, category, is_featured, is_published
    } = req.body;

    const slug = generateSlug(title);

    const result = await query(
      `INSERT INTO news (title, slug, summary, content, image_url, category, is_featured, is_published, author_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [title, slug, summary, content, image_url, category, is_featured, is_published, req.admin.id]
    );

    return successResponse(res, result.rows[0], 'News created successfully', 201);

  } catch (error) {
    console.error('Create news error:', error);
    return errorResponse(res, 'Failed to create news', 500);
  }
};

// Update news (Admin)
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, summary, content, image_url, category, is_featured, is_published
    } = req.body;

    const slug = generateSlug(title);

    const result = await query(
      `UPDATE news
       SET title = $1, slug = $2, summary = $3, content = $4, image_url = $5,
           category = $6, is_featured = $7, is_published = $8
       WHERE id = $9 RETURNING *`,
      [title, slug, summary, content, image_url, category, is_featured, is_published, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'News not found', 404);
    }

    return successResponse(res, result.rows[0], 'News updated successfully');

  } catch (error) {
    console.error('Update news error:', error);
    return errorResponse(res, 'Failed to update news', 500);
  }
};

// Delete news (Admin)
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM news WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'News not found', 404);
    }

    return successResponse(res, null, 'News deleted successfully');

  } catch (error) {
    console.error('Delete news error:', error);
    return errorResponse(res, 'Failed to delete news', 500);
  }
};

// Get all news for admin (Admin)
const getAdminNews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await query(
      'SELECT * FROM news ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) FROM news');
    const total = parseInt(countResult.rows[0].count);

    return paginatedResponse(res, result.rows, page, limit, total);

  } catch (error) {
    console.error('Get admin news error:', error);
    return errorResponse(res, 'Failed to get news', 500);
  }
};

module.exports = {
  getAllNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
  getAdminNews
};
