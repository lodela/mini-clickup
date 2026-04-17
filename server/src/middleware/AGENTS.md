# Middleware Guidelines

## Overview

Custom middleware for authentication, error handling, validation, and request processing.

## Structure

```
server/src/middleware/
├── auth.ts           # JWT authentication middleware
├── errorHandler.ts   # Async error handler and formatter
└── validation.ts     # Validation schemas and middleware
```

## Where to Look

| Task                 | Location                       |
| -------------------- | ------------------------------ |
| JWT verification     | `auth.ts`                      |
| Async error handling | `errorHandler.ts`              |
| Request validation   | `validation.ts`                |
| Custom middleware    | Any .ts file in this directory |

## Conventions

- File naming: Descriptive camelCase (e.g., `auth.ts`, `errorHandler.ts`)
- Export: Named export of middleware function(s) (e.g., `export const authenticate = (req, res, next) => { ... }`)
- Async wrapper: `errorHandler.ts` provides async handler wrapper to avoid try/catch in controllers
- Validation: Use Zod or Joi schemas for request validation
- Authentication: Verify JWT from HttpOnly cookies, attach user to request
- Error formatting: Standardize error responses with status codes and messages
- Order: Security middleware first (helmet, cors), then body parsing, then custom middleware
- Import pattern: Use `@/` alias for internal imports (e.g., `@/types` for TypeScript interfaces)

## Anti-Patterns

- Logic in middleware: Keep middleware focused on single responsibility
- Blocking operations: Avoid synchronous operations that block the event loop
- Missing next(): Always call `next()` in middleware unless sending response
- Error swallowing: Don't catch errors without logging or passing to error handler
- Tight coupling: Middleware should not depend on specific controllers
- Manual status codes: Use http-status-codes or similar library for clarity
- Inconsistent error format: Stick to one error response format across all middleware

## Notes

- `auth.ts`: Verifies JWT from cookies, attaches `req.user`, handles token refresh
- `errorHandler.ts`: Catches async errors, formats response, logs in development
- `validation.ts`: Contains validation schemas for request bodies, params, query
- Consider using `express-async-errors` or similar to eliminate try/catch in controllers
- Validation middleware should come after body parsing middleware (express.json())
