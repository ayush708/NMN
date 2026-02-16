/**
 * Resources Controller
 * Handle CRUD operations for resources/documents
 */

const { query } = require('../config/database');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

// Get all resources (Public)
const getAllResources = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const offset = (page - 1) * limit;

    let queryText = 'SELECT * FROM resources WHERE is_published = true';
    const params = [];

    if (category) {
      queryText += ' AND category = $1';
      params.push(category);
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    let countQuery = 'SELECT COUNT(*) FROM resources WHERE is_published = true';
    const countParams = category ? [category] : [];
    if (category) countQuery += ' AND category = $1';

    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return paginatedResponse(res, result.rows, page, limit, total);

  } catch (error) {
    console.error('Get resources error:', error);
    return errorResponse(res, 'Failed to get resources', 500);
  }
};

// Get single resource (Public)
const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM resources WHERE id = $1 AND is_published = true',
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Resource not found', 404);
    }

    // Increment download count
    await query('UPDATE resources SET download_count = download_count + 1 WHERE id = $1', [id]);

    return successResponse(res, result.rows[0]);

  } catch (error) {
    console.error('Get resource error:', error);
    return errorResponse(res, 'Failed to get resource', 500);
  }
};

// Create resource (Admin)
const createResource = async (req, res) => {
  try {
    const {
      title, description, file_url, file_type, file_size, category, is_published
    } = req.body;

    // Extract file name from URL if not provided
    const file_name = file_url ? file_url.split('/').pop() : null;

    const result = await query(
      `INSERT INTO resources (title, description, file_url, file_name, file_type, file_size, category, is_published, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [title, description, file_url, file_name, file_type, file_size, category, is_published, req.admin.id]
    );

    return successResponse(res, result.rows[0], 'Resource created successfully', 201);

  } catch (error) {
    console.error('Create resource error:', error);
    return errorResponse(res, 'Failed to create resource', 500);
  }
};

// Update resource (Admin)
const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, file_url, file_type, file_size, category, is_published
    } = req.body;

    // Extract file name from URL if not provided
    const file_name = file_url ? file_url.split('/').pop() : null;

    const result = await query(
      `UPDATE resources
       SET title = $1, description = $2, file_url = $3, file_name = $4, file_type = $5,
           file_size = $6, category = $7, is_published = $8
       WHERE id = $9 RETURNING *`,
      [title, description, file_url, file_name, file_type, file_size, category, is_published, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Resource not found', 404);
    }

    return successResponse(res, result.rows[0], 'Resource updated successfully');

  } catch (error) {
    console.error('Update resource error:', error);
    return errorResponse(res, 'Failed to update resource', 500);
  }
};

// Delete resource (Admin)
const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM resources WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Resource not found', 404);
    }

    return successResponse(res, null, 'Resource deleted successfully');

  } catch (error) {
    console.error('Delete resource error:', error);
    return errorResponse(res, 'Failed to delete resource', 500);
  }
};

// Get all resources for admin (Admin)
const getAdminResources = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await query(
      'SELECT * FROM resources ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) FROM resources');
    const total = parseInt(countResult.rows[0].count);

    return paginatedResponse(res, result.rows, page, limit, total);

  } catch (error) {
    console.error('Get admin resources error:', error);
    return errorResponse(res, 'Failed to get resources', 500);
  }
};

module.exports = {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  getAdminResources
};
