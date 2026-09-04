const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const CONSTANTS = require('./constants');

const helpers = {
  // Generate unique session ID
  generateSessionId: () => {
    return `session_${uuidv4()}`;
  },

  // Generate guest user ID
  generateGuestId: () => {
    return `guest_${uuidv4()}`;
  },

  // Hash a value
  hashValue: (value) => {
    return crypto.createHash('sha256').update(value).digest('hex');
  },

  // Get client IP address from request
  getClientIp: (req) => {
    return (
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip ||
      'unknown'
    ).trim();
  },

  // Get user agent
  getUserAgent: (req) => {
    return req.headers['user-agent'] || 'unknown';
  },

  // Parse pagination parameters
  parsePagination: (page = 1, limit = 20) => {
    const p = Math.max(1, Math.min(parseInt(page) || 1, CONSTANTS.PAGINATION.MAX_PAGE));
    const l = Math.max(
      CONSTANTS.PAGINATION.MIN_LIMIT,
      Math.min(parseInt(limit) || CONSTANTS.PAGINATION.DEFAULT_LIMIT, CONSTANTS.PAGINATION.MAX_LIMIT)
    );
    return { page: p, limit: l, skip: (p - 1) * l };
  },

  // Create paginated response
  createPaginatedResponse: (data, page, limit, total) => {
    return {
      success: true,
      data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    };
  },

  // Create success response
  createSuccessResponse: (data, message = null) => {
    return {
      success: true,
      data,
      ...(message && { message })
    };
  },

  // Create error response
  createErrorResponse: (message, code = null, statusCode = 500) => {
    return {
      success: false,
      error: message,
      ...(code && { code }),
      statusCode
    };
  },

  // Check if value is empty
  isEmpty: (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  },

  // Deep clone object
  deepClone: (obj) => {
    return JSON.parse(JSON.stringify(obj));
  },

  // Pick specific fields from object
  pick: (obj, fields) => {
    const result = {};
    fields.forEach(field => {
      if (field in obj) {
        result[field] = obj[field];
      }
    });
    return result;
  },

  // Omit specific fields from object
  omit: (obj, fields) => {
    const result = { ...obj };
    fields.forEach(field => {
      delete result[field];
    });
    return result;
  },

  // Format error for logging
  formatError: (error) => {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      timestamp: new Date().toISOString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  },

  // Generate rate limit key
  generateRateLimitKey: (ip, endpoint) => {
    return `${CONSTANTS.REDIS_KEYS.RATE_LIMIT}${endpoint}:${ip}`;
  },

  // Check if request is from bot
  isBot: (userAgent) => {
    const botPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /java(?!script)/i
    ];
    return botPatterns.some(pattern => pattern.test(userAgent));
  },

  // Delay function (for rate limiting, etc.)
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Get current timestamp
  getCurrentTimestamp: () => new Date().toISOString(),

  // Calculate TTL for Redis
  calculateTTL: (expirySeconds) => {
    return Math.ceil(expirySeconds / 1000);
  },

  // Validate access level
  hasAccess: (userRole, requiredRole) => {
    const roleHierarchy = {
      'admin': 3,
      'user': 2,
      'guest': 1
    };
    return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0);
  },

  // Extract token from Authorization header
  extractToken: (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  },

  // Log action
  logAction: (action, details) => {
    const logEntry = {
      timestamp: helpers.getCurrentTimestamp(),
      action,
      details,
      env: process.env.NODE_ENV
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[ACTION]', JSON.stringify(logEntry, null, 2));
    }
    
    return logEntry;
  }
};

module.exports = helpers;
