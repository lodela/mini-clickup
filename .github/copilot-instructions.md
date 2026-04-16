# Mini ClickUp Copilot Instructions

## Build, lint, and test commands

Use the root scripts to orchestrate both packages:

```bash
npm run dev
npm run build
npm run lint
```

Prefer package-level test commands for one-shot runs:

```bash
# Client
npm --prefix client run test:run
npm --prefix client run test:coverage
npm --prefix client run test:e2e

# Server
npm --prefix server run test:run
npm --prefix server run test:coverage
npm --prefix server run typecheck
```

Run a single test file with the underlying runners:

```bash
# Server Vitest
npm --prefix server exec vitest run tests/team.test.ts
npm --prefix server exec vitest run tests/team.test.ts -t "Team API"

# Client Vitest
npm --prefix client exec vitest run src/path/to/file.test.tsx

# Client Playwright
npm --prefix client exec playwright test e2e/path.spec.ts --project=chromium
```

Do not rely on root `npm run test` for automation: it runs the client once, then delegates to `server`'s `npm test`, which starts Vitest in watch mode.

## High-level architecture

This repo is a two-package app: `client/` is a React 19 + Vite frontend, and `server/` is an Express + Mongoose + Socket.IO backend. Root scripts only coordinate the two packages.

The real frontend entrypoint is `client/src/main.tsx`, not `App.tsx`. `main.tsx` wraps the app in `AuthProvider` and `SocketProvider`, then mounts `RouterProvider` from `client/src/router.tsx`. Routing is split between `GuestLayout` and `ProtectedLayout`, and pages are lazy-loaded from `client/src/components/pages`.

Authentication is cookie-based end to end. The client calls `GET /auth/me` on startup, uses `credentials: 'include'` in the shared API wrapper, and redirects to `/login` on 401s outside guest routes. The backend sets `accessToken` and `refreshToken` as HttpOnly cookies in `authController`, and `SocketProvider` only opens the Socket.IO connection after auth state becomes truthy.

The backend entrypoint is `server/src/index.ts`. It creates Express, wraps it in an HTTP server, attaches Socket.IO, mounts feature routers under `/api/*`, and stores the `io` instance on the Express app so controllers can emit realtime events after mutations. The common backend flow is:

`route -> middleware -> controller -> service -> mongoose model`

That pattern is most consistent in teams/auth/projects. Team routes are a good reference for stacked auth + validation + permission middleware.

The main domain relationships are:

- `Team` owns members and projects.
- `Project` belongs to a team and tracks a generated `projectNumber`.
- `Task` belongs to both a project and a team, tracks a generated `taskNumber`, and has workflow helpers such as QA approval and task-to-bug conversion.

Current implementation depth is uneven: auth and team management are the most complete flows, while projects and tasks are only partially built, and chat/calendar/settings still include stub or mock-driven surfaces.

## Key conventions

- On the client, prefer `@/` imports and the shared `client/src/services/api.ts` wrapper for HTTP calls. It centralizes `credentials: 'include'`, timeout handling, and auth redirects. `useTasks.ts` still uses direct `axios` calls and reads like legacy code, not the preferred pattern.

- On the server, local TypeScript imports use `.js` extensions (`../services/foo.js`) so the emitted ESM build runs correctly from `dist/`. Follow that style when adding new server modules.

- `client/src/App.tsx` is intentionally unused. Start frontend investigations from `main.tsx`, `router.tsx`, the layouts, and the providers instead.

- Team authorization is not just route-level auth. Sensitive team endpoints usually combine `authenticate()`, `validate(...)`, and one of `checkTeamMembership()`, `checkTeamOwnership()`, or `checkTeamAdmin()`.

- Response shapes are not fully uniform across the backend. Auth and team endpoints commonly return `{ success, data, message }`, while task endpoints often return raw documents or simple `{ message }` errors. Check the specific controller before assuming a response contract.

- Locale strings live inline in `client/src/locales/index.ts` for both `en` and `es` rather than being split into many files.

- Package/runtime expectations are slightly inconsistent across repo metadata: `package.json` requires Node `>=24.10.0` and npm `>=11.6.1`, while GitHub Actions currently run on Node 20/22. Prefer the package engine requirements when working locally in this repo.
