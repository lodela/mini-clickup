import { Request, Response, NextFunction } from "express";
import * as tokenService from "../services/tokenService.js";

/**
 * User Role Type
 */
export type UserRole = "user" | "admin";

/**
 * Authenticated Request Interface
 */
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

/**
 * Authentication middleware factory
 * Verifies JWT access token and attaches user to request
 * 
 * @returns Express middleware function
 */
export function authenticate() {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Get token from cookies or Authorization header
      const token =
        req.cookies?.accessToken ||
        req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
          message: "No access token provided",
        });
        return;
      }

      // Verify token
      const payload = tokenService.verifyAccessToken(token);

      // Attach user to request
      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role as UserRole,
      };

      next();
    } catch (error) {
      // Handle JWT errors
      if (error instanceof Error) {
        if (error.name === "TokenExpiredError") {
          res.status(401).json({
            success: false,
            error: "Token expired",
            message: "Access token has expired. Please refresh your token.",
          });
          return;
        }

        if (error.name === "TokenRevokedError") {
          res.status(401).json({
            success: false,
            error: "Token revoked",
            message: "Token has been revoked. Please login again.",
          });
          return;
        }

        if (error.name === "InvalidTokenError") {
          res.status(401).json({
            success: false,
            error: "Invalid token",
            message: "The provided token is invalid",
          });
          return;
        }
      }

      // Pass other errors to error handler
      next(error);
    }
  };
}

/**
 * Authorization middleware factory
 * Checks if user has required role(s)
 * 
 * @param roles - Allowed roles
 * @returns Express middleware function
 */
export function authorize(...roles: UserRole[]) {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Ensure authentication middleware ran first
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
          message: "Please login to access this resource",
        });
        return;
      }

      // Check if user has required role
      if (!roles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          error: "Insufficient permissions",
          message: `Required role: ${roles.join(" or ")}`,
        });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require it
 * Useful for endpoints that behave differently for authenticated users
 */
export function optionalAuth() {
  return async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.headers.authorization?.replace("Bearer ", "");

      if (token) {
        try {
          const payload = tokenService.verifyAccessToken(token);

          req.user = {
            userId: payload.userId,
            email: payload.email,
            role: payload.role as UserRole,
          };
        } catch {
          // Token invalid, but that's okay for optional auth
          // req.user remains undefined
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
