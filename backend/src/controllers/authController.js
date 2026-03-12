/**
 * Authentication Controller
 * Handle admin login, profile management
 */

const { query } = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Admin Login
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get admin by email
    const result = await query(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const admin = result.rows[0];

    // Check if account is active
    if (!admin.is_active) {
      return errorResponse(res, 'Account is deactivated', 403);
    }

    // Compare password
    const isMatch = await comparePassword(password, admin.password);

    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Update last login
    await query(
      'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [admin.id]
    );

    // Generate token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role
    });

    // Set token as httpOnly cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // 'none' required for cross-site
      maxAge: 8 * 60 * 60 * 1000 // 8 hours in ms
    };
    res.cookie('token', token, cookieOptions);

    // Return response without password
    const { password: _, ...adminData } = admin;

    return successResponse(res, {
      admin: adminData,
      token
    }, 'Login successful', 200);

  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 'Login failed', 500);
  }
};

/**
 * Get Current Admin Profile
 * GET /api/auth/profile
 */
const getProfile = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, email, role, is_active, last_login, created_at FROM admins WHERE id = $1',
      [req.admin.id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Admin not found', 404);
    }

    return successResponse(res, result.rows[0], 'Profile retrieved');

  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse(res, 'Failed to get profile', 500);
  }
};

/**
 * Update Admin Profile
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await query(
      'UPDATE admins SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role',
      [name, email, req.admin.id]
    );

    return successResponse(res, result.rows[0], 'Profile updated successfully');

  } catch (error) {
    console.error('Update profile error:', error);

    if (error.code === '23505') {
      return errorResponse(res, 'Email already exists', 409);
    }

    return errorResponse(res, 'Failed to update profile', 500);
  }
};

/**
 * Change Password
 * PUT /api/auth/change-password
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get current password hash
    const result = await query(
      'SELECT password FROM admins WHERE id = $1',
      [req.admin.id]
    );

    const admin = result.rows[0];

    // Verify current password
    const isMatch = await comparePassword(currentPassword, admin.password);

    if (!isMatch) {
      return errorResponse(res, 'Current password is incorrect', 400);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await query(
      'UPDATE admins SET password = $1 WHERE id = $2',
      [hashedPassword, req.admin.id]
    );

    return successResponse(res, null, 'Password changed successfully');

  } catch (error) {
    console.error('Change password error:', error);
    return errorResponse(res, 'Failed to change password', 500);
  }
};

/**
 * Logout — clear auth cookie
 * POST /api/auth/logout
 */
const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  return successResponse(res, null, 'Logged out successfully');
};

module.exports = {
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword
};
