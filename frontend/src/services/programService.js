/**
 * Program Service
 * API calls for programs
 */

import api from './api';

const programService = {
  // Get all programs (public)
  getAll: async (params = {}) => {
    return await api.get('/programs', { params });
  },

  // Get single program by slug (public)
  getBySlug: async (slug) => {
    return await api.get(`/programs/${slug}`);
  },

  // Get all programs (admin)
  getAllAdmin: async (params = {}) => {
    return await api.get('/programs/admin/all', { params });
  },

  // Create program (admin)
  create: async (data) => {
    return await api.post('/programs/admin', data);
  },

  // Update program (admin)
  update: async (id, data) => {
    return await api.put(`/programs/admin/${id}`, data);
  },

  // Delete program (admin)
  delete: async (id) => {
    return await api.delete(`/programs/admin/${id}`);
  },
};

export default programService;
