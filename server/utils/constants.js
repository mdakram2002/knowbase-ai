// Application-wide constants

const CONSTANTS = {
  // Access levels
  ACCESS_LEVELS: {
    PUBLIC: 'public',
    PRIVATE: 'private',
    RESTRICTED: 'restricted'
  },

  // User roles
  ROLES: {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest'
  },

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    RATE_LIMIT: 429,
    INTERNAL_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
  },

  // Rate Limiting (requests per minute)
  RATE_LIMITS: {
    GLOBAL: 100,              
    AUTH: 5,                 
    PUBLIC: 50,               
    API: 30                   
  },

  // Rate limit time window (in seconds)
  RATE_LIMIT_WINDOW: 900,    // 15 minutes

  // Session configuration
  SESSION: {
    GUEST_EXPIRY: 7200,       
    AUTH_EXPIRY: 604800,   
    REFRESH_EXPIRY: 2592000
  },

  // Token configuration
  TOKEN: {
    EXPIRY_TIME: '7d',
    ALGORITHM: 'HS256'
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    MIN_LIMIT: 1,
    MAX_PAGE: 1000000
  },

  // Search
  SEARCH: {
    MIN_QUERY_LENGTH: 1,
    MAX_QUERY_LENGTH: 500,
    DEFAULT_LIMIT: 20
  },

  // File upload
  FILE: {
    MAX_SIZE: 10 * 1024 * 1024,  
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
  },

  // Cache durations (in seconds)
  CACHE: {
    PUBLIC_DATA: 300,         
    SEARCH_RESULTS: 120,      
    USER_DATA: 60,            
    KNOWLEDGE_ITEM: 300       
  },

  // Response messages
  MESSAGES: {
    // Success
    LOGIN_SUCCESS: 'Logged in successfully',
    LOGOUT_SUCCESS: 'Logged out successfully',
    REGISTER_SUCCESS: 'Account created successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    PASSWORD_CHANGED: 'Password changed successfully',
    DATA_DELETED: 'Data deleted successfully',
    ACCOUNT_DELETED: 'Account deleted successfully',
    CREATED_SUCCESS: 'Created successfully',
    UPDATED_SUCCESS: 'Updated successfully',
    DELETED_SUCCESS: 'Deleted successfully',

    // Errors
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_EXISTS: 'Email already registered',
    USER_NOT_FOUND: 'User not found',
    SESSION_EXPIRED: 'Session expired, please login again',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access denied',
    INVALID_INPUT: 'Invalid input provided',
    RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',
    SERVER_ERROR: 'An error occurred, please try again',
    DATABASE_ERROR: 'Database error occurred',
    NOT_FOUND: 'Resource not found'
  },

  // Redis key prefixes
  REDIS_KEYS: {
    GUEST_SESSION: 'guest:session:',
    GUEST_FAVORITES: 'guest:favorites:',
    GUEST_ACTIVITY: 'guest:activity:',
    RATE_LIMIT: 'ratelimit:',
    CACHE_PUBLIC: 'cache:public:',
    CACHE_SEARCH: 'cache:search:'
  },

  // CORS
  CORS: {
    ALLOWED_ORIGINS: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://knowbase-ai-client.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean),
    ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With'],
    EXPOSED_HEADERS: ['X-Total-Count', 'X-Total-Pages', 'X-Current-Page'],
    CREDENTIALS: true,
    MAX_AGE: 86400  // 24 hours
  },

  // Security headers
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'",
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  },

  // API versioning
  API_VERSION: 'v1',

  // Feature flags
  FEATURES: {
    GUEST_MODE: true,
    RATE_LIMITING: true,
    CACHING: true,
    EMAIL_VERIFICATION: false,
    OAUTH: false
  }
};

module.exports = CONSTANTS;
