/**
 * Database Configuration
 * PostgreSQL connection setup (Supabase-ready for Render)
 */

const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection pool with SSL for Supabase
const pool = new Pool({
  host: process.env.DB_HOST
    ? process.env.DB_HOST.replace(/\[.*\]/, '') // Remove IPv6 brackets to force IPv4
    : 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased timeout for remote DB
  ssl: {
    rejectUnauthorized: false, // Required for Supabase hosted DB
  },
});

// Test database connection
pool.on('connect', () => {
  console.log('✓ Connected to PostgreSQL database (Supabase)');
});

pool.on('error', (err) => {
  console.error('✗ Unexpected database error:', err);
  process.exit(-1);
});

// Query helper function
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Transaction helper
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

module.exports = {
  pool,
  query,
  transaction,
};