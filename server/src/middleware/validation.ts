import { Request, Response, NextFunction } from "express";
import { z, ZodSchema, ZodError } from "zod";

/**
 * Validation Error Response Interface
 */
interface ValidationErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: Array<{
    field: string;
    message: string;
    code?: string;
  }>;
}

/**
 * Sanitized Request Interface
 */
interface SanitizedRequest extends Request {
  sanitizedBody?: Record<string, unknown>;
}

/**
 * Format Zod error into readable format
 * @param error - ZodError instance
 * @returns Formatted error details array
 */
function formatZodError(error: ZodError): Array<{
  field: string;
  message: string;
  code?: string;
}> {
  return error.errors.map((err) => {
    const field = err.path.join(".");
    return {
      field: field || "root",
      message: err.message,
      code: err.code,
    };
  });
}

/**
 * Recursively sanitize object values
 * Removes potentially dangerous content and trims strings
 * 
 * @param obj - Object to sanitize
 * @returns Sanitized object
 */
function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    // Skip null/undefined
    if (value === null || value === undefined) {
      sanitized[key] = value;
      continue;
    }

    // Sanitize strings
    if (typeof value === "string") {
      // Remove potential XSS patterns
      sanitized[key] = value
        .trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+\s*=/gi, "");
      continue;
    }

    // Recursively sanitize objects
    if (typeof value === "object" && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
      continue;
    }

    // Sanitize arrays
    if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === "object" && item !== null
          ? sanitizeObject(item as Record<string, unknown>)
          : item,
      );
      continue;
    }

    // Keep other types as-is (numbers, booleans, etc.)
    sanitized[key] = value;
  }

  return sanitized;
}

/**
 * Validation middleware factory
 * Validates request body against Zod schema
 * 
 * @param schema - Zod schema for validation
 * @param options - Optional configuration
 * @param options.location - Where to validate ('body', 'query', 'params')
 * @param options.sanitize - Whether to sanitize input (default: true)
 * @returns Express middleware function
 */
export function validate<T extends ZodSchema>(
  schema: T,
  options: {
    location?: "body" | "query" | "params" | "headers";
    sanitize?: boolean;
  } = {},
) {
  const { location = "body", sanitize = true } = options;

  return async (
    req: SanitizedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dataToValidate = req[location];

      // Parse and validate
      const validatedData = await schema.parseAsync(dataToValidate);

      // Sanitize if enabled and location is body
      if (sanitize && location === "body") {
        req.sanitizedBody = sanitizeObject(validatedData as Record<string, unknown>);
      }

      // Replace original data with validated data
      req[location] = validatedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = formatZodError(error);

        const response: ValidationErrorResponse = {
          success: false,
          error: "Validation error",
          message: "Request validation failed",
          details,
        };

        res.status(400).json(response);
        return;
      }

      // Pass other errors to error handler
      next(error);
    }
  };
}

/**
 * Validate query parameters
 * Shortcut for validate(schema, { location: 'query' })
 * 
 * @param schema - Zod schema for query validation
 * @param sanitize - Whether to sanitize input
 */
export function validateQuery<T extends ZodSchema>(
  schema: T,
  sanitize?: boolean,
) {
  return validate(schema, { location: "query", sanitize });
}

/**
 * Validate route parameters
 * Shortcut for validate(schema, { location: 'params' })
 * 
 * @param schema - Zod schema for params validation
 */
export function validateParams<T extends ZodSchema>(schema: T) {
  return validate(schema, { location: "params", sanitize: false });
}

/**
 * Validate headers
 * Shortcut for validate(schema, { location: 'headers' })
 * 
 * @param schema - Zod schema for headers validation
 */
export function validateHeaders<T extends ZodSchema>(schema: T) {
  return validate(schema, { location: "headers", sanitize: false });
}

/**
 * Create a pagination schema
 * Reusable schema for list endpoints
 * 
 * @param options - Pagination options
 * @param options.defaultPage - Default page number (default: 1)
 * @param options.defaultLimit - Default items per page (default: 10)
 * @param options.maxLimit - Maximum items per page (default: 100)
 */
export function createPaginationSchema(options: {
  defaultPage?: number;
  defaultLimit?: number;
  maxLimit?: number;
} = {}) {
  const { defaultPage = 1, defaultLimit = 10, maxLimit = 100 } = options;

  return z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : defaultPage))
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Page must be a positive number",
      }),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : defaultLimit))
      .refine((val) => !isNaN(val) && val > 0 && val <= maxLimit, {
        message: `Limit must be between 1 and ${maxLimit}`,
      }),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
  });
}
