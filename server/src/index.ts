import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Import models (ensure they are registered with Mongoose)
import './models/User.js';
import './models/Team.js';
import './models/Project.js';
import './models/Task.js';
import './models/Employee.js';
import './models/Sprint.js';
import './models/Company.js';
import './models/ActionLog.js';
import './models/Role.js';
import './models/OtpToken.js';
import './models/Invitation.js';
import './models/Epic.js';
import './models/Story.js';
import './models/Catalog.js';

// Import routes
import authRoutes from './routes/auth.js';
import teamRoutes from './routes/team.js';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';
import sprintRoutes from './routes/sprint.js';
import employeeRoutes from './routes/employees.js';
import adminRoutes from './routes/adminRoutes.js';
import companyRoutes from './routes/companies.js';
import epicRoutes from './routes/epics.js';
import storyRoutes from './routes/stories.js';
import catalogRoutes from './routes/catalogs.js';
import projectDocumentRoutes from './routes/projectDocuments.js';

// Import middleware
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Import Socket.IO server
import { createSocketServer } from './sockets/index.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mini-clickup';
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ============================================================================
// Security Middleware
// ============================================================================
app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================================
// Rate Limiting
// ============================================================================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests', message: 'Try again later.' },
});
app.use('/api', apiLimiter);

// ============================================================================
// Request Logging
// ============================================================================
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${Date.now() - start}ms`,
    );
  });
  next();
});

// ============================================================================
// Socket.IO Setup
// ============================================================================
const io = createSocketServer(httpServer);
app.set('io', io);

// ============================================================================
// API Routes
// ============================================================================
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/sprints', sprintRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/epics', epicRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/catalogs', catalogRoutes);
app.use('/api/project-documents', projectDocumentRoutes);

// ============================================================================
// Static Files (Production)
// ============================================================================
if (NODE_ENV === 'production') {
  const clientDistPath = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientDistPath));

  // SPA catch-all — serve index.html for non-API routes so React Router works
  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// ============================================================================
// Error Handling
// ============================================================================
app.use(notFound);
app.use(errorHandler);

// ============================================================================
// Database & Server Start
// ============================================================================
async function startServer(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    httpServer.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`🚀 Mini ClickUp API Server running on: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
export { app, io, httpServer };
export default app;
