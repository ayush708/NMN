/**
 * Site Settings Controller
 * Handle site configuration and settings
 */

const { query } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

// Get site settings (Public)
const getSettings = async (req, res) => {
  try {
    const result = await query('SELECT * FROM site_settings LIMIT 1');

    if (result.rows.length === 0) {
      return errorResponse(res, 'Settings not found', 404);
    }

    return successResponse(res, result.rows[0]);

  } catch (error) {
    console.error('Get settings error:', error);
    return errorResponse(res, 'Failed to get settings', 500);
  }
};

// Get statistics (Public)
const getStatistics = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM statistics WHERE is_active = true ORDER BY display_order ASC'
    );

    return successResponse(res, result.rows);

  } catch (error) {
    console.error('Get statistics error:', error);
    return errorResponse(res, 'Failed to get statistics', 500);
  }
};

// Get banners (Public)
const getBanners = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM banners WHERE is_active = true ORDER BY display_order ASC'
    );

    return successResponse(res, result.rows);

  } catch (error) {
    console.error('Get banners error:', error);
    return errorResponse(res, 'Failed to get banners', 500);
  }
};

// Get partners (Public)
const getPartners = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM partners WHERE is_active = true ORDER BY display_order ASC'
    );

    return successResponse(res, result.rows);

  } catch (error) {
    console.error('Get partners error:', error);
    return errorResponse(res, 'Failed to get partners', 500);
  }
};

// Update site settings (Admin)
const updateSettings = async (req, res) => {
  try {
    const {
      site_title, site_tagline, logo_url, favicon_url, contact_email, contact_phone,
      contact_address, facebook_url, twitter_url, instagram_url, linkedin_url,
      youtube_url, map_embed_url, footer_text, about_text, about_image, mission,
      mission_image, vision, vision_image, values, values_image
    } = req.body;

    const result = await query(
      `UPDATE site_settings
       SET site_title = $1, site_tagline = $2, logo_url = $3, favicon_url = $4,
           contact_email = $5, contact_phone = $6, contact_address = $7,
           facebook_url = $8, twitter_url = $9, instagram_url = $10,
           linkedin_url = $11, youtube_url = $12, map_embed_url = $13,
           footer_text = $14, about_text = $15, about_image = $16, mission = $17,
           mission_image = $18, vision = $19, vision_image = $20, values = $21, values_image = $22
       WHERE id = 1
       RETURNING *`,
      [site_title, site_tagline, logo_url, favicon_url, contact_email, contact_phone,
       contact_address, facebook_url, twitter_url, instagram_url, linkedin_url,
       youtube_url, map_embed_url, footer_text, about_text, about_image, mission,
       mission_image, vision, vision_image, values, values_image]
    );

    return successResponse(res, result.rows[0], 'Settings updated successfully');

  } catch (error) {
    console.error('Update settings error:', error);
    return errorResponse(res, 'Failed to update settings', 500);
  }
};

// Update statistic (Admin)
const updateStatistic = async (req, res) => {
  try {
    const { id } = req.params;
    const { metric_name, metric_value, metric_label, display_order, is_active } = req.body;

    const result = await query(
      `UPDATE statistics
       SET metric_name = $1, metric_value = $2, metric_label = $3,
           display_order = $4, is_active = $5
       WHERE id = $6 RETURNING *`,
      [metric_name, metric_value, metric_label, display_order, is_active, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Statistic not found', 404);
    }

    return successResponse(res, result.rows[0], 'Statistic updated successfully');

  } catch (error) {
    console.error('Update statistic error:', error);
    return errorResponse(res, 'Failed to update statistic', 500);
  }
};

// Create banner (Admin)
const createBanner = async (req, res) => {
  try {
    const { title, subtitle, description, image_url, button_text, button_link, display_order, is_active } = req.body;

    const result = await query(
      `INSERT INTO banners (title, subtitle, description, image_url, button_text, button_link, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, subtitle, description, image_url, button_text, button_link, display_order || 0, is_active]
    );

    return successResponse(res, result.rows[0], 'Banner created successfully', 201);

  } catch (error) {
    console.error('Create banner error:', error);
    return errorResponse(res, 'Failed to create banner', 500);
  }
};

// Update banner (Admin)
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, image_url, button_text, button_link, display_order, is_active } = req.body;

    const result = await query(
      `UPDATE banners
       SET title = $1, subtitle = $2, description = $3, image_url = $4,
           button_text = $5, button_link = $6, display_order = $7, is_active = $8
       WHERE id = $9 RETURNING *`,
      [title, subtitle, description, image_url, button_text, button_link, display_order, is_active, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Banner not found', 404);
    }

    return successResponse(res, result.rows[0], 'Banner updated successfully');

  } catch (error) {
    console.error('Update banner error:', error);
    return errorResponse(res, 'Failed to update banner', 500);
  }
};

// Delete banner (Admin)
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM banners WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Banner not found', 404);
    }

    return successResponse(res, null, 'Banner deleted successfully');

  } catch (error) {
    console.error('Delete banner error:', error);
    return errorResponse(res, 'Failed to delete banner', 500);
  }
};

// Dashboard statistics (Admin)
const getDashboardStats = async (req, res) => {
  try {
    const programsCount = await query('SELECT COUNT(*) FROM programs');
    const eventsCount = await query('SELECT COUNT(*) FROM events');
    const newsCount = await query('SELECT COUNT(*) FROM news');
    const volunteersCount = await query('SELECT COUNT(*) FROM volunteers');
    const contactsCount = await query('SELECT COUNT(*) FROM contact_messages WHERE is_read = false');

    return successResponse(res, {
      programs: parseInt(programsCount.rows[0].count),
      events: parseInt(eventsCount.rows[0].count),
      news: parseInt(newsCount.rows[0].count),
      volunteers: parseInt(volunteersCount.rows[0].count),
      unreadMessages: parseInt(contactsCount.rows[0].count)
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return errorResponse(res, 'Failed to get dashboard stats', 500);
  }
};

module.exports = {
  getSettings,
  getStatistics,
  getBanners,
  getPartners,
  updateSettings,
  updateStatistic,
  createBanner,
  updateBanner,
  deleteBanner,
  getDashboardStats
};
