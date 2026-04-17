# Controllers Guidelines

## Overview

Request handlers for API endpoints, coordinating between services and responses.

## Structure

```
server/src/controllers/
├── authController.ts     # Authentication endpoints (login, register, etc.)
├── teamController.ts     # Team CRUD and membership operations
├── taskController.ts     # Task CRUD, filtering, and sorting
├── projectController.ts  # Project CRUD and board operations
└── sprintController.ts   # Sprint CRUD and task assignment
```

## Where to Look

| Task              | Location               |
| ----------------- | ---------------------- |
| Auth routes       | `authController.ts`    |
| Team endpoints    | `teamController.ts`    |
| Task endpoints    | `taskController.ts`    |
| Project endpoints | `projectController.ts` |
| Sprint endpoints  | `sprintController.ts`  |

## Conventions

- File naming: camelCase ending with `Controller` (e.g., `authController.ts`)
- Export: Named export of handler functions (e.g., `export const login = async (req, res) => { ... }`)
- Async handlers: Use try/catch, call service functions, send appropriate HTTP responses
- Response format: JSON with `{ success: boolean, data?: any, error?: string }`
- Error handling: Catch errors from services, send 4xx/500 with error message
- Validation: Validate request data (body, params, query) before calling services
- Service interaction: Controllers are thin - they call services and format responses
- Parameter access: Use `req.params`, `req.body`, `req.query` as appropriate
- Status codes: Use appropriate HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Import pattern: Use `@/` alias for internal imports (e.g., `@/services/teamService`)

## Anti-Patterns

- Business logic in controllers: Keep controllers thin - delegate to services
- Direct database access: Controllers should not interact with models directly
- Large handlers: Split if handler function is too long (>50 lines)
- Missing validation: Always validate incoming data (use Zod or similar)
- Inconsistent responses: Stick to a standard response format across all controllers
- Swallowing errors: Always send error responses, don't leave client hanging
- Tight coupling: Avoid importing other controllers (use services for communication)
- Manual status codes: Use constants or helper functions for status codes when possible

## Notes

- Controllers should validate input (e.g., using Zod schemas) before calling services
- Services throw errors for invalid operations or not found - controllers catch and format
- Consider creating a base controller class for common patterns (optional)
- File upload controllers may have different patterns (multer handling)
