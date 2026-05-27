/**
 * Express Application Setup
 * Main application configuration
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import middleware
const { notFound, errorHandler } = require('./src/middleware/errorHandler');

// Import routes
const routes = require('./src/routes');

// Initialize express app
const app = express();

// Trust reverse proxy (required for correct IP extraction and rate limiting)
app.set('trust proxy', 1);

// HTTPS enforcement for production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

// Security middleware - Enhanced helmet configuration
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true
}));

// CORS configuration - Allow localhost and environment CLIENT_URL
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://www.nmnhas.org.np',
  'http://www.nmnhas.org.np',
  'https://nmnhas.org.np',
  'http://nmnhas.org.np',
  process.env.CLIENT_URL,
  process.env.NETWORK_CLIENT_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser middleware — keep limits tight for API endpoints
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Cookie parser — required for httpOnly auth cookie support
app.use(cookieParser());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Static files - serve uploads directory with security headers
app.use('/uploads', (req, res, next) => {
  // Prevent script execution from uploaded files
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'; media-src 'self'; style-src 'none'; script-src 'none'");
  res.setHeader('X-Frame-Options', 'DENY');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Frontend build - serve the React app when the production bundle exists.
const frontendDistPath = path.join(__dirname, '../frontend/dist');
const frontendIndexPath = path.join(frontendDistPath, 'index.html');
const hasFrontendBuild = fs.existsSync(frontendIndexPath);

if (hasFrontendBuild) {
  app.use(express.static(frontendDistPath));
}

// API routes
app.use('/api', routes);

// SPA fallback for frontend routes when the build is deployed with this app.
if (hasFrontendBuild) {
  app.get(/^\/(?!api\/).*/, (req, res, next) => {
    if (req.method !== 'GET') return next();
    res.sendFile(frontendIndexPath);
  });
}

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'National Migrant Network API',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;
