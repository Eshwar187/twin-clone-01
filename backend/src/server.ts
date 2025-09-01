import dotenv from 'dotenv';
// Load environment variables BEFORE other imports so modules can read them
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { connectDatabase } from '@/config/database';
import { errorHandler } from '@/middleware/errorHandler';
import { notFound } from '@/middleware/notFound';
import { authMiddleware } from '@/middleware/auth';
import { logger } from '@/utils/logger';
import { setupSocketIO } from '@/services/socketService';

// Import routes
import authRoutes from '@/routes/auth';
import userRoutes from '@/routes/user';
import healthRoutes from '@/routes/health';
import budgetRoutes from '@/routes/budget';
import billsRoutes from '@/routes/bills';
import notesRoutes from '@/routes/notes';
import calendarRoutes from '@/routes/calendar';
import avatarRoutes from '@/routes/avatar';
import analyticsRoutes from '@/routes/analytics';

// Env already loaded at top

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim())
    }
  }));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
const apiRouter = express.Router();

// Public routes (no authentication required)
apiRouter.use('/auth', authRoutes);

// Protected routes (authentication required)
apiRouter.use('/user', authMiddleware, userRoutes);
apiRouter.use('/health', authMiddleware, healthRoutes);
apiRouter.use('/budget', authMiddleware, budgetRoutes);
apiRouter.use('/bills', authMiddleware, billsRoutes);
apiRouter.use('/notes', authMiddleware, notesRoutes);
apiRouter.use('/calendar', authMiddleware, calendarRoutes);
apiRouter.use('/avatar', authMiddleware, avatarRoutes);
apiRouter.use('/analytics', authMiddleware, analyticsRoutes);

app.use(`/api/${API_VERSION}`, apiRouter);

// Root info route to avoid 404 confusion when hitting '/'
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Digital Doppelgänger Backend',
    apiBase: `/api/${API_VERSION}`,
    health: '/health',
    docs: 'Use authenticated routes under apiBase (e.g., /health/dashboard)'
  });
});

// Setup Socket.IO
setupSocketIO(io);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    
    server.listen(PORT, () => {
      logger.info(`🚀 Digital Doppelgänger Backend running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 API Base URL: http://localhost:${PORT}/api/${API_VERSION}`);
      logger.info(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Only start server if this file is run directly
if (require.main === module) {
  startServer();
}

export { app, server, io };
