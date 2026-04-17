import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import User from "../models/User.js";
import * as tokenService from "../services/tokenService.js";

/**
 * API Response Interface
 */
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Login Request Body Interface
 */
interface LoginRequestBody {
  email: string;
  password: string;
}

/**
 * Register Request Body Interface
 */
interface RegisterRequestBody {
  email: string;
  password: string;
  name: string;
}

/**
 * Set authentication cookies on response
 * @param res - Express response object
 * @param accessToken - JWT access token
 * @param refreshToken - JWT refresh token
 */
function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
): void {
  const isProduction = process.env.NODE_ENV === "production";

  // Access token cookie (short-lived)
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: "/",
  });

  // Refresh token cookie (long-lived)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
}

/**
 * Clear authentication cookies
 * @param res - Express response object
 */
function clearAuthCookies(res: Response): void {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
}

/**
 * Register a new user
 * POST /api/auth/register
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export async function register(
  req: Request<unknown, ApiResponse, RegisterRequestBody>,
  res: Response<ApiResponse>,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        error: "Email already registered",
        message: "A user with this email already exists",
      });
      return;
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name,
      role: "user",
      isActive: true,
    });

    // Generate token pair
    const accessToken = tokenService.generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = tokenService.generateRefreshToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Return success response (password excluded by toJSON)
    res.status(201).json({
      success: true,
      data: {
        user: user.toJSON(),
      },
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Login user
 * POST /api/auth/login
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export async function login(
  req: Request<unknown, ApiResponse, LoginRequestBody>,
  res: Response<ApiResponse>,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password } = req.body;

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401).json({
        success: false,
        error: "Invalid credentials",
        message: "Email or password is incorrect",
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(403).json({
        success: false,
        error: "Account disabled",
        message: "Your account has been disabled. Please contact support.",
      });
      return;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: "Invalid credentials",
        message: "Email or password is incorrect",
      });
      return;
    }

    // Generate token pair
    const accessToken = tokenService.generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = tokenService.generateRefreshToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Return success response
    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON(),
      },
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Refresh access token
 * POST /api/auth/refresh-token
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export async function refreshToken(
  req: Request<unknown, ApiResponse>,
  res: Response<ApiResponse>,
  next: NextFunction,
): Promise<void> {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        error: "No refresh token provided",
        message: "Please login again to obtain a new refresh token",
      });
      return;
    }

    // Verify refresh token
    const payload = tokenService.verifyRefreshToken(refreshToken);

    // Find user
    const user = await User.findById(payload.userId).select("+password");

    if (!user) {
      res.status(401).json({
        success: false,
        error: "User not found",
        message: "User no longer exists",
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(403).json({
        success: false,
        error: "Account disabled",
        message: "Your account has been disabled",
      });
      return;
    }

    // Rotate tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      tokenService.rotateRefreshToken(refreshToken, {
        id: user._id,
        email: user.email,
        role: user.role,
      });

    // Set new cookies
    setAuthCookies(res, newAccessToken, newRefreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        clearAuthCookies(res);
        res.status(401).json({
          success: false,
          error: "Refresh token expired",
          message: "Please login again",
        });
        return;
      }

      if (error.name === "TokenRevokedError") {
        clearAuthCookies(res);
        res.status(401).json({
          success: false,
          error: "Token revoked",
          message: "Please login again",
        });
        return;
      }
    }

    next(error);
  }
}

/**
 * Logout user
 * POST /api/auth/logout
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export async function logout(
  req: Request<unknown, ApiResponse>,
  res: Response<ApiResponse>,
  next: NextFunction,
): Promise<void> {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Blacklist the refresh token
      tokenService.blacklistToken(refreshToken);
    }

    // Clear cookies
    clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get current user
 * GET /api/auth/me
 *
 * @param req - Express request object (with user attached by auth middleware)
 * @param res - Express response object
 * @param next - Express next function
 */
export async function getCurrentUser(
  req: Request & { user?: { userId: string } },
  res: Response<ApiResponse>,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: "Not authenticated",
        message: "Please login to access this resource",
      });
      return;
    }

    const user = await User.findById(req.user.userId).populate(
      "teams",
      "name avatar",
    );

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
        message: "User no longer exists",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Forgot Password
 * POST /api/auth/forgot-password
 */
export async function forgotPassword(
  req: Request<unknown, ApiResponse, { email: string }>,
  res: Response<ApiResponse>,
  next: NextFunction,
): Promise<void> {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase().trim() });

    // Always 200 to prevent user enumeration attacks
    if (!user) {
      res
        .status(200)
        .json({
          success: true,
          message: "If that email exists, you will receive a reset link.",
        });
      return;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL ?? "http://localhost:5173"}/reset-password?token=${rawToken}`;
    // TODO: Replace with email service in production
    console.log(`\n[PASSWORD RESET] Link for ${user.email}:\n${resetUrl}\n`);

    res
      .status(200)
      .json({
        success: true,
        message: "If that email exists, you will receive a reset link.",
      });
  } catch (error) {
    next(error);
  }
}

/**
 * Reset Password
 * POST /api/auth/reset-password
 */
export async function resetPassword(
  req: Request<unknown, ApiResponse, { token: string; password: string }>,
  res: Response<ApiResponse>,
  next: NextFunction,
): Promise<void> {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res
        .status(400)
        .json({ success: false, error: "Token and password are required" });
      return;
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select("+password");

    if (!user) {
      res
        .status(400)
        .json({ success: false, error: "Invalid or expired reset token" });
      return;
    }

    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Password reset successfully. You can now log in.",
      });
  } catch (error) {
    next(error);
  }
}
