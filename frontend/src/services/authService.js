/**
 * Authentication Service
 * API calls for authentication
 */

import api from './api';

const authService = {
  // Admin login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
    }
    return response;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  },

  // Get current admin profile
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

  // Check if logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current admin
  getCurrentAdmin: () => {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  },
};

export default authService;
