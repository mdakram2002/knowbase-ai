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

// Add this right after middleware
app.get('/', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.json({
    name: 'KnowBase AI API',
    version: '1.0.0',
    status: 'operational',
    docs: `${baseUrl}/api-docs`,
    health: `${baseUrl}/health`,
    publicAPI: `${baseUrl}/api/public/brain/query`,
    frontend: 'https://knowbase-ai-client.vercel.app'
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
  if (req.originalUrl === '/') {

    res.redirect('/api-docs');
  } else {
    res.status(404).json({
      success: false,
      error: `Route ${req.originalUrl} not found`,
      availableEndpoints: [
        '/',
        '/health',
        '/api-docs',
        '/api/public/brain/query',
        '/api/knowledge',
        '/api/ai',
        '/api/auth'
      ]
    });
  }
});

// Error handler
app.use(errorHandler);

module.exports = app;