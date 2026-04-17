import { Request, Response, NextFunction } from "express";

/**
 * Custom Error Class for Application Errors
 * Provides typed errors with HTTP status codes
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  /**
   * Create a new AppError
   * 
   * @param message - Error message
   * @param statusCode - HTTP status code (default: 500)
   * @param code - Error code for programmatic handling (optional)
   * @param isOperational - Whether this is an operational error (default: true)
   */
  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);

    // Set prototype explicitly (for extending built-in Error)
    Object.setPrototypeOf(this, AppError.prototype);
  }

  /**
   * Create a 400 Bad Request error
   */
  static badRequest(message: string = "Bad request"): AppError {
    return new AppError(message, 400, "BAD_REQUEST");
  }

  /**
   * Create a 401 Unauthorized error
   */
  static unauthorized(message: string = "Unauthorized"): AppError {
    return new AppError(message, 401, "UNAUTHORIZED");
  }

  /**
   * Create a 403 Forbidden error
   */
  static forbidden(message: string = "Forbidden"): AppError {
    return new AppError(message, 403, "FORBIDDEN");
  }

  /**
   * Create a 404 Not Found error
   */
  static notFound(message: string = "Resource not found"): AppError {
    return new AppError(message, 404, "NOT_FOUND");
  }

  /**
   * Create a 409 Conflict error
   */
  static conflict(message: string = "Resource conflict"): AppError {
    return new AppError(message, 409, "CONFLICT");
  }

  /**
   * Create a 422 Unprocessable Entity error
   */
  static unprocessableEntity(message: string = "Unprocessable entity"): AppError {
    return new AppError(message, 422, "UNPROCESSABLE_ENTITY");
  }

  /**
   * Create a 500 Internal Server Error error
   */
  static internal(message: string = "Internal server error"): AppError {
    return new AppError(message, 500, "INTERNAL_ERROR");
  }
}

/**
 * Error Response Interface
 */
interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
  stack?: string;
  details?: unknown;
}

/**
 * 404 Not Found Handler
 * Handles requests to non-existent routes
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export function notFound(
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const error = new AppError(
    `Route ${req.originalUrl} not found`,
    404,
    "ROUTE_NOT_FOUND",
  );

  res.status(404).json({
    success: false,
    error: error.code,
    message: error.message,
  });
}

/**
 * Global Error Handler Middleware
 * Catches all errors and sends consistent error responses
 * 
 * @param err - Error object (can be AppError or standard Error)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Determine if it's an AppError
  const isAppError = err instanceof AppError;

  // Get status code (default to 500)
  const statusCode = isAppError ? err.statusCode : 500;

  // Log error for debugging
  logError(err, req, statusCode);

  // Build error response
  const response: ErrorResponse = {
    success: false,
    error: isAppError && err.code ? err.code : "INTERNAL_ERROR",
    message: isAppError && err.isOperational ? err.message : "Internal server error",
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
    response.details = getErrorDetails(err);
  }

  // Send response
  res.status(statusCode).json(response);
}

/**
 * Log error to console (replace with Winston/logger in production)
 * 
 * @param err - Error object
 * @param req - Express request object
 * @param statusCode - HTTP status code
 */
function logError(
  err: Error | AppError,
  req: Request,
  statusCode: number,
): void {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  // Log error details
  console.error(`
[${timestamp}] ERROR [${statusCode}]
${method} ${url}
IP: ${ip}
Message: ${err.message}
Stack: ${err.stack}
`.trim());

  // Additional context for AppErrors
  if (err instanceof AppError) {
    console.error(`Code: ${err.code}, Operational: ${err.isOperational}`);
  }
}

/**
 * Get additional error details for debugging
 * 
 * @param err - Error object
 * @returns Error details object
 */
function getErrorDetails(err: Error): Record<string, unknown> {
  const details: Record<string, unknown> = {
    name: err.name,
    message: err.message,
  };

  // Include Mongoose-specific details if applicable
  if ("errors" in err && typeof err.errors === "object") {
    details.validationErrors = err.errors;
  }

  // Include Mongoose-specific properties
  if ("code" in err && typeof err.code === "number") {
    details.mongoCode = err.code;
  }

  if ("keyValue" in err && typeof err.keyValue === "object") {
    details.duplicateKey = err.keyValue;
  }

  return details;
}

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors and pass them to next()
 * 
 * @param fn - Async route handler function
 * @returns Wrapped route handler
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Create a specific error for database operations
 * 
 * @param message - Error message
 * @param originalError - Original database error
 * @returns AppError with database context
 */
export function createDatabaseError(
  message: string,
  originalError?: Error,
): AppError {
  const error = AppError.internal(message);

  if (originalError) {
    console.error("Database error details:", originalError);
  }

  return error;
}

/**
 * Handle Mongoose validation errors
 * 
 * @param error - Mongoose error object
 * @returns Formatted AppError
 */
export function handleMongooseValidationError(error: any): AppError {
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map(
      (err: any) => err.message,
    );
    return AppError.unprocessableEntity(messages.join(", "));
  }

  if (error.code === 11000) {
    // Duplicate key error
    const field = Object.keys(error.keyValue)[0];
    return AppError.conflict(`Duplicate value for field: ${field}`);
  }

  if (error.name === "CastError") {
    return AppError.badRequest(`Invalid ${error.path}: ${error.value}`);
  }

  return createDatabaseError("Database operation failed", error);
}
