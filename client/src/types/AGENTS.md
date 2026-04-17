# Types Guidelines

## Overview

Centralized TypeScript interfaces and types for application-wide use.

## Structure

```
client/src/types/
└── index.ts          # All shared interfaces and types
```

## Where to Look

| Task               | Location                                                           |
| ------------------ | ------------------------------------------------------------------ |
| User types         | `index.ts` (User, TeamMember)                                      |
| Team types         | `index.ts` (Team, CreateTeamDTO, etc.)                             |
| Project types      | `index.ts` (Project, ProjectStatus)                                |
| Task types         | `index.ts` (Task, TaskStatus, TaskPriority)                        |
| Chat types         | `index.ts` (ChatMessage, Attachment)                               |
| Notification types | `index.ts` (Notification, NotificationType)                        |
| Time off types     | `index.ts` (TimeOffRequest, TimeOffStatus, TimeOffType)            |
| Dashboard types    | `index.ts` (DashboardStats)                                        |
| API types          | `index.ts` (PaginationParams, PaginatedResponse, ApiErrorResponse) |
| DTOs               | `index.ts` (CreateTeamDTO, UpdateTeamDTO, AddMemberDTO)            |

## Conventions

- File naming: `index.ts` as barrel export for all types
- Interface naming: PascalCase (e.g., `User`, `Team`)
- Type aliases: PascalCase for union/types (e.g., `TaskStatus`, `ProjectStatus`)
- DTO suffix: Data Transfer Objects end with `DTO` (e.g., `CreateTeamDTO`)
- Optional properties: Marked with `?` (e.g., `avatar?: string`)
- Union types: Use `string | Type` for references to avoid circular deps
- Arrays: Use `Type[]` syntax (not `Array<Type>`)
- Documentation: JSDoc comments for all exported types
- Organization: Group related types together with section headers

## Anti-Patterns

- Local type definitions: Defining reusable types in hooks/services instead of here (e.g., `useTeams.ts` defining Team, User, etc.)
- Missing exports: Forgetting to export types that need to be used elsewhere
- Inconsistent naming: Mixing interfaces and type aliases without reason
- Circular dependencies: Avoid by using `string | Type` for references when needed
- Any types: Avoid `any` - use specific types or `unknown` with type guards
- Duplication: Don't redefine types that already exist in this file
- Deep nesting: Keep type structures flat when possible

## Notes

- Currently contains comprehensive types for User, Team, Project, Task, Chat, Notifications, Time Off, Dashboard, API, and DTOs
- Some hooks (e.g., `useTeams.ts`) redefine types locally - these should be removed and use types from here
- Consider splitting into multiple files if index.ts becomes too large (>500 lines)
- All types are application-wide and safe to import from any client module
