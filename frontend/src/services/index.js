/**
 * Combined Services Export
 * Central export for all services
 */

import api from './api';
import authService from './authService';
import programService from './programService';

// Event Service
export const eventService = {
  getAll: async (params = {}) => api.get('/events', { params }),
  getBySlug: async (slug) => api.get(`/events/${slug}`),
  getAllAdmin: async (params = {}) => api.get('/events/admin/all', { params }),
  create: async (data) => api.post('/events/admin', data),
  update: async (id, data) => api.put(`/events/admin/${id}`, data),
  delete: async (id) => api.delete(`/events/admin/${id}`),
};

// News Service
export const newsService = {
  getAll: async (params = {}) => api.get('/news', { params }),
  getBySlug: async (slug) => api.get(`/news/${slug}`),
  getAllAdmin: async (params = {}) => api.get('/news/admin/all', { params }),
  create: async (data) => api.post('/news/admin', data),
  update: async (id, data) => api.put(`/news/admin/${id}`, data),
  delete: async (id) => api.delete(`/news/admin/${id}`),
};

// Resource Service
export const resourceService = {
  getAll: async (params = {}) => api.get('/resources', { params }),
  getById: async (id) => api.get(`/resources/${id}`),
  getAllAdmin: async (params = {}) => api.get('/resources/admin/all', { params }),
  create: async (data) => api.post('/resources/admin', data),
  update: async (id, data) => api.put(`/resources/admin/${id}`, data),
  delete: async (id) => api.delete(`/resources/admin/${id}`),
};

// E-Learning Service
export const elearningService = {
  getCategories: async () => api.get('/elearning/categories'),
  getContentsByCategory: async (categorySlug, params = {}) =>
    api.get(`/elearning/category/${categorySlug}`, { params }),
  getContentBySlug: async (slug) => api.get(`/elearning/content/${slug}`),
  getAllAdmin: async (params = {}) => api.get('/elearning/admin/all', { params }),
  create: async (data) => api.post('/elearning/admin', data),
  update: async (id, data) => api.put(`/elearning/admin/${id}`, data),
  delete: async (id) => api.delete(`/elearning/admin/${id}`),
};

// Gallery Service
export const galleryService = {
  getAllAlbums: async () => api.get('/gallery/albums'),
  getAlbumBySlug: async (slug) => api.get(`/gallery/albums/${slug}`),
  getAllAlbumsAdmin: async () => api.get('/gallery/admin/albums'),
  createAlbum: async (data) => api.post('/gallery/admin/albums', data),
  updateAlbum: async (id, data) => api.put(`/gallery/admin/albums/${id}`, data),
  deleteAlbum: async (id) => api.delete(`/gallery/admin/albums/${id}`),
  addImage: async (data) => api.post('/gallery/admin/images', data),
  deleteImage: async (id) => api.delete(`/gallery/admin/images/${id}`),
};

// Contact Service
export const contactService = {
  submit: async (data) => api.post('/contact', data),
  getAllMessages: async (params = {}) => api.get('/contact/admin/messages', { params }),
  markAsRead: async (id) => api.put(`/contact/admin/messages/${id}/read`),
  deleteMessage: async (id) => api.delete(`/contact/admin/messages/${id}`),
};

// Volunteer Service
export const volunteerService = {
  submit: async (data) => api.post('/volunteer', data),
  getAll: async (params = {}) => api.get('/volunteer/admin/all', { params }),
  getById: async (id) => api.get(`/volunteer/admin/${id}`),
  approve: async (id) => api.put(`/volunteer/admin/${id}/approve`),
  delete: async (id) => api.delete(`/volunteer/admin/${id}`),
};

// Settings Service
export const settingsService = {
  get: async () => api.get('/settings'),
  getStatistics: async () => api.get('/settings/statistics'),
  getBanners: async () => api.get('/settings/banners'),
  getPartners: async () => api.get('/settings/partners'),
  update: async (data) => api.put('/settings/admin', data),
  updateStatistic: async (id, data) => api.put(`/settings/admin/statistics/${id}`, data),
  createBanner: async (data) => api.post('/settings/admin/banners', data),
  updateBanner: async (id, data) => api.put(`/settings/admin/banners/${id}`, data),
  deleteBanner: async (id) => api.delete(`/settings/admin/banners/${id}`),
  getDashboardStats: async () => api.get('/settings/admin/dashboard'),
};

// Upload Service
export const uploadService = {
  uploadSingle: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post('/upload/single', formData);
  },
  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return await api.post('/upload/multiple', formData);
  },
};

export { authService, programService };
export default api;
