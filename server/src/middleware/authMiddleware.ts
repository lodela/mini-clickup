import { authenticate } from "./auth.js";
import { Request, Response, NextFunction } from "express";

/**
 * Authentication middleware (direct, not factory)
 * Legacy alias for authenticate() — used by adminRoutes
 */
export const protect = authenticate();

/**
 * Role-based authorization middleware factory
 * Accepts role strings; stub for backward compatibility with GOD_MODE/CLIENT_A roles
 */
export function authorize(..._roles: string[]) {
  return (_req: Request, _res: Response, next: NextFunction): void => {
    next();
  };
}
