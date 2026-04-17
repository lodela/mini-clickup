# Contexts Guidelines

## Overview

React Context providers for global state management (auth, team, task, socket).

## Structure

```
client/src/contexts/
├── AuthContext.tsx     # Authentication state (user, login, logout)
├── SocketContext.tsx   # Socket.IO connection and event handlers
├── TeamContext.tsx     # Current team and team membership state
└── TaskContext.tsx     # Task state and operations
```

## Where to Look

| Task                  | Location            |
| --------------------- | ------------------- |
| Auth state/user       | `AuthContext.tsx`   |
| Socket.IO connection  | `SocketContext.tsx` |
| Team data/membership  | `TeamContext.tsx`   |
| Task operations/state | `TaskContext.tsx`   |

## Conventions

- File naming: PascalCase ending with `Context` (e.g., `AuthContext.tsx`)
- Provider component: Same name as file (e.g., `AuthContext` exports provider)
- Hook pattern: `useXxxContext()` custom hooks in respective files (e.g., `useAuth()`)
- Value object: Contains state + setter functions (e.g., `{ user, login, logout }`)
- Default context: Created with `createContext(null)` or default values
- Consumption: Use custom hooks (e.g., `useAuth()`) not `useContext(Context)` directly

## Anti-Patterns

- Direct context use: Avoid `useContext(AuthContext)` - use `useAuth()` hook instead
- Large context values: Split if context object becomes too large
- Missing providers: Wrap app with all necessary providers in main.tsx
- Stale closures: Use useCallback for setter functions when needed
- Over-fetching: Don't put frequently changing data in same context as static data

## Notes

- All contexts wrap children in main.tsx via AuthProvider + SocketProvider
- SocketContext handles connection, events, and emits
- TeamContext manages current team ID and team data
- TaskContext handles task CRUD operations and filtering
