/**
 * Settings Routes
 * /api/settings (public)
 * /api/admin/settings (admin)
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
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
} = require('../controllers/settingsController');

// Public routes
router.get('/', getSettings);
router.get('/statistics', getStatistics);
router.get('/banners', getBanners);
router.get('/partners', getPartners);

// Admin routes
router.put('/admin', authenticate, updateSettings);
router.put('/admin/statistics/:id', authenticate, updateStatistic);
router.post('/admin/banners', authenticate, createBanner);
router.put('/admin/banners/:id', authenticate, updateBanner);
router.delete('/admin/banners/:id', authenticate, deleteBanner);
router.get('/admin/dashboard', authenticate, getDashboardStats);

module.exports = router;
