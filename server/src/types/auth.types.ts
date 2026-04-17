/**
 * Authentication Domain Types
 * Type definitions for authentication-related operations
 * 
 * @module types/auth.types
 */

import { UserRole } from "../models/User.js";

/**
 * JWT Payload Interface
 * Structure of decoded JWT tokens
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  type: "access" | "refresh";
  iat?: number;                     // Issued at (timestamp)
  exp?: number;                     // Expiration (timestamp)
  iss?: string;                     // Issuer
  aud?: string;                     // Audience
}

/**
 * Token Pair
 * Access and refresh token combination
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Register Request DTO
 * Data required for user registration
 */
export interface RegisterRequestDTO {
  email: string;                    // required, valid email
  password: string;                 // required, min 8 chars, with uppercase, lowercase, number
  name: string;                     // required, 1-100 chars
}

/**
 * Login Request DTO
 * Data required for user login
 */
export interface LoginRequestDTO {
  email: string;                    // required, valid email
  password: string;                 // required
}

/**
 * Refresh Token Request DTO
 * Data for refreshing access token
 */
export interface RefreshTokenRequestDTO {
  refreshToken?: string;            // optional (from cookie)
}

/**
 * Forgot Password Request DTO
 * Data for requesting password reset
 */
export interface ForgotPasswordRequestDTO {
  email: string;                    // required, valid email
}

/**
 * Reset Password Request DTO
 * Data for resetting password
 */
export interface ResetPasswordRequestDTO {
  token: string;                    // required, reset token from email
  password: string;                 // required, min 8 chars
}

/**
 * Change Password Request DTO
 * Data for changing password (authenticated user)
 */
export interface ChangePasswordRequestDTO {
  currentPassword: string;          // required
  newPassword: string;              // required, min 8 chars
}

/**
 * Authentication Response DTO
 * Standard auth response with user and tokens
 */
export interface AuthResponseDTO {
  success: true;
  user: {
    _id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    isActive: boolean;
    lastLogin?: string;             // ISO 8601
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;              // seconds
    tokenType: "Bearer";
  };
  message: string;
}

/**
 * Token Refresh Response DTO
 */
export interface TokenRefreshResponseDTO {
  success: true;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: "Bearer";
  };
  message: string;
}

/**
 * Logout Response DTO
 */
export interface LogoutResponseDTO {
  success: true;
  message: string;
}

/**
 * Password Reset Response DTO
 */
export interface PasswordResetResponseDTO {
  success: true;
  message: string;
}

/**
 * Email Verification Response DTO
 */
export interface EmailVerificationResponseDTO {
  success: true;
  message: string;
}

/**
 * Cookie Options
 * Configuration for authentication cookies
 */
export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;                  // true in production
  sameSite: "lax" | "strict" | "none";
  maxAge: number;                   // milliseconds
  path: string;
}

/**
 * Token Blacklist Entry
 * Structure for blacklisted tokens
 */
export interface TokenBlacklistEntry {
  token: string;
  expiresAt: number;                // Unix timestamp (seconds)
  blacklistedAt: number;            // Unix timestamp
  reason?: string;                  // e.g., "logout", "password_change"
}

/**
 * Authentication Middleware Request
 * Extended Express request with user info
 */
export interface AuthenticatedRequest {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
  cookies?: Record<string, string>;
}

/**
 * Optional Authentication Request
 * Request where auth is optional (user may be undefined)
 */
export interface OptionalAuthRequest {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

/**
 * Rate Limit Configuration
 * Rate limiting for auth endpoints
 */
export interface AuthRateLimitConfig {
  windowMs: number;                 // Window duration in milliseconds
  max: number;                      // Max requests per window
  message: {
    success: false;
    error: string;
    message: string;
  };
  keyGenerator?: (req: unknown) => string;
  skip?: (req: unknown) => boolean;
}

/**
 * Password Requirements
 * Validation rules for passwords
 */
export interface PasswordRequirements {
  minLength: number;                // default: 8
  maxLength: number;                // default: 128
  requireUppercase: boolean;        // default: true
  requireLowercase: boolean;        // default: true
  requireNumbers: boolean;          // default: true
  requireSpecialChars: boolean;     // default: false (optional for better UX)
}

/**
 * Default password requirements for Mini ClickUp
 */
export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
};

/**
 * Validate password against requirements
 * @param password - Password to validate
 * @param requirements - Password requirements (optional, uses defaults)
 * @returns Validation result with errors if invalid
 */
export function validatePassword(
  password: string,
  requirements: PasswordRequirements = DEFAULT_PASSWORD_REQUIREMENTS,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < requirements.minLength) {
    errors.push(`Password must be at least ${requirements.minLength} characters`);
  }

  if (password.length > requirements.maxLength) {
    errors.push(`Password cannot exceed ${requirements.maxLength} characters`);
  }

  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (requirements.requireNumbers && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (requirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
