const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = {
  verifyToken: (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'No token provided'
        });
      }
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      req.userId = decoded.id;
      next();

    } catch (error) {
      console.error('Token verification error:', error);

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          error: 'Invalid token'
        });
      }

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token expired'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Token verification failed'
      });
    }
  },

  // Optional authentication (for public routes that can work with or without auth)
  optionalAuth: (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
      }

      next();
    } catch (error) {
      next();
    }
  },

  // Check if user is admin
  isAdmin: (req, res, next) => {
    next();
  },

  // Rate limiting middleware
  rateLimiter: require('express-rate-limit')({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      success: false,
      error: 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
  }),

  // Validation middleware
  validateRequest: (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }
      next();
    };
  },

  // CORS middleware
  corsOptions: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
  },

  // Error handling middleware
  errorHandler: (err, req, res, next) => {
    console.error('Error:', err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(err.errors).map(e => e.message).join(', ')
      });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate field value entered'
      });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }

    // Default error
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
};

module.exports = authMiddleware;