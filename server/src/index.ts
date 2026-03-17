import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mini-clickup";

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// MongoDB connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication required"));
  }
  // TODO: Verify JWT token here
  next();
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on("join-team", (teamId: string) => {
    socket.join(`team:${teamId}`);
    console.log(`User ${socket.id} joined team ${teamId}`);
  });

  socket.on("join-project", (projectId: string) => {
    socket.join(`project:${projectId}`);
    console.log(`User ${socket.id} joined project ${projectId}`);
  });

  socket.on("chat-message", (data) => {
    io.to(`team:${data.teamId}`).emit("chat-message-received", data);
  });

  socket.on("task-update", (data) => {
    io.to(`project:${data.projectId}`).emit("task-updated", data);
  });

  socket.on("disconnect", () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  },
);

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO ready`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

export { io };
export default app;
