import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './config/logger.js';
import prisma from './config/prisma.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { apiRateLimiter } from './middlewares/rateLimiter.middleware.js';

const app = express();

// Security Headers with Helmet
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply Rate Limiting to all API routes
app.use(['/api', '/api/v1', '/v1'], apiRateLimiter);

// HTTP Request logging with Morgan + Winston
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

// Health Check Endpoints (Supports /health, /api/health, /api/v1/health)
const healthHandler = (req: express.Request, res: express.Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'PlateOS Production Backend API',
    timestamp: new Date().toISOString(),
  });
};

const healthDetailsHandler = async (req: express.Request, res: express.Response) => {
  let dbStatus = 'disconnected';
  let dbLatencyMs = null;

  const startTime = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
    dbLatencyMs = Date.now() - startTime;
  } catch (e) {
    dbStatus = 'offline_demo_mode';
  }

  const memoryUsage = process.memoryUsage();

  res.status(200).json({
    status: 'ok',
    service: 'PlateOS Production Server',
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
    },
    memoryUsage: {
      rssMb: (memoryUsage.rss / 1024 / 1024).toFixed(2),
      heapTotalMb: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
      heapUsedMb: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
    },
    timestamp: new Date().toISOString(),
  });
};

app.get(['/health', '/api/health', '/api/v1/health', '/v1/health'], healthHandler);
app.get(['/health/details', '/api/health/details', '/api/v1/health/details', '/v1/health/details'], healthDetailsHandler);

// Handle duplicate /api/v1/api prefix if sent by mistake
app.use((req, res, next) => {
  if (req.url.startsWith('/api/v1/api/')) {
    req.url = req.url.replace('/api/v1/api/', '/api/');
  } else if (req.url.startsWith('/v1/api/')) {
    req.url = req.url.replace('/v1/api/', '/api/');
  }
  next();
});

// API Routes Mounting (Supports /api, /api/v1, /v1)
app.use('/api', routes);
app.use('/api/v1', routes);
app.use('/v1', routes);

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
