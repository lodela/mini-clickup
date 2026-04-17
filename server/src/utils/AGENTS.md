# Server Utils Guidelines

## Overview

Shared utilities, helpers, and custom error classes for the backend server.

## Structure

```
server/src/utils/
├── errors.ts           # Custom error classes (AppError, NotFoundError, etc.)
├── logger.ts           # Logging utilities (TODO: Implement Winston)
└── helpers.ts          # General helper functions (TODO: Implement)
```

## Where to Look

| Task                      | File           |
| ------------------------- | -------------- |
| Custom error classes      | `errors.ts`    |
| Logging                   | `logger.ts`    |
| Helper functions          | `helpers.ts`   |
| Error type guards         | `errors.ts`    |
| Error response formatting | `errors.ts`    |

## Error Classes Available

```typescript
import {
  AppError,              // Base error class
  NotFoundError,         // 404 Not Found
  BadRequestError,       // 400 Bad Request
  UnauthorizedError,     // 401 Unauthorized
  ForbiddenError,        // 403 Forbidden
  ConflictError,         // 409 Conflict
  ValidationError,       // 400 Validation Error
  DatabaseError,         // 500 Database Error
  isAppError,            // Type guard
  isNotFoundError,       // Type guard
  formatErrorResponse,   // Format for API response
} from "./errors.js";
```

## Usage Examples

### Throw Specific Errors
```typescript
// ✅ PREFERRED - Use specific error classes
throw new NotFoundError("User not found");
throw new BadRequestError("Invalid email format");
throw new UnauthorizedError("Token expired");
throw new ForbiddenError("Insufficient permissions");
throw new ConflictError("Email already registered");
throw new ValidationError("Invalid input", { email: "Required field" });
throw new DatabaseError("Failed to save user", originalError);

// ✅ ALSO OK - Use static factory methods
throw AppError.notFound("User not found");
throw AppError.badRequest("Invalid email format");
throw AppError.unauthorized("Token expired");
throw AppError.forbidden("Insufficient permissions");
throw AppError.conflict("Email already registered");
throw AppError.internal("Something went wrong");
```

### Error Handling in Controllers
```typescript
export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = await userService.findById(id);
    
    if (!user) {
      throw new NotFoundError("User not found");
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    next(error); // Pass to global error handler
  }
}
```

### Type Guards
```typescript
export async function handleOperation(id: string) {
  try {
    await performOperation(id);
  } catch (error) {
    if (isNotFoundError(error)) {
      // Handle not found specifically
      console.log("Resource not found:", error.message);
    } else if (isAppError(error)) {
      // Handle other operational errors
      console.log("Operational error:", error.code, error.message);
    } else {
      // Handle unexpected errors
      console.log("Unexpected error:", error);
    }
    throw error;
  }
}
```

## Conventions

### Error Naming
- Use specific error classes for known scenarios
- Provide meaningful, user-friendly messages
- Include error codes for programmatic handling

### Error Messages
```typescript
// ✅ GOOD - Specific and actionable
throw new NotFoundError("User with ID 'abc123' not found");
throw new BadRequestError("Email must be a valid email address");
throw new ConflictError("A team with this name already exists");

// ❌ BAD - Vague or technical
throw new NotFoundError("Not found");
throw new Error("Error occurred");
throw new Error("Database failed");
```

### Stack Trace
- Stack traces included automatically in development
- Excluded from production responses (handled by errorHandler middleware)
- Use `formatErrorResponse(error, true)` to include stack in development

## Anti-Patterns

```typescript
// ❌ Using generic Error
throw new Error("Something went wrong");

// ✅ Use specific AppError
throw AppError.internal("Failed to process payment");

// ❌ Exposing internal details
throw new DatabaseError("MongoDB connection failed: ECONNREFUSED 127.0.0.1:27017");

// ✅ User-friendly message with internal logging
logger.error("MongoDB connection failed:", error);
throw AppError.serviceUnavailable("Database temporarily unavailable");

// ❌ Silent failures
try {
  await operation();
} catch (error) {
  // Swallowed error
}

// ✅ Always handle or rethrow
try {
  await operation();
} catch (error) {
  logger.error("Operation failed:", error);
  throw AppError.internal("Operation failed");
}
```

## TODO: Implement

- [ ] `logger.ts` - Winston-based structured logging
- [ ] `helpers.ts` - Common utility functions
  - [ ] `sanitizeHtml()` - XSS prevention
  - [ ] `formatDate()` - ISO 8601 formatting
  - [ ] `generateSlug()` - URL-friendly slugs
  - [ ] `paginate()` - Pagination helper
- [ ] `constants.ts` - Application constants
- [ ] `config.ts` - Configuration loader with validation

## Notes

- All error classes extend native `Error` for proper stack traces
- Use `Object.setPrototypeOf()` for proper prototype chain
- Type guards enable precise error handling
- Global error handler middleware catches all errors
- Operational errors (isOperational=true) show messages in production
- Programming errors show generic "Internal server error" in production
