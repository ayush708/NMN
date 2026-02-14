/**
 * Server Entry Point
 * Start the Express server
 */

const app = require('./app');
const { pool } = require('./src/config/database');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Test database connection
const testDatabaseConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful');
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    console.error('Please ensure PostgreSQL is running and credentials are correct');
    return false;
  }
};

// Start server
const startServer = async () => {
  // Test database connection first
  const dbConnected = await testDatabaseConnection();

  if (!dbConnected) {
    console.log('\nPlease check your database configuration in .env file:');
    console.log('- DB_HOST');
    console.log('- DB_PORT');
    console.log('- DB_NAME');
    console.log('- DB_USER');
    console.log('- DB_PASSWORD');
    process.exit(1);
  }

  // Start the server (listen on all network interfaces for mobile access)
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('\n╔═══════════════════════════════════════════════════╗');
    console.log('║                                                   ║');
    console.log('║         NATIONAL MIGRANT NETWORK (NMN)            ║');
    console.log('║              Backend API Server                   ║');
    console.log('║                                                   ║');
    console.log('╚═══════════════════════════════════════════════════╝\n');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Local: http://localhost:${PORT}/api`);
    console.log(`📱 Network: http://192.168.1.70:${PORT}/api`);
    console.log(`🏥 Health check: http://192.168.1.70:${PORT}/api/health`);
    console.log('\n✓ Server is ready to accept requests from network\n');
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('\n⚠️  SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('✓ Server closed');
      pool.end(() => {
        console.log('✓ Database connection closed');
        process.exit(0);
      });
    });
  });

  process.on('SIGINT', () => {
    console.log('\n⚠️  SIGINT received. Shutting down gracefully...');
    server.close(() => {
      console.log('✓ Server closed');
      pool.end(() => {
        console.log('✓ Database connection closed');
        process.exit(0);
      });
    });
  });
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error(error.name, error.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(error);
  server.close(() => {
    process.exit(1);
  });
});

// Start the server
startServer();
