const express = require('express');
const router = express.Router();


const authRoutes = require('./authRoutes');
const programRoutes = require('./programRoutes');
const eventRoutes = require('./eventRoutes');
const newsRoutes = require('./newsRoutes');
const resourceRoutes = require('./resourceRoutes');
const elearningRoutes = require('./elearningRoutes');
const galleryRoutes = require('./galleryRoutes');
const contactRoutes = require('./contactRoutes');
const volunteerRoutes = require('./volunteerRoutes');
const settingsRoutes = require('./settingsRoutes');
const uploadRoutes = require('./uploadRoutes');
const donationRoutes = require('./donationRoutes');

router.use('/auth', authRoutes);
router.use('/programs', programRoutes);
router.use('/events', eventRoutes);
router.use('/news', newsRoutes);
router.use('/resources', resourceRoutes);
router.use('/elearning', elearningRoutes);
router.use('/gallery', galleryRoutes);
router.use('/contact', contactRoutes);
router.use('/volunteer', volunteerRoutes);
router.use('/settings', settingsRoutes);
router.use('/upload', uploadRoutes);
router.use('/donate', donationRoutes);

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
