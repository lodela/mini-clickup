/**
 * Socket.IO Authentication Middleware
 * Validates JWT tokens on socket connection
 * 
 * @module sockets/middleware
 */

import { Server, Socket } from "socket.io";
import * as tokenService from "../services/tokenService.js";

/**
 * Socket Authentication Middleware
 * Validates JWT token from cookie or auth object
 * 
 * @param io - Socket.IO Server instance
 */
export function setupSocketMiddleware(io: Server): void {
  io.use((socket: Socket, next: (err?: Error) => void) => {
    try {
      // Try to get token from handshake auth (explicit token passing)
      let token = socket.handshake.auth.token;

      // If not provided, try to get from cookies (HttpOnly)
      // Note: cookies need to be parsed from cookie header
      const cookieHeader = socket.handshake.headers.cookie;
      if (!token && cookieHeader) {
        const cookies = parseCookies(cookieHeader);
        token = cookies.accessToken;
      }

      if (!token) {
        return next(new Error("Authentication required"));
      }

      // Verify token
      const payload = tokenService.verifyAccessToken(token);

      // Attach user to socket for use in handlers
      socket.data.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };

      next();
    } catch (error) {
      // Handle JWT errors
      if (error instanceof Error) {
        if (error.name === "TokenExpiredError") {
          return next(new Error("Token expired"));
        }
        if (error.name === "TokenRevokedError") {
          return next(new Error("Token revoked"));
        }
        if (error.name === "InvalidTokenError") {
          return next(new Error("Invalid token"));
        }
      }
      return next(new Error("Authentication failed"));
    }
  });
}

/**
 * Parse cookies from cookie header string
 * @param cookieHeader - Cookie header string
 * @returns Parsed cookies object
 */
function parseCookies(cookieHeader: string): Record<string, string> {
  return cookieHeader
    .split(";")
    .map((c) => c.trim())
    .reduce((acc, curr) => {
      const equalsIndex = curr.indexOf("=");
      if (equalsIndex !== -1) {
        const key = curr.substring(0, equalsIndex).trim();
        const value = curr.substring(equalsIndex + 1).trim();
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
}

/**
 * Require authentication for socket event
 * Middleware for specific event handlers
 * 
 * @param socket - Socket.IO socket instance
 * @param next - Next function
 * @returns Error if not authenticated
 */
export function requireAuth(socket: Socket, next: (err?: Error) => void): void {
  if (!socket.data.user) {
    return next(new Error("Authentication required"));
  }
  next();
}

/**
 * Require specific role for socket event
 * Middleware for role-based access control
 * 
 * @param roles - Allowed roles
 * @returns Middleware function
 */
export function requireRole(...roles: string[]) {
  return (socket: Socket, next: (err?: Error) => void): void => {
    if (!socket.data.user) {
      return next(new Error("Authentication required"));
    }

    if (!roles.includes(socket.data.user.role)) {
      return next(new Error(`Required role: ${roles.join(" or ")}`));
    }

    next();
  };
}
