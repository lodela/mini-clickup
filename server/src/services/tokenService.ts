import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { StringValue } from "ms";

/**
 * Token Payload Interface
 */
interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
  role: string;
  type: "access" | "refresh";
}

/**
 * Token Pair Interface
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Token Blacklist Store (In-memory for MVP - Replace with Redis in production)
 */
class TokenBlacklist {
  private blacklist: Map<string, number> = new Map();

  /**
   * Add token to blacklist with expiration time
   * @param token - Token to blacklist
   * @param expiresAt - Expiration timestamp in seconds
   */
  add(token: string, expiresAt: number): void {
    this.blacklist.set(token, expiresAt);
    
    // Clean up expired tokens periodically
    if (this.blacklist.size > 1000) {
      this.cleanup();
    }
  }

  /**
   * Check if token is blacklisted
   * @param token - Token to check
   * @returns Boolean indicating if token is blacklisted
   */
  isBlacklisted(token: string): boolean {
    const expiresAt = this.blacklist.get(token);
    
    if (!expiresAt) {
      return false;
    }

    // Check if blacklist entry has expired
    if (Date.now() > expiresAt * 1000) {
      this.blacklist.delete(token);
      return false;
    }

    return true;
  }

  /**
   * Clean up expired tokens from blacklist
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [token, expiresAt] of this.blacklist.entries()) {
      if (now > expiresAt * 1000) {
        this.blacklist.delete(token);
      }
    }
  }
}

// Singleton blacklist instance
const tokenBlacklist = new TokenBlacklist();

/**
 * Get JWT configuration from environment
 */
const getJwtConfig = () => ({
  secret: process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
  accessExpiresIn: process.env.JWT_EXPIRES_IN || "15m",
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
});

/**
 * Generate access token
 * @param user - User object with id, email, and role
 * @returns Signed JWT access token
 */
export function generateAccessToken(user: {
  id: Types.ObjectId | string;
  email: string;
  role: string;
}): string {
  const { secret, accessExpiresIn } = getJwtConfig();

  const payload: TokenPayload = {
    userId: user.id.toString(),
    email: user.email,
    role: user.role,
    type: "access",
  };

  const options: SignOptions = {
    expiresIn: accessExpiresIn as StringValue | number,
    issuer: "mini-clickup-api",
    audience: "mini-clickup-client",
  };

  return jwt.sign(payload, secret, options);
}

/**
 * Generate refresh token
 * @param user - User object with id, email, and role
 * @returns Signed JWT refresh token
 */
export function generateRefreshToken(user: {
  id: Types.ObjectId | string;
  email: string;
  role: string;
}): string {
  const { secret, refreshExpiresIn } = getJwtConfig();

  const payload: TokenPayload = {
    userId: user.id.toString(),
    email: user.email,
    role: user.role,
    type: "refresh",
  };

  const options: SignOptions = {
    expiresIn: refreshExpiresIn as StringValue | number,
    issuer: "mini-clickup-api",
    audience: "mini-clickup-client",
  };

  return jwt.sign(payload, secret, options);
}

/**
 * Verify access token
 * @param token - JWT access token to verify
 * @returns Decoded token payload
 * @throws JsonWebTokenError if token is invalid
 * @throws TokenExpiredError if token has expired
 */
export function verifyAccessToken(token: string): TokenPayload {
  const { secret } = getJwtConfig();

  // Check if token is blacklisted
  if (tokenBlacklist.isBlacklisted(token)) {
    const error = new Error("Token has been revoked") as Error & {
      name: string;
    };
    error.name = "TokenRevokedError";
    throw error;
  }

  const payload = jwt.verify(token, secret, {
    issuer: "mini-clickup-api",
    audience: "mini-clickup-client",
  }) as TokenPayload;

  // Verify token type
  if (payload.type !== "access") {
    const error = new Error("Invalid token type") as Error & { name: string };
    error.name = "InvalidTokenError";
    throw error;
  }

  return payload;
}

/**
 * Verify refresh token
 * @param token - JWT refresh token to verify
 * @returns Decoded token payload
 * @throws JsonWebTokenError if token is invalid
 * @throws TokenExpiredError if token has expired
 */
export function verifyRefreshToken(token: string): TokenPayload {
  const { secret } = getJwtConfig();

  // Check if token is blacklisted
  if (tokenBlacklist.isBlacklisted(token)) {
    const error = new Error("Token has been revoked") as Error & {
      name: string;
    };
    error.name = "TokenRevokedError";
    throw error;
  }

  const payload = jwt.verify(token, secret, {
    issuer: "mini-clickup-api",
    audience: "mini-clickup-client",
  }) as TokenPayload;

  // Verify token type
  if (payload.type !== "refresh") {
    const error = new Error("Invalid token type") as Error & { name: string };
    error.name = "InvalidTokenError";
    throw error;
  }

  return payload;
}

/**
 * Rotate refresh token
 * Blacklists old token and generates new token pair
 * @param oldRefreshToken - Current refresh token
 * @param user - User object for generating new tokens
 * @returns New token pair
 */
export function rotateRefreshToken(
  oldRefreshToken: string,
  user: { id: Types.ObjectId | string; email: string; role: string },
): TokenPair {
  // Blacklist the old refresh token
  try {
    const decoded = jwt.decode(oldRefreshToken) as JwtPayload & {
      exp?: number;
    };
    if (decoded?.exp) {
      tokenBlacklist.add(oldRefreshToken, decoded.exp);
    }
  } catch (error) {
    // If decoding fails, still blacklist with default expiration
    tokenBlacklist.add(oldRefreshToken, Math.floor(Date.now() / 1000) + 604800); // 7 days
  }

  // Generate new token pair
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { accessToken, refreshToken };
}

/**
 * Blacklist a token
 * @param token - Token to blacklist
 * @param expiresAt - Optional expiration timestamp (defaults to token's exp)
 */
export function blacklistToken(token: string, expiresAt?: number): void {
  if (expiresAt) {
    tokenBlacklist.add(token, expiresAt);
  } else {
    try {
      const decoded = jwt.decode(token) as JwtPayload & { exp?: number };
      if (decoded?.exp) {
        tokenBlacklist.add(token, decoded.exp);
      } else {
        // Default to 24 hours if no expiration found
        tokenBlacklist.add(token, Math.floor(Date.now() / 1000) + 86400);
      }
    } catch {
      // Default to 24 hours if decoding fails
      tokenBlacklist.add(token, Math.floor(Date.now() / 1000) + 86400);
    }
  }
}

/**
 * Get blacklist size (for monitoring)
 * @returns Number of tokens in blacklist
 */
export function getBlacklistSize(): number {
  return tokenBlacklist["blacklist"].size;
}

/**
 * Clear blacklist (for testing only)
 */
export function clearBlacklist(): void {
  tokenBlacklist["blacklist"].clear();
}
