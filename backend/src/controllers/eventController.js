/**
 * Events Controller
 * Handle CRUD operations for events
 */

const { query } = require('../config/database');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { generateSlug } = require('../utils/slug');

// Get all events (Public)
const getAllEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, upcoming } = req.query;
    const offset = (page - 1) * limit;

    let queryText = 'SELECT * FROM events WHERE is_published = true';

    if (upcoming === 'true') {
      queryText += ' AND event_date >= CURRENT_TIMESTAMP';
    }

    queryText += ' ORDER BY event_date ASC LIMIT $1 OFFSET $2';

    const result = await query(queryText, [limit, offset]);

    const countResult = await query('SELECT COUNT(*) FROM events WHERE is_published = true');
    const total = parseInt(countResult.rows[0].count);

    return paginatedResponse(res, result.rows, page, limit, total);

  } catch (error) {
    console.error('Get events error:', error);
    return errorResponse(res, 'Failed to get events', 500);
  }
};

// Get single event by slug (Public)
const getEventBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await query(
      'SELECT * FROM events WHERE slug = $1 AND is_published = true',
      [slug]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Event not found', 404);
    }

    return successResponse(res, result.rows[0]);

  } catch (error) {
    console.error('Get event error:', error);
    return errorResponse(res, 'Failed to get event', 500);
  }
};

// Create event (Admin)
const createEvent = async (req, res) => {
  try {
    const {
      title, description, full_description, image_url, event_date,
      end_date, location, venue, registration_link, is_featured, is_published, max_participants
    } = req.body;

    const slug = generateSlug(title);

    const result = await query(
      `INSERT INTO events (title, slug, description, full_description, image_url, event_date,
       end_date, location, venue, registration_link, is_featured, is_published, max_participants, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [title, slug, description, full_description, image_url, event_date, end_date,
       location, venue, registration_link, is_featured, is_published, max_participants, req.admin.id]
    );

    return successResponse(res, result.rows[0], 'Event created successfully', 201);

  } catch (error) {
    console.error('Create event error:', error);
    return errorResponse(res, 'Failed to create event', 500);
  }
};

// Update event (Admin)
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, full_description, image_url, event_date,
      end_date, location, venue, registration_link, is_featured, is_published, max_participants
    } = req.body;

    const slug = generateSlug(title);

    const result = await query(
      `UPDATE events
       SET title = $1, slug = $2, description = $3, full_description = $4, image_url = $5,
           event_date = $6, end_date = $7, location = $8, venue = $9, registration_link = $10,
           is_featured = $11, is_published = $12, max_participants = $13
       WHERE id = $14 RETURNING *`,
      [title, slug, description, full_description, image_url, event_date, end_date,
       location, venue, registration_link, is_featured, is_published, max_participants, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Event not found', 404);
    }

    return successResponse(res, result.rows[0], 'Event updated successfully');

  } catch (error) {
    console.error('Update event error:', error);
    return errorResponse(res, 'Failed to update event', 500);
  }
};

// Delete event (Admin)
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM events WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Event not found', 404);
    }

    return successResponse(res, null, 'Event deleted successfully');

  } catch (error) {
    console.error('Delete event error:', error);
    return errorResponse(res, 'Failed to delete event', 500);
  }
};

// Get all events for admin (Admin)
const getAdminEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await query(
      'SELECT * FROM events ORDER BY event_date DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) FROM events');
    const total = parseInt(countResult.rows[0].count);

    return paginatedResponse(res, result.rows, page, limit, total);

  } catch (error) {
    console.error('Get admin events error:', error);
    return errorResponse(res, 'Failed to get events', 500);
  }
};

module.exports = {
  getAllEvents,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent,
  getAdminEvents
};
