/**
 * Donation Routes
 * /api/donate (public)
 * /api/donate/admin (admin)
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { formLimiter } = require('../middleware/rateLimiter');
const {
  initiateKhalti,
  verifyKhalti,
  initiateEsewa,
  verifyEsewa,
  getAllDonations,
  deleteDonation,
} = require('../controllers/donationController');

// Validation rules for donation
const donationValidation = [
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 10 }).withMessage('Minimum donation is Rs. 10'),
  body('name').optional().trim(),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().trim(),
  body('message').optional().trim().isLength({ max: 500 }).withMessage('Message too long'),
];

// ─── Public Routes (rate limited) ───────────────────────────────────────────
router.post('/khalti/initiate', formLimiter, donationValidation, validate, initiateKhalti);
router.post('/khalti/verify',   formLimiter, [
  body('pidx').notEmpty().withMessage('pidx is required'),
], validate, verifyKhalti);

router.post('/esewa/initiate',  formLimiter, donationValidation, validate, initiateEsewa);
router.post('/esewa/verify',    formLimiter, [
  body('transaction_uuid').notEmpty().withMessage('transaction_uuid is required'),
  body('total_amount').notEmpty().withMessage('total_amount is required'),
], validate, verifyEsewa);

// ─── Admin Routes ────────────────────────────────────────────────────────────
router.get('/admin/all',    authenticate, getAllDonations);
router.delete('/admin/:id', authenticate, deleteDonation);

module.exports = router;
