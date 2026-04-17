/**
 * Socket.IO Event Handlers
 * Handles all real-time events for teams, projects, and tasks
 * 
 * @module sockets/handlers
 */

import { Server, Socket } from "socket.io";
import { getSocketUser, broadcastToTeam, broadcastToProject } from "./index.js";

/**
 * Setup all Socket.IO event handlers
 * @param io - Socket.IO Server instance
 */
export function setupSocketHandlers(io: Server): void {
  io.on("connection", (socket: Socket) => {
    const user = getSocketUser(socket);

    console.log(`🔌 User connected: ${socket.id} (userId: ${user?.userId})`);

    /**
     * Join team room
     * Allows user to receive real-time updates for a specific team
     */
    socket.on("join-team", (teamId: string) => {
      socket.join(`team:${teamId}`);
      console.log(`User ${socket.id} joined team ${teamId}`);
      
      // Confirm join to sender
      socket.emit("team-joined", { teamId });
    });

    /**
     * Join project room
     * Allows user to receive real-time updates for a specific project
     */
    socket.on("join-project", (projectId: string) => {
      socket.join(`project:${projectId}`);
      console.log(`User ${socket.id} joined project ${projectId}`);
      
      // Confirm join to sender
      socket.emit("project-joined", { projectId });
    });

    /**
     * Leave team room
     */
    socket.on("leave-team", (teamId: string) => {
      socket.leave(`team:${teamId}`);
      console.log(`User ${socket.id} left team ${teamId}`);
    });

    /**
     * Leave project room
     */
    socket.on("leave-project", (projectId: string) => {
      socket.leave(`project:${projectId}`);
      console.log(`User ${socket.id} left project ${projectId}`);
    });

    /**
     * Chat message in team
     * Broadcast chat message to all team members
     */
    socket.on("chat-message", (data: { teamId: string; content: string; type?: string }) => {
      if (!user) {
        socket.emit("error", { message: "Authentication required" });
        return;
      }

      const messageData = {
        ...data,
        userId: user.userId,
        email: user.email,
        timestamp: new Date().toISOString(),
      };

      // Broadcast to team
      broadcastToTeam(io, data.teamId, "chat-message-received", messageData);
    });

    /**
     * Task update event
     * Notify project members about task changes
     */
    socket.on("task-update", (data: { projectId: string; taskId: string; action: string }) => {
      if (!user) {
        socket.emit("error", { message: "Authentication required" });
        return;
      }

      const updateData = {
        ...data,
        userId: user.userId,
        timestamp: new Date().toISOString(),
      };

      // Broadcast to project
      broadcastToProject(io, data.projectId, "task-updated", updateData);
    });

    /**
     * Task status change
     * Notify when a task status changes (e.g., todo → in-progress)
     */
    socket.on("task-status-change", (data: { 
      projectId: string; 
      taskId: string; 
      oldStatus: string; 
      newStatus: string;
    }) => {
      if (!user) {
        socket.emit("error", { message: "Authentication required" });
        return;
      }

      broadcastToProject(io, data.projectId, "task-status-changed", {
        ...data,
        userId: user.userId,
        timestamp: new Date().toISOString(),
      });
    });

    /**
     * Task assignment
     * Notify user when they are assigned to a task
     */
    socket.on("task-assign", (data: { 
      projectId: string; 
      taskId: string; 
      assigneeId: string;
    }) => {
      if (!user) {
        socket.emit("error", { message: "Authentication required" });
        return;
      }

      broadcastToProject(io, data.projectId, "task-assigned", {
        ...data,
        assignedBy: user.userId,
        timestamp: new Date().toISOString(),
      });
    });

    /**
     * Typing indicator
     * Broadcast when user is typing in chat
     */
    socket.on("typing-start", (data: { teamId: string }) => {
      if (!user) {
        return;
      }

      broadcastToTeam(io, data.teamId, "user-typing", {
        userId: user.userId,
        email: user.email,
        timestamp: new Date().toISOString(),
      });
    });

    /**
     * Stop typing indicator
     */
    socket.on("typing-stop", (data: { teamId: string }) => {
      if (!user) {
        return;
      }

      broadcastToTeam(io, data.teamId, "user-stop-typing", {
        userId: user.userId,
      });
    });

    /**
     * User presence - online
     */
    socket.on("set-online", (data: { teamId?: string }) => {
      if (!user) {
        return;
      }

      // Broadcast to user's teams
      if (data.teamId) {
        broadcastToTeam(io, data.teamId, "user-online", {
          userId: user.userId,
          email: user.email,
          socketId: socket.id,
        });
      }
    });

    /**
     * User presence - offline
     */
    socket.on("set-offline", (data: { teamId?: string }) => {
      if (!user) {
        return;
      }

      if (data.teamId) {
        broadcastToTeam(io, data.teamId, "user-offline", {
          userId: user.userId,
          email: user.email,
        });
      }
    });

    /**
     * Handle socket disconnection
     */
    socket.on("disconnect", () => {
      console.log(`🔌 User disconnected: ${socket.id} (userId: ${user?.userId})`);
      
      // Notify rooms if user was authenticated
      if (user) {
        socket.broadcast.emit("user-disconnected", {
          userId: user.userId,
          socketId: socket.id,
        });
      }
    });

    /**
     * Handle connection errors
     */
    socket.on("error", (error: Error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });
}

/**
 * Emit task-created event to project members
 * Helper for controllers to emit events
 * 
 * @param io - Socket.IO Server instance
 * @param projectId - Project ID
 * @param taskData - Task data
 * @param userId - ID of user who created the task
 */
export function emitTaskCreated(
  io: Server,
  projectId: string,
  taskData: { _id: string; title: string; status: string },
  userId: string,
): void {
  broadcastToProject(io, projectId, "task-created", {
    taskId: taskData._id,
    task: taskData,
    userId,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Emit task-updated event to project members
 * @param io - Socket.IO Server instance
 * @param projectId - Project ID
 * @param taskData - Updated task data
 * @param userId - ID of user who updated the task
 */
export function emitTaskUpdated(
  io: Server,
  projectId: string,
  taskData: { _id: string; [key: string]: unknown },
  userId: string,
): void {
  broadcastToProject(io, projectId, "task-updated", {
    taskId: taskData._id,
    task: taskData,
    userId,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Emit task-deleted event to project members
 * @param io - Socket.IO Server instance
 * @param projectId - Project ID
 * @param taskId - Deleted task ID
 * @param userId - ID of user who deleted the task
 */
export function emitTaskDeleted(
  io: Server,
  projectId: string,
  taskId: string,
  userId: string,
): void {
  broadcastToProject(io, projectId, "task-deleted", {
    taskId,
    userId,
    timestamp: new Date().toISOString(),
  });
}
