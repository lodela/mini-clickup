# Hooks Guidelines

## Overview

Custom React hooks encapsulating reusable logic (data fetching, subscriptions, etc.).

## Structure

```
client/src/hooks/
├── useAuth.ts     # Authentication logic (login, logout, user state)
├── useChat.ts     # Socket.IO chat operations (send message, load history)
├── useTeams.ts    # Team management (fetch teams, create team, add member)
├── useTasks.ts    # Task operations (CRUD, filtering, sorting)
├── useTeam.ts     # Current team details and membership
```

## Where to Look

| Task               | Location      |
| ------------------ | ------------- |
| Auth operations    | `useAuth.ts`  |
| Chat functionality | `useChat.ts`  |
| Team management    | `useTeams.ts` |
| Task operations    | `useTasks.ts` |
| Current team data  | `useTeam.ts`  |

## Conventions

- File naming: camelCase with `use` prefix (e.g., `useAuth.ts`)
- Export: Named export of the hook function (e.g., `export function useAuth() { ... }`)
- Return object: Typically returns `{ data, loading, error, mutateFunctions }`
- Async logic: Use try/catch for promises, set loading states
- Dependencies: Empty dependency array for fetch-once hooks, proper deps for subscriptions
- Stale data: Use `useEffect` cleanup for subscriptions (Socket.IO, intervals)
- Import pattern: Prefer `@/` alias for internal imports (e.g., `@/services/api`)
- Type definitions: Define local types if hook-specific, otherwise use `@/types`

## Anti-Patterns

- Import inconsistency: Mix of relative (`../services/api`) and alias (`@/services/api`) imports
- Local type definitions: Defining reusable types in hook instead of `types/index.ts` (e.g., `useTeams.ts`)
- Missing cleanup: Socket.io subscriptions, event listeners, timeouts not cleaned up
- Stale closures: Not using useCallback for functions passed as dependencies
- Waterfall requests: Sequential dependent fetches that could be parallelized
- Direct state mutation: Mutating state objects directly instead of using setState

## Notes

- `useTeams.ts` defines `Team`, `TeamMember`, `User`, `CreateTeamDTO`, etc. locally - these should move to `types/index.ts`
- Standardize imports: All internal imports should use `@/` alias
- Consider creating `useApi.ts` or similar for generic API request handling
- Socket.IO hooks should handle connection status and reconnection logic
