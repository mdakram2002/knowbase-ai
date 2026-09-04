const CONSTANTS = require('../utils/constants');

/**
 * Middleware to add security headers to all responses
 */
const securityHeadersMiddleware = (req, res, next) => {
  // Content Security Policy
  res.set('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '));

  // X-Content-Type-Options
  res.set('X-Content-Type-Options', 'nosniff');

  // X-Frame-Options
  res.set('X-Frame-Options', 'DENY');

  // X-XSS-Protection
  res.set('X-XSS-Protection', '1; mode=block');

  // Strict-Transport-Security (HSTS)
  if (process.env.NODE_ENV === 'production') {
    res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Referrer-Policy
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy (formerly Feature-Policy)
  res.set('Permissions-Policy', [
    'accelerometer=()',
    'camera=()',
    'geolocation=()',
    'gyroscope=()',
    'magnetometer=()',
    'microphone=()',
    'payment=()',
    'usb=()'
  ].join(', '));

  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');

  next();
};

/**
 * Middleware to prevent MIME type sniffing
 */
const preventMimeSniffing = (req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  next();
};

/**
 * Middleware to prevent clickjacking
 */
const preventClickjacking = (req, res, next) => {
  res.set('X-Frame-Options', 'DENY');
  next();
};

/**
 * Middleware to enable XSS protection
 */
const enableXssProtection = (req, res, next) => {
  res.set('X-XSS-Protection', '1; mode=block');
  next();
};

/**
 * Middleware to set HTTPS redirect
 */
const enforceHttps = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
};

/**
 * Middleware to add security headers with options
 */
const createSecurityMiddleware = (options = {}) => {
  const {
    enableCSP = true,
    enableHSTS = true,
    enableFrameGuard = true,
    enableXssFilter = true,
    enableNoSniff = true
  } = options;

  return (req, res, next) => {
    if (enableNoSniff) {
      res.set('X-Content-Type-Options', 'nosniff');
    }

    if (enableFrameGuard) {
      res.set('X-Frame-Options', 'DENY');
    }

    if (enableXssFilter) {
      res.set('X-XSS-Protection', '1; mode=block');
    }

    if (enableCSP) {
      res.set('Content-Security-Policy', [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "connect-src 'self'",
        "frame-ancestors 'none'"
      ].join('; '));
    }

    if (enableHSTS && process.env.NODE_ENV === 'production') {
      res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    res.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Remove sensitive headers
    res.removeHeader('X-Powered-By');
    res.removeHeader('Server');

    next();
  };
};

/**
 * Middleware to sanitize response headers
 */
const sanitizeHeaders = (req, res, next) => {
  // Remove server header
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');

  // Override with generic server name
  res.set('Server', 'KnowBase AI');

  next();
};

/**
 * Middleware to add correlation ID for request tracking
 */
const addCorrelationId = (req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  req.correlationId = correlationId;
  res.set('X-Correlation-ID', correlationId);
  next();
};

module.exports = {
  securityHeadersMiddleware,
  preventMimeSniffing,
  preventClickjacking,
  enableXssProtection,
  enforceHttps,
  createSecurityMiddleware,
  sanitizeHeaders,
  addCorrelationId
};
