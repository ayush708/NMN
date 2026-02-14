/**
 * Validation Middleware
 * Request validation using express-validator
 */

const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

/**
 * Validate request
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array());
  }

  next();
};

module.exports = validate;
