# Routes Guidelines

## Overview

Express route definitions that map endpoints to controller functions.

## Structure

```
server/src/routes/
├── auth.ts     # Authentication routes (login, register, refresh)
├── team.ts     # Team routes (CRUD, membership)
├── task.ts     # Task routes (CRUD, filtering, sorting)
├── project.ts  # Project routes (CRUD, board operations)
└── sprint.ts   # Sprint routes (CRUD, task assignment)
```

## Where to Look

| Task              | Location     |
| ----------------- | ------------ |
| Auth endpoints    | `auth.ts`    |
| Team endpoints    | `team.ts`    |
| Task endpoints    | `task.ts`    |
| Project endpoints | `project.ts` |
| Sprint endpoints  | `sprint.ts`  |

## Conventions

- File naming: camelCase (e.g., `auth.ts`)
- Router: Create express Router instance, define routes, export router
- HTTP methods: Use appropriate verbs (get, post, put, delete, patch)
- Path parameters: Use `:id` for resource IDs (e.g., `/teams/:id`)
- Query parameters: Access via `req.query` in controllers
- Body data: Access via `req.body` in controllers (parsed by middleware)
- Middleware: Apply route-specific middleware before controller (e.g., auth)
- Controller connection: Import controller functions and pass as handlers
- Error handling: Routes rely on error-handling middleware (async errors caught by errorHandler)
- Import pattern: Use `@/` alias for internal imports (e.g., `@/controllers/teamController`)
- Prefixing: Routes are mounted with a base path in `index.ts` (e.g., `/api/teams`)

## Anti-Patterns

- Logic in routes: Keep routes focused on routing, delegate to controllers
- Large route files: Split if >200 lines (consider grouping by resource)
- Inconsistent naming: Use REST-like conventions (plural nouns for resources)
- Missing status codes: Use appropriate HTTP status codes in controllers
- Manual error handling: Let async errors bubble up to errorHandler middleware
- Tight coupling: Avoid importing other route files (use controllers for communication)
- Ignoring validation: Rely on controllers or middleware for input validation

## Notes

- Routes are mounted in `server/src/index.ts` with base path `/api`
- Example: `app.use('/api/teams', teamRouter)` in index.ts
- Consider using route versioning if needed (e.g., `/api/v1/teams`)
- File upload routes may require multer middleware (handle in route or controller)
