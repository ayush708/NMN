/**
 * Authentication Middleware
 * Verify JWT tokens and protect admin routes
 */

const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');
const { query } = require('../config/database');

/**
 * Verify JWT token from httpOnly cookie or fallback Authorization header
 */
const authenticate = async (req, res, next) => {
  try {
    let token;

    // Prefer httpOnly cookie (not accessible to JavaScript — XSS safe)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else {
      // Fallback: Bearer token in Authorization header (for API clients / tools)
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return errorResponse(res, 'No token provided', 401);
    }

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
