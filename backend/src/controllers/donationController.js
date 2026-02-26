/**
 * Donation Controller
 * Handles Khalti and eSewa payment initiations and verifications
 */

const { query } = require('../config/database');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const axios = require('axios');

// ─── Khalti: Initiate Payment ────────────────────────────────────────────────
const initiateKhalti = async (req, res) => {
  try {
    const { amount, name, email, phone, message } = req.body;
    const amountInPaisa = Math.round(parseFloat(amount) * 100);

    // Build customer_info — Khalti rejects empty strings for email/phone
    const customerInfo = { name: name || 'Anonymous' };
    if (email) customerInfo.email = email;
    if (phone) customerInfo.phone = phone;

    const payload = {
      return_url: `${process.env.CLIENT_URL}/donate/verify?gateway=khalti`,
      website_url: process.env.CLIENT_URL || 'http://localhost:5173',
      amount: amountInPaisa,
      purchase_order_id: `NMN-${Date.now()}`,
      purchase_order_name: 'Donation to NMN',
      customer_info: customerInfo,
    };

    const response = await axios.post(
      'https://a.khalti.com/api/v2/epayment/initiate/',
      payload,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Save pending donation record
    await query(
      `INSERT INTO donations (name, email, phone, amount, message, gateway, pidx, status)
       VALUES ($1, $2, $3, $4, $5, 'khalti', $6, 'pending')`,
      [name || 'Anonymous', email || '', phone || '', amount, message || '', response.data.pidx]
    );

    return successResponse(res, {
      payment_url: response.data.payment_url,
      pidx: response.data.pidx,
    }, 'Khalti payment initiated');

  } catch (error) {
    const khaltiError = error?.response?.data;
    console.error('Khalti initiate error:', khaltiError || error.message);

    // Return the actual Khalti error in development so it's visible
    const msg = process.env.NODE_ENV === 'development' && khaltiError
      ? `Khalti: ${JSON.stringify(khaltiError)}`
      : 'Failed to initiate Khalti payment. Please check your API key.';

    return errorResponse(res, msg, 500);
  }
};

// ─── Khalti: Verify Payment ──────────────────────────────────────────────────
const verifyKhalti = async (req, res) => {
  try {
    const { pidx } = req.body;

    const response = await axios.post(
      'https://a.khalti.com/api/v2/epayment/lookup/',
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { status, total_amount, transaction_id } = response.data;

    if (status === 'Completed') {
      await query(
        `UPDATE donations SET status = 'completed', transaction_id = $1
         WHERE pidx = $2`,
        [transaction_id, pidx]
      );
      const result = await query('SELECT * FROM donations WHERE pidx = $1', [pidx]);
      return successResponse(res, result.rows[0], 'Payment verified successfully');
    } else {
      await query(`UPDATE donations SET status = 'failed' WHERE pidx = $1`, [pidx]);
      return errorResponse(res, `Payment not completed. Status: ${status}`, 400);
    }

  } catch (error) {
    console.error('Khalti verify error:', error?.response?.data || error.message);
    return errorResponse(res, 'Failed to verify Khalti payment.', 500);
  }
};

// ─── eSewa: Initiate Payment ─────────────────────────────────────────────────
const initiateEsewa = async (req, res) => {
  try {
    const { amount, name, email, phone, message } = req.body;
    const transactionUuid = `NMN-${Date.now()}`;

    // Save pending donation record
    await query(
      `INSERT INTO donations (name, email, phone, amount, message, gateway, transaction_id, status)
       VALUES ($1, $2, $3, $4, $5, 'esewa', $6, 'pending')`,
      [name || 'Anonymous', email || '', phone || '', amount, message || '', transactionUuid]
    );

    // Return the form data needed for eSewa redirect (client side will POST a form)
    return successResponse(res, {
      product_code: process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST',
      amount: amount,
      tax_amount: 0,
      total_amount: amount,
      transaction_uuid: transactionUuid,
      success_url: `${process.env.CLIENT_URL}/donate/verify?gateway=esewa`,
      failure_url: `${process.env.CLIENT_URL}/donate?status=failed`,
      esewa_url: process.env.ESEWA_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
    }, 'eSewa payment data prepared');

  } catch (error) {
    console.error('eSewa initiate error:', error.message);
    return errorResponse(res, 'Failed to initiate eSewa payment. Please try again.', 500);
  }
};

// ─── eSewa: Verify Payment ───────────────────────────────────────────────────
const verifyEsewa = async (req, res) => {
  try {
    const { transaction_uuid, total_amount } = req.body;

    // Verify with eSewa
    const verifyUrl = process.env.ESEWA_VERIFY_URL ||
      'https://rc.esewa.com.np/api/epay/transaction/status/';

    const response = await axios.get(verifyUrl, {
      params: {
        product_code: process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST',
        total_amount,
        transaction_uuid,
      },
    });

    if (response.data.status === 'COMPLETE') {
      await query(
        `UPDATE donations SET status = 'completed'
         WHERE transaction_id = $1`,
        [transaction_uuid]
      );
      const result = await query(
        'SELECT * FROM donations WHERE transaction_id = $1',
        [transaction_uuid]
      );
      return successResponse(res, result.rows[0], 'eSewa payment verified successfully');
    } else {
      await query(
        `UPDATE donations SET status = 'failed' WHERE transaction_id = $1`,
        [transaction_uuid]
      );
      return errorResponse(res, `eSewa payment not completed. Status: ${response.data.status}`, 400);
    }

  } catch (error) {
    console.error('eSewa verify error:', error?.response?.data || error.message);
    return errorResponse(res, 'Failed to verify eSewa payment.', 500);
  }
};

// ─── Get All Donations (Admin) ───────────────────────────────────────────────
const getAllDonations = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, gateway } = req.query;
    const offset = (page - 1) * limit;

    let conditions = [];
    const params = [];

    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }
    if (gateway) {
      params.push(gateway);
      conditions.push(`gateway = $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(limit, offset);

    const result = await query(
      `SELECT * FROM donations ${where} ORDER BY created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    const countResult = await query(
      `SELECT COUNT(*) FROM donations ${where}`,
      params.slice(0, params.length - 2)
    );

    const total = parseInt(countResult.rows[0].count);
    return paginatedResponse(res, result.rows, page, limit, total);

  } catch (error) {
    console.error('Get donations error:', error);
    return errorResponse(res, 'Failed to get donations', 500);
  }
};

// ─── Delete Donation (Admin) ─────────────────────────────────────────────────
const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM donations WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Donation not found', 404);
    }

    return successResponse(res, null, 'Donation deleted successfully');

  } catch (error) {
    console.error('Delete donation error:', error);
    return errorResponse(res, 'Failed to delete donation', 500);
  }
};

module.exports = {
  initiateKhalti,
  verifyKhalti,
  initiateEsewa,
  verifyEsewa,
  getAllDonations,
  deleteDonation,
};
