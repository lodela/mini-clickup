import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Import models (ensure they are registered with Mongoose)
// These imports register the models with Mongoose even if not directly used
import "./models/User.js";
import "./models/Team.js";
import "./models/Project.js";
import "./models/Task.js";
import "./models/Employee.js";
import "./models/Sprint.js";

// Import routes
import authRoutes from "./routes/auth.js";
import teamRoutes from "./routes/team.js";
import projectRoutes from "./routes/projects.js";
import taskRoutes from "./routes/tasks.js";
import sprintRoutes from "./routes/sprint.js";
import employeeRoutes from "./routes/employees.js";

// Import middleware
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// Import Socket.IO server
import { createSocketServer, getSocketUser } from "./sockets/index.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mini-clickup";
const NODE_ENV = process.env.NODE_ENV || "development";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// ============================================================================
// Security Middleware
// ============================================================================

// Helmet for security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["X-Total-Count", "X-Page-Count"],
  }),
);

// Cookie parser
app.use(cookieParser());

// JSON body parser with size limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============================================================================
// Rate Limiting
// ============================================================================

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: "Too many requests",
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all API routes
app.use("/api", apiLimiter);

// ============================================================================
// Request Logging Middleware
// ============================================================================

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log request
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`,
  );

  // Log response time on finish
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
    );
  });

  next();
});

// ============================================================================
// MongoDB Connection
// ============================================================================

async function connectToDatabase(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
    console.log(`📦 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

// ============================================================================
// Socket.IO Setup
// ============================================================================

// Create Socket.IO server with authentication middleware and handlers
const io = createSocketServer(httpServer);

// Make io instance accessible to the app (for controllers to emit events)
app.set("io", io);

// ============================================================================
// API Routes
// ============================================================================

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime(),
  });
});

// API version endpoint
app.get("/api", (_req: Request, res: Response) => {
  res.json({
    name: "Mini ClickUp API",
    version: "0.1.0",
    documentation: "/api/docs",
    endpoints: {
      auth: "/api/auth",
      teams: "/api/teams",
      projects: "/api/projects",
      tasks: "/api/tasks",
      employees: "/api/employees",
      sprints: "/api/sprints",
    },
    status: {
      auth: "available",
      teams: "available",
      projects: "available",
      tasks: "available",
      employees: "available",
      sprints: "available",
    },
  });
});

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/sprints", sprintRoutes);

// ============================================================================
// Error Handling
// ============================================================================

// 404 handler for unknown routes
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ============================================================================
// Graceful Shutdown
// ============================================================================

async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  // Close HTTP server
  httpServer.close(async () => {
    console.log("HTTP server closed");

    // Close MongoDB connection
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed");
    } catch (error) {
      console.error("Error closing MongoDB connection:", error);
    }

    // Close Socket.IO
    io.close();
    console.log("Socket.IO closed");

    // Exit process
    process.exit(0);
  });

  // Force shutdown after timeout
  setTimeout(() => {
    console.error("Forced shutdown due to timeout");
    process.exit(1);
  }, 30000);
}

// Handle shutdown signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("UNHANDLED_REJECTION");
});

// ============================================================================
// Start Server
// ============================================================================

async function startServer(): Promise<void> {
  try {
    // Connect to database
    await connectToDatabase();

    // Start HTTP server
    httpServer.listen(Number(PORT), "0.0.0.0", () => {
      console.log(
        `
╔═════════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Mini ClickUp API Server                              ║
║                                                           ║
║   Server running on: http://localhost:${PORT}              ║
║   Environment: ${NODE_ENV.padEnd(35)}║
║   Socket.IO ready                                         ║
║                                                           ║
║   Endpoints:                                              ║
║   - Health:  /api/health                                  ║
║   - Auth:    /api/auth                                    ║
║   - Teams:   /api/teams                                   ║
║   - Projects:/api/projects                                ║
║   - Tasks:   /api/tasks                                   ║
║                                                           ║
╚═════════════════════════════════════════════════════════════╝
`.trim(),
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Export for testing
export { app, io, httpServer };
export default app;
