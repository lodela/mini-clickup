/**
 * Custom Error Classes for Application
 * Provides typed errors with HTTP status codes for consistent error handling
 * 
 * @module utils/errors
 */

/**
 * Base Application Error Class
 * Extends native Error with HTTP status code and error code
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  /**
   * Create a new AppError
   *
   * @param message - Error message
   * @param statusCode - HTTP status code (default: 500)
   * @param code - Error code for programmatic handling
   * @param isOperational - Whether this is an operational error (default: true)
   */
  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_ERROR",
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
   * @param message - Custom error message
   */
  static badRequest(message: string = "Bad request"): AppError {
    return new AppError(message, 400, "BAD_REQUEST");
  }

  /**
   * Create a 401 Unauthorized error
   * @param message - Custom error message
   */
  static unauthorized(message: string = "Unauthorized"): AppError {
    return new AppError(message, 401, "UNAUTHORIZED");
  }

  /**
   * Create a 403 Forbidden error
   * @param message - Custom error message
   */
  static forbidden(message: string = "Forbidden"): AppError {
    return new AppError(message, 403, "FORBIDDEN");
  }

  /**
   * Create a 404 Not Found error
   * @param message - Custom error message
   */
  static notFound(message: string = "Resource not found"): AppError {
    return new AppError(message, 404, "NOT_FOUND");
  }

  /**
   * Create a 409 Conflict error
   * @param message - Custom error message
   */
  static conflict(message: string = "Resource conflict"): AppError {
    return new AppError(message, 409, "CONFLICT");
  }

  /**
   * Create a 422 Unprocessable Entity error
   * @param message - Custom error message
   */
  static unprocessableEntity(message: string = "Unprocessable entity"): AppError {
    return new AppError(message, 422, "UNPROCESSABLE_ENTITY");
  }

  /**
   * Create a 500 Internal Server Error
   * @param message - Custom error message
   */
  static internal(message: string = "Internal server error"): AppError {
    return new AppError(message, 500, "INTERNAL_ERROR");
  }

  /**
   * Create a 503 Service Unavailable error
   * @param message - Custom error message
   */
  static serviceUnavailable(message: string = "Service unavailable"): AppError {
    return new AppError(message, 503, "SERVICE_UNAVAILABLE");
  }
}

/**
 * Not Found Error
 * Specific error for resources that don't exist
 * Alias for AppError.notFound() for backward compatibility
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Bad Request Error
 * Specific error for invalid client requests
 */
export class BadRequestError extends AppError {
  constructor(message: string = "Bad request") {
    super(message, 400, "BAD_REQUEST");
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

/**
 * Unauthorized Error
 * Specific error for authentication failures
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * Forbidden Error
 * Specific error for authorization failures
 */
export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403, "FORBIDDEN");
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * Conflict Error
 * Specific error for resource conflicts (e.g., duplicates)
 */
export class ConflictError extends AppError {
  constructor(message: string = "Resource conflict") {
    super(message, 409, "CONFLICT");
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Validation Error
 * Specific error for validation failures
 */
export class ValidationError extends AppError {
  public readonly fields?: Record<string, string>;

  constructor(
    message: string = "Validation error",
    fields?: Record<string, string>,
  ) {
    super(message, 400, "VALIDATION_ERROR");
    this.fields = fields;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Database Error
 * Specific error for database operation failures
 */
export class DatabaseError extends AppError {
  public readonly originalError?: Error;

  constructor(
    message: string = "Database operation failed",
    originalError?: Error,
  ) {
    super(message, 500, "DATABASE_ERROR");
    this.originalError = originalError;
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * Type guard to check if error is an AppError
 * @param error - Error to check
 * @returns Boolean indicating if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Type guard to check if error is a NotFoundError
 * @param error - Error to check
 * @returns Boolean indicating if error is a NotFoundError
 */
export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError;
}

/**
 * Format error for API response
 * @param error - Error to format
 * @param includeStack - Whether to include stack trace (for development)
 * @returns Formatted error response object
 */
export function formatErrorResponse(
  error: Error | AppError,
  includeStack: boolean = false,
): Record<string, unknown> {
  const response: Record<string, unknown> = {
    success: false,
    error: error instanceof AppError ? error.code : "INTERNAL_ERROR",
    message: error instanceof AppError && error.isOperational
      ? error.message
      : "Internal server error",
  };

  if (error instanceof ValidationError && error.fields) {
    response.details = error.fields;
  }

  if (includeStack && error.stack) {
    response.stack = error.stack;
  }

  return response;
}
