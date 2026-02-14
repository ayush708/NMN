/**
 * Authentication Middleware
 * Verify JWT tokens and protect admin routes
 */

const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');
const { query } = require('../config/database');

/**
 * Verify JWT token from request header
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    // Get admin user from database
    const result = await query(
      'SELECT id, name, email, role, is_active FROM admins WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Admin not found', 404);
    }

    const admin = result.rows[0];

    if (!admin.is_active) {
      return errorResponse(res, 'Account is deactivated', 403);
    }

    // Attach admin to request
    req.admin = admin;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return errorResponse(res, 'Invalid or expired token', 401);
  }
};

/**
 * Check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (req.admin && req.admin.role === 'admin') {
    next();
  } else {
    return errorResponse(res, 'Access denied. Admin only.', 403);
  }
};

module.exports = {
  authenticate,
  isAdmin
};
