/**
 * User Domain Types
 * Type definitions for user-related operations
 * 
 * @module types/user.types
 */

import { UserRole } from "../models/User.js";

/**
 * User Role Type
 */
export type { UserRole };

/**
 * Register User DTO
 * Data required to register a new user
 */
export interface RegisterUserDTO {
  email: string;                    // required, valid email, unique
  password: string;                 // required, min 8 chars
  name: string;                     // required, 1-100 chars
}

/**
 * Login User DTO
 * Data required for user login
 */
export interface LoginUserDTO {
  email: string;                    // required, valid email
  password: string;                 // required
}

/**
 * Update User DTO
 * Partial data for updating an existing user
 */
export interface UpdateUserDTO {
  name?: string;
  email?: string;
  avatar?: string;
  role?: UserRole;
  isActive?: boolean;
}

/**
 * Change Password DTO
 * Data for changing user password
 */
export interface ChangePasswordDTO {
  currentPassword: string;          // required
  newPassword: string;              // required, min 8 chars
}

/**
 * Reset Password DTO
 * Data for resetting password with token
 */
export interface ResetPasswordDTO {
  token: string;                    // required, reset token
  newPassword: string;              // required, min 8 chars
}

/**
 * Forgot Password DTO
 * Data for requesting password reset
 */
export interface ForgotPasswordDTO {
  email: string;                    // required, valid email
}

/**
 * User Query Parameters
 * Query parameters for listing users
 */
export interface UserQueryParams {
  page?: number;                    // default: 1
  limit?: number;                   // default: 10, max: 100
  search?: string;                  // search by name or email
  role?: UserRole;
  isActive?: boolean;
  sortBy?: string;                  // default: "createdAt"
  sortOrder?: "asc" | "desc";       // default: "desc"
}

/**
 * User Response DTO
 * Standardized user response format (public profile)
 */
export interface UserResponse {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;               // ISO 8601
  createdAt: string;                // ISO 8601
  updatedAt: string;                // ISO 8601
}

/**
 * User Profile Response
 * Extended user information including teams
 */
export interface UserProfileResponse extends UserResponse {
  teams: Array<{
    _id: string;
    name: string;
    avatar?: string;
    role: "admin" | "member" | "guest";  // user's role in the team
  }>;
  projects?: Array<{
    _id: string;
    name: string;
    color?: string;
    role: "owner" | "admin" | "member" | "viewer";
  }>;
  stats?: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
  };
}

/**
 * User List Response
 * Paginated list of users
 */
export interface UserListResponse {
  users: UserResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Auth Tokens Response
 * JWT tokens for authentication
 */
export interface AuthTokensResponse {
  accessToken: string;              // JWT, short-lived (15 min)
  refreshToken: string;             // JWT, long-lived (7 days)
  expiresIn: number;                // seconds (900 = 15 min)
  tokenType: "Bearer";
}

/**
 * Login Response
 * Complete login response with user and tokens
 */
export interface LoginResponse {
  success: true;
  user: UserResponse;
  tokens: AuthTokensResponse;
  message: string;
}

/**
 * Register Response
 * Complete registration response
 */
export interface RegisterResponse {
  success: true;
  user: UserResponse;
  tokens: AuthTokensResponse;
  message: string;
}

/**
 * Token Refresh Response
 * Response for token refresh endpoint
 */
export interface TokenRefreshResponse {
  success: true;
  tokens: AuthTokensResponse;
  message: string;
}

/**
 * Logout Response
 */
export interface LogoutResponse {
  success: true;
  message: string;
}

/**
 * User Statistics
 * Aggregated user data for dashboards
 */
export interface UserStatistics {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  tasksByPriority: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
  averageCompletionTime: number;    // hours
  tasksThisSprint: number;
  tasksThisWeek: number;
}

/**
 * User Activity
 * Recent user activity for activity feed
 */
export interface UserActivity {
  _id: string;
  userId: string;
  userName: string;
  action: "task_created" | "task_updated" | "task_completed" | "comment_added" | "file_uploaded";
  targetType: "task" | "project" | "team" | "comment";
  targetId: string;
  targetName?: string;
  timestamp: string;                // ISO 8601
  metadata?: Record<string, unknown>;
}
