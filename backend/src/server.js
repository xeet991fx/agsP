import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import promptsRouter from './routes/prompts.js';
import generateRouter from './routes/generate.js';
import { ensureDataDir } from './utils/fileHandler.js';
import { logInfo, logError } from './utils/logger.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Support large prompts
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logInfo(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/prompts', promptsRouter);
app.use('/api/generate-post', generateRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logError('Global error handler', err);
  res.status(err.status || 500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Initialize and start server
async function startServer() {
  try {
    // Ensure data directory exists
    await ensureDataDir();
    logInfo('Data directory initialized');

    // Check for required environment variables
    if (!process.env.GEMINI_API_KEY) {
      console.warn('\n⚠️  WARNING: GEMINI_API_KEY is not set!');
      console.warn('Please set it in your .env file to use the generation feature.\n');
    }

    app.listen(PORT, () => {
      console.log('\n✨ X Post Generator Backend Started ✨\n');
      console.log(`🚀 Server running on: http://localhost:${PORT}`);
      console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Logging enabled: ${process.env.LOG_GENERATIONS === 'true'}\n`);

      if (!process.env.GEMINI_API_KEY) {
        console.log('⚠️  API Key not configured - generation will not work');
      } else {
        console.log('✅ API Key configured');
      }

      console.log('\nAvailable endpoints:');
      console.log('  GET    /health');
      console.log('  GET    /api/prompts');
      console.log('  POST   /api/prompts');
      console.log('  PUT    /api/prompts/:id');
      console.log('  DELETE /api/prompts/:id');
      console.log('  POST   /api/generate-post\n');
    });
  } catch (error) {
    logError('Server startup', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logInfo('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logInfo('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();
