/**
 * Contact Controller
 * Handle contact form submissions
 */

const { query } = require('../config/database');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

// Submit contact form (Public)
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.headers['user-agent'];

    const result = await query(
      `INSERT INTO contact_messages (name, email, phone, subject, message, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, created_at`,
      [name, email, phone, subject, message, ip_address, user_agent]
    );

    return successResponse(res, result.rows[0], 'Message sent successfully', 201);

  } catch (error) {
    console.error('Submit contact error:', error);

    // Provide specific error messages for better UX
    let errorMessage = 'Failed to send message';

    if (error.code === '23505') {
      // Duplicate key violation (unlikely but possible)
      errorMessage = 'This message has already been submitted.';
    } else if (error.code === '23502') {
      // Not null violation — do not expose column name
      errorMessage = 'A required field is missing. Please fill in all required fields.';
    }

    return errorResponse(res, errorMessage, 400);
  }
};

// Get all contact messages (Admin)
const getAllMessages = async (req, res) => {
  try {
    const { page = 1, limit = 20, is_read } = req.query;
    const offset = (page - 1) * limit;

    let queryText = 'SELECT * FROM contact_messages';
    const params = [];

    if (is_read !== undefined) {
      queryText += ' WHERE is_read = $1';
      params.push(is_read === 'true');
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    let countQuery = 'SELECT COUNT(*) FROM contact_messages';
    const countParams = [];
    if (is_read !== undefined) {
      countQuery += ' WHERE is_read = $1';
      countParams.push(is_read === 'true');
    }

    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return paginatedResponse(res, result.rows, page, limit, total);

  } catch (error) {
    console.error('Get messages error:', error);
    return errorResponse(res, 'Failed to get messages', 500);
  }
};

// Mark message as read (Admin)
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'UPDATE contact_messages SET is_read = true WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Message not found', 404);
    }

    return successResponse(res, result.rows[0], 'Message marked as read');

  } catch (error) {
    console.error('Mark as read error:', error);
    return errorResponse(res, 'Failed to update message', 500);
  }
};

// Delete message (Admin)
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM contact_messages WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Message not found', 404);
    }

    return successResponse(res, null, 'Message deleted successfully');

  } catch (error) {
    console.error('Delete message error:', error);
    return errorResponse(res, 'Failed to delete message', 500);
  }
};

module.exports = {
  submitContact,
  getAllMessages,
  markAsRead,
  deleteMessage
};
