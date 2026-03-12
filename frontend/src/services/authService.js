/**
 * Authentication Service
 * API calls for authentication
 */

import api from './api';

const authService = {
  // Admin login — token is set as httpOnly cookie by the backend
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.admin) {
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
    }
    // Store token for Authorization header fallback (cross-domain)
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },

  // Logout — clears httpOnly cookie on the backend
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network errors — still clear local state
    }
    localStorage.removeItem('admin');
    localStorage.removeItem('token');
  },

  // Get current admin profile from server
  getProfile: async () => {
    return await api.get('/auth/profile');
  },

  // Update profile
  updateProfile: async (data) => {
    return await api.put('/auth/profile', data);
  },

  // Change password
  changePassword: async (data) => {
    return await api.put('/auth/change-password', data);
  },

  // Check if logged in (based on stored admin profile)
  isAuthenticated: () => {
    return !!localStorage.getItem('admin');
  },

  // Get current admin
  getCurrentAdmin: () => {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  },
};

export default authService;
