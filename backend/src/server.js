// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

// Now import everything else
import express from 'express';
import cors from 'cors';
import generateRouter from './routes/generate.js';
import { logInfo, logError } from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    environment: process.env.NODE_ENV || 'development',
    apiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// API Routes
app.use('/api/generate', generateRouter);

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
    // Check for required environment variables
    if (!process.env.GEMINI_API_KEY) {
      console.warn('\n⚠️  WARNING: GEMINI_API_KEY is not set!');
      console.warn('Please set it in your .env file to use the generation feature.\n');
    }

    app.listen(PORT, () => {
      console.log('\n✨ X Post Generator - AI-Powered Content Creation ✨\n');
      console.log(`🚀 Server: http://localhost:${PORT}`);
      console.log(`🌐 Frontend: ${FRONTEND_URL}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Logging: ${process.env.LOG_GENERATIONS === 'true' ? 'Enabled' : 'Disabled'}\n`);

      if (!process.env.GEMINI_API_KEY) {
        console.log('⚠️  API Key: Not configured');
        console.log('   → Add GEMINI_API_KEY to backend/.env');
      } else {
        console.log('✅ API Key: Configured');
      }

      console.log('\n📡 API Endpoints:');
      console.log('   GET  /health');
      console.log('   POST /api/generate\n');
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
