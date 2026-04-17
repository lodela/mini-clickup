# Services Guidelines

## Overview

Business logic layer handling data operations, validation, and external service integration.

## Structure

```
server/src/services/
├── authService.ts    # Authentication logic (login, register, password handling)
├── teamService.ts    # Team CRUD, membership, and project associations
├── taskService.ts    # Task CRUD, filtering, sorting, and history
├── projectService.ts # Project CRUD and board operations
├── sprintService.ts  # Sprint CRUD and task assignment
└── tokenService.ts   # JWT token creation, verification, and refresh
```

## Where to Look

| Task               | Location            |
| ------------------ | ------------------- |
| Auth operations    | `authService.ts`    |
| Team operations    | `teamService.ts`    |
| Task operations    | `taskService.ts`    |
| Project operations | `projectService.ts` |
| Sprint operations  | `sprintService.ts`  |
| Token handling     | `tokenService.ts`   |

## Conventions

- File naming: camelCase ending with `Service` (e.g., `authService.ts`)
- Export: Named export of service class or functions (e.g., `export class TeamService { ... }`)
- Methods: Instance methods for operations, static methods for utility functions
- Database interaction: Use Mongoose models directly (imported from `@/models`)
- Validation: Validate input data before database operations (Zod or custom)
- Error handling: Throw typed errors (e.g., `NotFoundError`, `ValidationError`)
- Transactions: Use Mongoose transactions for multi-document operations when needed
- Logging: Log important operations (optional, can use helper)
- Import pattern: Use `@/` alias for internal imports (e.g., `@/models/User`, `@/utils/errors`)
- DTOs: Accept and return Data Transfer Objects (can be from `@/types` or local)
- Static methods: Use for utility functions that don't need instance state

## Anti-Patterns

- Logic in services: Keep services focused on business logic, avoid formatting responses (that's controller's job)
- Large services: Split if >200 lines (consider grouping by resource or concern)
- Direct HTTP logic: Avoid accessing req/res objects in services
- Missing validation: Always validate data before persisting
- Tight coupling: Services importing other services (consider events or refactor)
- Manual ID generation: Use Mongoose ObjectIds, not custom ID generation unless required
- Ignoring relationships: Properly populate references when needed
- Hardcoded values: Use constants or configuration for magic numbers/strings
- Exposing internal data: Return DTOs, not raw Mongoose documents (unless intentional)

## Notes

- `tokenService.ts` handles JWT creation, verification, and refresh token rotation
- Consider creating base service class for common CRUD patterns (optional)
- Services should be testable in isolation (mock models if needed)
- For complex operations, consider breaking into smaller private methods
- Use Mongoose sessions for transactions when doing multiple related writes
