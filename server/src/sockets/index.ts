/**
 * Socket.IO Server Configuration
 * Centralized Socket.IO setup with authentication and event handlers
 * 
 * @module sockets/index
 */

import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { setupSocketHandlers } from "./handlers.js";
import { setupSocketMiddleware } from "./middleware.js";

/**
 * Socket.IO Server Options
 */
const socketOptions = {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["websocket" as "websocket", "polling" as "polling"],
  pingTimeout: 60000,
  pingInterval: 25000,
};

/**
 * Create and configure Socket.IO server
 * @param httpServer - HTTP server instance to attach to
 * @returns Configured Socket.IO Server instance
 */
export function createSocketServer(httpServer: ReturnType<typeof createServer>): Server {
  const io = new Server(httpServer, socketOptions);

  // Setup authentication middleware
  setupSocketMiddleware(io);

  // Setup event handlers
  setupSocketHandlers(io);

  return io;
}

/**
 * Get authenticated user from socket
 * Type-safe helper for accessing user data attached to socket
 * 
 * @param socket - Socket.IO socket instance
 * @returns User data if authenticated, undefined otherwise
 */
export function getSocketUser(socket: Socket) {
  return socket.data.user as {
    userId: string;
    email: string;
    role: string;
  } | undefined;
}

/**
 * Broadcast event to team members
 * @param io - Socket.IO Server instance
 * @param teamId - Team ID to broadcast to
 * @param event - Event name
 * @param data - Event data
 */
export function broadcastToTeam(
  io: Server,
  teamId: string,
  event: string,
  data: unknown,
): void {
  io.to(`team:${teamId}`).emit(event, data);
}

/**
 * Broadcast event to project members
 * @param io - Socket.IO Server instance
 * @param projectId - Project ID to broadcast to
 * @param event - Event name
 * @param data - Event data
 */
export function broadcastToProject(
  io: Server,
  projectId: string,
  event: string,
  data: unknown,
): void {
  io.to(`project:${projectId}`).emit(event, data);
}

/**
 * Send event to specific user
 * @param io - Socket.IO Server instance
 * @param userId - User ID to send to
 * @param event - Event name
 * @param data - Event data
 */
export function sendToUser(
  io: Server,
  userId: string,
  event: string,
  data: unknown,
): void {
  // Note: This requires mapping userId to socketId
  // Implementation depends on your user tracking strategy
  io.to(`user:${userId}`).emit(event, data);
}
