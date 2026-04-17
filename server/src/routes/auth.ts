import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import { z } from "zod";

/**
 * Create router
 */
const router = Router();

/**
 * Zod validation schemas
 */
const registerSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email too long")
    .transform((val) => val.toLowerCase().trim()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
  name: z.string().min(1, "Name is required").max(100, "Name too long").trim(),
});

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .max(255)
    .transform((val) => val.toLowerCase().trim()),
  password: z.string().min(1, "Password is required"),
});

/**
 * Rate limiters for auth endpoints
 */

// Strict rate limiter for login (prevent brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    error: "Too many login attempts",
    message: "Please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.body?.email || req.ip;
  },
});

// Moderate rate limiter for registration
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 registrations per hour per IP
  message: {
    success: false,
    error: "Too many registration attempts",
    message: "Please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "development",
});

// Rate limiter for token refresh
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 refresh attempts per window
  message: {
    success: false,
    error: "Too many token refresh attempts",
    message: "Please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Routes
 */

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post(
  "/register",
  registerLimiter,
  validate(registerSchema),
  authController.register,
);

/**
 * POST /api/auth/login
 * Authenticate user and return tokens
 */
router.post(
  "/login",
  loginLimiter,
  validate(loginSchema),
  authController.login,
);

/**
 * POST /api/auth/refresh-token
 * Refresh access token using refresh token
 */
router.post("/refresh-token", refreshLimiter, authController.refreshToken);

/**
 * POST /api/auth/logout
 * Logout user and invalidate tokens
 */
router.post("/logout", authController.logout);

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get("/me", authenticate(), authController.getCurrentUser);

/**
 * POST /api/auth/forgot-password
 * Send password reset link to email
 */
router.post("/forgot-password", authController.forgotPassword);

/**
 * POST /api/auth/reset-password
 * Reset password using valid token
 */
router.post("/reset-password", authController.resetPassword);

export default router;
