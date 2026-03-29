/**
 * Volunteer Controller
 * Handle volunteer applications
 */

const { query } = require('../config/database');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const {
  sendVolunteerApprovalEmail,
  sendVolunteerSubmissionAcknowledgment,
  sendVolunteerSubmissionAdminNotification,
} = require('../services/emailService');

// Submit volunteer application (Public)
const submitVolunteer = async (req, res) => {
  try {
    const {
      name, email, phone, address, city, state, country, date_of_birth,
      occupation, organization, skills, experience, availability, motivation, how_heard
    } = req.body;

    const result = await query(
      `INSERT INTO volunteers (name, email, phone, address, city, state, country, date_of_birth,
       occupation, organization, skills, experience, availability, motivation, how_heard)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING id, name, email, created_at`,
      [name, email, phone, address, city, state, country, date_of_birth,
       occupation, organization, skills, experience, availability, motivation, how_heard]
    );

    const volunteer = {
      ...result.rows[0],
      phone,
      city,
      country,
      occupation,
      availability,
      motivation,
    };

    // Send emails as non-blocking best-effort actions.
    try {
      await Promise.allSettled([
        sendVolunteerSubmissionAcknowledgment(volunteer),
        sendVolunteerSubmissionAdminNotification(volunteer),
      ]);
    } catch (emailError) {
      console.error('⚠️ Volunteer submitted but email notifications failed:', emailError.message);
    }

    return successResponse(res, result.rows[0], 'Volunteer application submitted successfully', 201);

  } catch (error) {
    console.error('Submit volunteer error:', error);

    // Provide specific error messages for better UX
    let errorMessage = 'Failed to submit application';

    if (error.code === '23505') {
      // Duplicate key violation
      errorMessage = 'This email is already registered. Please use a different email.';
    } else if (error.code === '22007') {
      // Invalid date format
      errorMessage = 'Invalid date format. Please check the date of birth field.';
    } else if (error.code === '23502') {
      // Not null violation — do not expose column name
      errorMessage = 'A required field is missing. Please fill in all required fields.';
    }

    return errorResponse(res, errorMessage, 400);
  }
};

// Get all volunteers (Admin)
const getAllVolunteers = async (req, res) => {
  try {
    const { page = 1, limit = 20, is_approved } = req.query;
    const offset = (page - 1) * limit;

    let queryText = 'SELECT * FROM volunteers';
    const params = [];

    if (is_approved !== undefined) {
      queryText += ' WHERE is_approved = $1';
      params.push(is_approved === 'true');
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    let countQuery = 'SELECT COUNT(*) FROM volunteers';
    const countParams = [];
    if (is_approved !== undefined) {
      countQuery += ' WHERE is_approved = $1';
      countParams.push(is_approved === 'true');
    }

    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return paginatedResponse(res, result.rows, page, limit, total);

  } catch (error) {
    console.error('Get volunteers error:', error);
    return errorResponse(res, 'Failed to get volunteers', 500);
  }
};

// Get single volunteer (Admin)
const getVolunteerById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('SELECT * FROM volunteers WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Volunteer not found', 404);
    }

    return successResponse(res, result.rows[0]);

  } catch (error) {
    console.error('Get volunteer error:', error);
    return errorResponse(res, 'Failed to get volunteer', 500);
  }
};

// Approve volunteer (Admin)
const approveVolunteer = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'UPDATE volunteers SET is_approved = true WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Volunteer not found', 404);
    }

    const volunteer = result.rows[0];

    // Try to send approval email (non-blocking, optional)
    try {
      const emailResult = await sendVolunteerApprovalEmail({
        name: volunteer.name,
        email: volunteer.email
      });

      // Log email status
      if (emailResult.success) {
        console.log(`✅ Approval email sent to ${volunteer.email}`);
      } else {
        console.log(`⚠️  Volunteer approved but email failed: ${emailResult.message || emailResult.error}`);
      }
    } catch (emailError) {
      // Email failed but don't break the approval
      console.error('⚠️  Email service error (approval still succeeded):', emailError.message);
    }

    return successResponse(res, volunteer, 'Volunteer approved successfully');

  } catch (error) {
    console.error('Approve volunteer error:', error);
    return errorResponse(res, 'Failed to approve volunteer', 500);
  }
};

// Delete volunteer (Admin)
const deleteVolunteer = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM volunteers WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Volunteer not found', 404);
    }

    return successResponse(res, null, 'Volunteer deleted successfully');

  } catch (error) {
    console.error('Delete volunteer error:', error);
    return errorResponse(res, 'Failed to delete volunteer', 500);
  }
};

module.exports = {
  submitVolunteer,
  getAllVolunteers,
  getVolunteerById,
  approveVolunteer,
  deleteVolunteer
};
