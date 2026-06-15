const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

const knowledgeRoutes = require('./routes/knowledgeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');

const database = require('./config/database');
const app = express();
database.connect();

// CORS Configuration
const corsOptions = {
  origin: [
    'https://knowbase-ai-client.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Route route
app.get('/', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  res.json({
    api: 'KnowBase AI API',
    version: '1.0.0',
    status: 'operational',

    docs: `${baseUrl}/api-docs`,
    health: `${baseUrl}/health`,
    repo: 'https://github.com/mdakram2002/knowbase-ai',

    endpoints: {
      public: {
        'GET /health': 'System status',
        'GET /api-docs': 'API documentation',
        'GET /api/public/brain/query': 'AI-powered Q&A with sources'
      },
      protected: {
        'GET /api/knowledge': 'List knowledge items',
        'POST /api/knowledge': 'Create new item',
        'POST /api/ai/query': 'Query AI with context'
      }
    },

    stack: {
      backend: 'Node.js + Express + MongoDB',
      frontend: 'Next.js + React + Tailwind',
      ai: 'Google Gemini API'
    },

    examples: {
      testPublic: `curl "${baseUrl}/api/public/brain/query?q=What+is+knowledge+management?"`,
      getHealth: `curl "${baseUrl}/health"`,
      frontend: 'https://knowbase-ai-client.vercel.app'
    },

    meta: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      env: process.env.NODE_ENV || 'development'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: database.connection?.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API documentation
app.get('/api-docs', (req, res) => {
  res.json({
    name: 'KnowBase AI API',
    version: '1.0.0',
    description: 'AI-powered knowledge management system API',
    endpoints: {
      knowledge: '/api/knowledge',
      ai: '/api/ai',
      auth: '/api/auth',
      public: {
        brain: '/api/public/brain/query?q=your+question'
      }
    }
  });
});

// API Routes
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);

// Public API endpoint (as required in assignment)
app.get('/api/public/brain/query', (req, res, next) => {
  const aiController = require('./controllers/aiController');
  aiController.publicQuery(req, res, next);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} does not exist`,
    available: ['/', '/health', '/api-docs', '/api/public/brain/query'],
    docs: `${req.protocol}://${req.get('host')}/api-docs`
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;