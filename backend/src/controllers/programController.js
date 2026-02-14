/**
 * Programs Controller
 * Handle CRUD operations for programs
 */

const { query } = require('../config/database');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { generateSlug } = require('../utils/slug');

/**
 * Get all programs (Public)
 * GET /api/programs
 */
const getAllPrograms = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, featured } = req.query;
    const offset = (page - 1) * limit;

    let queryText = 'SELECT * FROM programs WHERE is_published = true';
    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      queryText += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (featured === 'true') {
      queryText += ' AND is_featured = true';
    }

    queryText += ' ORDER BY created_at DESC LIMIT $' + (paramCount + 1) + ' OFFSET $' + (paramCount + 2);
    params.push(limit, offset);

    const result = await query(queryText, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM programs WHERE is_published = true';
    const countParams = [];

    if (status) {
      countQuery += ' AND status = $1';
      countParams.push(status);
    }

    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return paginatedResponse(res, result.rows, page, limit, total);

  } catch (error) {
    console.error('Get programs error:', error);
    return errorResponse(res, 'Failed to get programs', 500);
  }
};

/**
 * Get single program by slug (Public)
 * GET /api/programs/:slug
 */
const getProgramBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await query(
      'SELECT * FROM programs WHERE slug = $1 AND is_published = true',
      [slug]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Program not found', 404);
    }

    return successResponse(res, result.rows[0]);

  } catch (error) {
    console.error('Get program error:', error);
    return errorResponse(res, 'Failed to get program', 500);
  }
};

/**
 * Create program (Admin)
 * POST /api/admin/programs
 */
const createProgram = async (req, res) => {
  try {
    const {
      title,
      description,
      full_description,
      image_url,
      start_date,
      end_date,
      status,
      location,
      beneficiaries,
      is_featured,
      is_published
    } = req.body;

    const slug = generateSlug(title);

    const result = await query(
      `INSERT INTO programs (title, slug, description, full_description, image_url, start_date,
       end_date, status, location, beneficiaries, is_featured, is_published, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [title, slug, description, full_description, image_url, start_date, end_date,
       status, location, beneficiaries, is_featured, is_published, req.admin.id]
    );

    return successResponse(res, result.rows[0], 'Program created successfully', 201);

  } catch (error) {
    console.error('Create program error:', error);

    if (error.code === '23505') {
      return errorResponse(res, 'Program with this title already exists', 409);
    }

    return errorResponse(res, 'Failed to create program', 500);
  }
};

/**
 * Update program (Admin)
 * PUT /api/admin/programs/:id
 */
const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      full_description,
      image_url,
      start_date,
      end_date,
      status,
      location,
      beneficiaries,
      is_featured,
      is_published
    } = req.body;

    const slug = generateSlug(title);

    const result = await query(
      `UPDATE programs
       SET title = $1, slug = $2, description = $3, full_description = $4, image_url = $5,
           start_date = $6, end_date = $7, status = $8, location = $9, beneficiaries = $10,
           is_featured = $11, is_published = $12
       WHERE id = $13
       RETURNING *`,
      [title, slug, description, full_description, image_url, start_date, end_date,
       status, location, beneficiaries, is_featured, is_published, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Program not found', 404);
    }

    return successResponse(res, result.rows[0], 'Program updated successfully');

  } catch (error) {
    console.error('Update program error:', error);
    return errorResponse(res, 'Failed to update program', 500);
  }
};

/**
 * Delete program (Admin)
 * DELETE /api/admin/programs/:id
 */
const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM programs WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Program not found', 404);
    }

    return successResponse(res, null, 'Program deleted successfully');

  } catch (error) {
    console.error('Delete program error:', error);
    return errorResponse(res, 'Failed to delete program', 500);
  }
};

/**
 * Get all programs for admin (Admin)
 * GET /api/admin/programs
 */
const getAdminPrograms = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await query(
      'SELECT * FROM programs ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) FROM programs');
    const total = parseInt(countResult.rows[0].count);

    return paginatedResponse(res, result.rows, page, limit, total);

  } catch (error) {
    console.error('Get admin programs error:', error);
    return errorResponse(res, 'Failed to get programs', 500);
  }
};

module.exports = {
  getAllPrograms,
  getProgramBySlug,
  createProgram,
  updateProgram,
  deleteProgram,
  getAdminPrograms
};
