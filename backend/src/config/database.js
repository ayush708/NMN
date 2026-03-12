/**
 * Database Configuration
 * PostgreSQL connection setup (Supabase-ready for Render)
 */

const dns = require('dns');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Force IPv4 to avoid IPv6 connectivity issues on Render/cloud platforms
dns.setDefaultResultOrder('ipv4first');

// Enable SSL by default in production (Supabase requires it)
const useSSL = process.env.DB_SSL !== 'false';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Event: successful connection
pool.on('connect', () => {
  console.log('✓ Connected to PostgreSQL database (Supabase)');
});

// Event: unexpected error
pool.on('error', (err) => {
  console.error('✗ Unexpected database error:', err);
  process.exit(-1);
});

// Query helper function
const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Transaction helper function
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Export helpers
module.exports = {
  pool,
  query,
  transaction,
};

// =========================
// TEST CONNECTION (temporary)
// Run `node database.js` to test locally
// =========================
if (require.main === module) {
  pool.query('SELECT NOW()')
    .then(res => {
      console.log('✓ DB Connected! Current time:', res.rows[0]);
      process.exit();
    })
    .catch(err => {
      console.error('✗ DB connection failed:', err);
      process.exit(1);
    });
}