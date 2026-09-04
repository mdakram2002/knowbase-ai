const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

const knowledgeRoutes = require('./routes/knowledgeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const guestRoutes = require('./routes/guestRoutes');

const authMiddleware = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');

const {
  securityHeadersMiddleware,
  addCorrelationId
} = require('./middleware/security');

const { guestSessionMiddleware } = require('./middleware/guestSession');
const { globalRateLimiter } = require('./middleware/rateLimit');

const database = require('./config/database');
const { connectRedis } = require('./config/redis');
const CONSTANTS = require('./utils/constants');

const app = express();
database.connect();

connectRedis().catch(() => {
  console.warn('Redis not available, guest features will be limited');
  process.env.REDIS_ENABLED = 'false';
});

const corsOptions = {
  origin: CONSTANTS.CORS.ALLOWED_ORIGINS,
  credentials: CONSTANTS.CORS.CREDENTIALS,
  methods: CONSTANTS.CORS.ALLOWED_METHODS,
  allowedHeaders: CONSTANTS.CORS.ALLOWED_HEADERS,
  exposedHeaders: CONSTANTS.CORS.EXPOSED_HEADERS,
  optionsSuccessStatus: 200,
  maxAge: CONSTANTS.CORS.MAX_AGE
};

app.use(securityHeadersMiddleware);
app.use(addCorrelationId);
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

if (CONSTANTS.FEATURES.RATE_LIMITING) {
  app.use(globalRateLimiter);
}

app.use(guestSessionMiddleware);

app.get('/', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  res.json({
    name: 'KnowBase AI API',
    version: '1.0.0',
    status: 'operational',
    guestEnabled: CONSTANTS.FEATURES.GUEST_MODE,
    docs: `${baseUrl}/api-docs`,
    health: `${baseUrl}/health`,
    public: {
      knowledge: `${baseUrl}/api/public/knowledge`,
      search: `${baseUrl}/api/public/knowledge/search`,
      trending: `${baseUrl}/api/public/trending/tags`
    },
    guest: {
      session: `${baseUrl}/api/guest/session/{sessionId}`,
      favorites: `${baseUrl}/api/guest/favorites`
    },
    authenticated: {
      knowledge: `${baseUrl}/api/knowledge`,
      profile: `${baseUrl}/api/auth/profile`
    },
    frontend: 'https://knowbase-ai-client.vercel.app'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database:
      database.connection?.readyState === 1
        ? 'connected'
        : 'disconnected',
    features: {
      guestMode: CONSTANTS.FEATURES.GUEST_MODE,
      rateLimit: CONSTANTS.FEATURES.RATE_LIMITING,
      caching: CONSTANTS.FEATURES.CACHING
    }
  });
});

app.get('/api-docs', (req, res) => {
  res.json({
    name: 'KnowBase AI API',
    version: '1.0.0',
    description: 'AI-powered knowledge management system API',
    features: {
      authentication: 'JWT-based authentication',
      guestMode: 'Anonymous guest sessions with temporary favorites',
      publicAccess: 'Browse public knowledge without login',
      rateLimit: 'API rate limiting enabled',
      security: 'Security headers and CORS protection'
    },
    endpoints: {
      public: {
        description: 'Public endpoints accessible to guests',
        knowledge: {
          getAll: 'GET /api/public/knowledge?page=1&limit=20',
          getById: 'GET /api/public/knowledge/:id',
          search: 'GET /api/public/knowledge/search?q=query',
          byCategory: 'GET /api/public/category/:category',
          byTags: 'GET /api/public/tags?tags=tag1,tag2',
          popular: 'GET /api/public/popular?limit=10&days=30',
          recent: 'GET /api/public/recent?limit=10',
          trending: 'GET /api/public/trending/tags?limit=20',
          stats: 'GET /api/public/stats'
        }
      },
      guest: {
        description: 'Guest session endpoints for temporary data',
        session: {
          getSession: 'GET /api/guest/session/:sessionId',
          getStats: 'GET /api/guest/stats',
          getFavorites: 'GET /api/guest/favorites'
        },
        favorites: {
          add: 'POST /api/guest/favorites/add',
          remove: 'POST /api/guest/favorites/remove'
        },
        search: {
          track: 'POST /api/guest/search/track'
        }
      },
      auth: {
        description: 'Authentication endpoints',
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        me: 'GET /api/auth/me',
        profile: 'PUT /api/auth/profile',
        changePassword: 'POST /api/auth/change-password'
      },
      knowledge: {
        description: 'Authenticated user knowledge endpoints',
        getAll: 'GET /api/knowledge',
        create: 'POST /api/knowledge',
        update: 'PUT /api/knowledge/:id',
        delete: 'DELETE /api/knowledge/:id'
      }
    }
  });
});

app.use('/api/public', publicRoutes);
app.use('/api/guest', guestRoutes);

app.use('/api/auth', authRoutes);

app.use(
  '/api/knowledge',
  authMiddleware.verifyToken,
  knowledgeRoutes
);

app.use(
  '/api/ai',
  authMiddleware.verifyToken,
  aiRoutes
);

app.use((req, res) => {
  if (req.originalUrl === '/') {
    return res.redirect('/api-docs');
  }

  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
    statusCode: 404,
    timestamp: new Date().toISOString(),
    availableEndpoints: {
      public: '/api/public/knowledge',
      guest: '/api/guest/session',
      auth: '/api/auth',
      docs: '/api-docs',
      health: '/health'
    }
  });
});

app.use(errorHandler);

module.exports = app;