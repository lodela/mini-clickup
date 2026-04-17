# Services Guidelines

## Overview

Service layer for API calls and Socket.IO communication.

## Structure

```
client/src/services/
├── api.ts          # Axios instance with interceptors and base URL
├── authService.ts  # Authentication endpoints (login, register, refresh)
├── teamService.ts  # Team CRUD and membership operations
├── taskService.ts  # Task CRUD, filtering, and sorting
├── projectService.ts # Project CRUD and board operations
└── sprintService.ts # Sprint CRUD and task assignment
```

## Where to Look

| Task               | Location                                      |
| ------------------ | --------------------------------------------- |
| API configuration  | `api.ts`                                      |
| Authentication     | `authService.ts`                              |
| Team operations    | `teamService.ts`                              |
| Task operations    | `taskService.ts`                              |
| Project operations | `projectService.ts`                           |
| Sprint operations  | `sprintService.ts`                            |
| Socket.IO wrapping | Check individual services for emits/listeners |

## Conventions

- File naming: camelCase ending with `Service` (e.g., `authService.ts`)
- Central API: `api.ts` creates axios instance with baseURL, interceptors (auth, error)
- Service functions: Return promises, handle try/catch, throw typed errors
- Method naming: REST-like verbs (fetch, create, update, delete, etc.)
- Parameters: Use DTO-like objects for complex parameters
- Response handling: Typically return data directly or throw on error
- Socket.IO: Some services may include emit/listener helpers (check implementation)
- Import pattern: Use `@/` alias for internal imports (e.g., `@/api` for api.ts)
- Error handling: Services throw errors for non-2xx responses, controllers/hooks catch

## Anti-Patterns

- Business logic in services: Keep services focused on data transfer, not complex logic
- Direct API calls: Avoid using axios/fetch directly in components/hooks - use services
- Inconsistent returns: Some services return raw response, others return data property
- Missing error handling: Not catching network errors or validation errors
- Tight coupling: Services importing other services (consider events or refactor)
- Large files: Split if >200 lines (consider grouping by resource)

## Notes

- `api.ts` includes request/response interceptors for token refresh and error logging
- Auth service handles token storage in memory (HttpOnly cookies handled by backend)
- Team and task services include pagination and filtering helpers
- Consider creating base service class for common CRUD patterns
- Socket.IO integration: Some services may have socket.emit() for optimistic updates
