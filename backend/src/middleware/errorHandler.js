/**
 * Error Handler Middleware
 * Centralized error handling
 */

const { errorResponse } = require('../utils/response');

/**
 * 404 Not Found Handler
 */
const notFound = (req, res, next) => {
  return errorResponse(res, `Route ${req.originalUrl} not found`, 404);
};

/**
 * Global Error Handler
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return errorResponse(res, 'File size too large', 400);
  }

  if (err.message && err.message.includes('Invalid file type')) {
    return errorResponse(res, err.message, 400);
  }

  // Database errors
  if (err.code === '23505') {
    return errorResponse(res, 'Duplicate entry. Record already exists.', 409);
  }

  if (err.code === '23503') {
    return errorResponse(res, 'Foreign key constraint violation', 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401);
  }

  // Default error
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return errorResponse(res, message, status);
};

module.exports = {
  notFound,
  errorHandler
};
