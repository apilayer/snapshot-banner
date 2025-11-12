import express from 'express';
import cors from 'cors';
import { config, validateConfig } from './config/config.js';
import screenshotRoutes from './routes/screenshot.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Validate environment variables
try {
  validateConfig();
} catch (error) {
  console.error('Configuration Error:', error.message);
  process.exit(1);
}

// Initialize Express app
const app = express();

// Parse JSON and URL-encoded bodies FIRST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (config.cors.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS
app.use(cors(corsOptions));

// Request logging in development
if (config.server.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api', screenshotRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Snapshotbanner API',
    version: '1.0.0',
    description: 'Secure middleware for Screenshotlayer API',
    endpoints: {
      health: 'GET /api/health',
      screenshot: 'POST /api/screenshot',
      screenshotProxy: 'POST /api/screenshot/proxy',
      screenshotUrl: 'GET /api/screenshot/url'
    }
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   Snapshotbanner API Server Running     ║
╠══════════════════════════════════════════╣
║  Environment: ${config.server.nodeEnv.padEnd(27)}║
║  Port:        ${PORT.toString().padEnd(27)}║
║  URL:         http://localhost:${PORT}      ║
╠══════════════════════════════════════════╣
║  Endpoints:                              ║
║  - GET  /                                ║
║  - GET  /api/health                      ║
║  - POST /api/screenshot                  ║
║  - POST /api/screenshot/proxy            ║
║  - GET  /api/screenshot/url              ║
╚══════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
