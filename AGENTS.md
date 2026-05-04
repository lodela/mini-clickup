# =============================================================================
# AGENT MAIN PROMPT — MINI CLICKUP
# =============================================================================
# This is a MACHINE-FIRST document. It encodes ALL conventions, architecture,
# patterns, and domain rules for sub-agents. Read this BEFORE any task.
# Human readability is secondary — precision and completeness are mandatory.
# =============================================================================

## 1. PROJECT IDENTITY
- **Name**: Mini ClickUp
- **Stack**: MERN (MongoDB + Express + React 19 + Node.js) + Socket.IO
- **Styling**: Tailwind CSS v4 + glassmorphism design system
- **Auth**: JWT with HttpOnly cookies (accessToken + refreshToken)
- **Language**: TypeScript (strict mode throughout)
- **Package Manager**: npm
- **Node**: >=24.10.0 | **npm**: >=11.6.1

## 2. ARCHITECTURE — MANDATORY CONSTRAINTS

### 2.1 HTTP Layer: FETCH PURO (NO AXIOS)
- **NEVER import axios.** All HTTP calls use `client/src/services/api.ts`.
- `api.ts` centralizes: `credentials: 'include'`, timeout handling, 401 redirects.
- Pattern: `import { api } from '@/services/api'; api.get<T>(url); api.post<T>(url, body);`
- Error handling: catch `ApiRequestError` and use `err.data?.message`.
- Every service file MUST go through api.ts, never `fetch()` directly.

### 2.2 State Management: CONTEXT API 100%
- NO Redux, NO Zustand, NO external state libraries.
- Three context layers (see section 4 for details):
  1. **AuthProvider** — session, wraps entire app
  2. **AppCatalogProvider** — global catalogs, loads post-auth
  3. **AdminProvider** — scoped to /admin/*, lazy load via AdminLayout

### 2.3 Component Architecture: ATOMIC DESIGN
- atoms -> molecules -> organisms -> templates -> pages
- Components in `client/src/components/ui/atoms/`, `molecules/`, `organisms/`, `templates/`
- Pages in `client/src/components/pages/`
- Layouts in `client/src/components/layouts/` (not `layout/`)

### 2.4 Backend Pattern: CONTROLLER -> SERVICE -> MODEL
- Controllers: request parsing, response formatting, NO business logic
- Services: business logic, NO HTTP concerns (no req/res)
- Models: Mongoose schemas with instance/static methods, NO business logic
- Routes: middleware stack (authenticate -> validate -> authorize -> controller)
- Server ESM requirement: all imports use `.js` extension (`../services/foo.js`)

### 2.5 Design Pattern Constraints
- **SOLID**: Single Responsibility at file level. One concern per file.
- **DRY**: Extract shared logic into services/utils. NO duplication.
- **KISS**: Simple over clever. Favor flat structures over deep nesting.
- **YAGNI**: Don't build for unconfirmed future needs.
- **MVC**: Model (Mongoose) -> View (React components) -> Controller (handlers)
- **Observable**: Socket.IO events for cross-user state sync.

## 3. DIRECTORY STRUCTURE (ABRIDGED)

```
/ (root)
+-- client/src/
|   +-- components/
|   |   +-- layouts/       # AdminLayout, ProtectedLayout wrappers
|   |   +-- modals/        # CreateProjectModal, EditProjectModal, etc.
|   |   +-- pages/         # AdminCompaniesPage, TasksPage, etc.
|   |   +-- teams/         # TeamCard, TeamList, InviteMemberModal
|   |   +-- ui/
|   |       +-- atoms/     # Button, Input, Logo, UserAvatar
|   |       +-- molecules/ # NavMenuItem, UserMenuDropdown, SupportCard
|   |       +-- organisms/ # SidebarOrganism, HeaderOrganism
|   |       +-- templates/ # ProtectedLayoutTemplate
|   +-- contexts/          # AuthContext, AppCatalogContext, AdminContext, SocketContext, TeamContext, TaskContext
|   +-- hooks/             # useAuth, useAdmin, useAppCatalog, useTeams, useTasks, useProjects
|   +-- services/          # api.ts, authService, catalogService, teamService, taskService, projectService
|   +-- types/             # index.ts (User, Team, Project, Task, DTOs)
|   +-- locales/           # index.ts (en + es)
|   +-- styles/            # globals.css, glassmorphism.css
|   +-- utils/             # colors.ts (PROJECT_COLORS, DEFAULT_PROJECT_COLOR), formatters, cn()
+-- server/src/
|   +-- controllers/       # authController, catalogController, teamController, taskController, projectController, epicController, storyController
|   +-- models/            # User, Team, Project, Task, Catalog, Epic, Story, Sprint, etc.
|   +-- routes/            # auth, teams, tasks, projects, catalogs, epics, stories
|   +-- services/          # authService, catalogService, teamService, taskService, projectService, epicService, storyService
|   +-- middleware/        # authenticate, authorize, validate, errorHandler
|   +-- types/             # DTOs, interfaces
|   +-- utils/             # errors.ts (AppError, NotFoundError, etc.)
|   +-- scripts/           # seed.ts, seedCatalogs.ts
+-- Documentacion/         # Canonical docs (see index: 00_Indice_General.md)
```

## 4. PROVIDER TREE (CRITICAL -- MOUNT ORDER MATTERS)

```
<StrictMode>
  <AuthProvider>              <- SSoT: user session (mounts first)
    <AppCatalogProvider>      <- SSoT: global catalogs (loads post-auth, never unmounts)
      <SocketProvider>        <- SSoT: realtime connection (opens after auth)
        <RouterProvider>
          // GuestLayout routes: /login, /register, /forgot-password, /reset-password
          // ProtectedLayout routes: /dashboard, /projects, /teams, /tasks, /backlog, etc.
          // AdminLayout (/admin/*): wraps AdminProvider scoped to admin section
          //   <AdminProvider>   <- lazy, scoped, unmounts when leaving /admin/*
          //     <Outlet />
```

## 5. ROUTING STRUCTURE

- **GuestLayout** (`/login`, `/register`, `/forgot-password`, `/reset-password`)
  - No auth required. Redirects to /dashboard if already authenticated.
- **ProtectedLayout** (`/dashboard`, `/projects/*`, `/teams/*`, `/tasks`, `/backlog`, `/calendar`, `/chat`, `/settings`, etc.)
  - Auth required. Redirects to /login if not authenticated.
- **AdminLayout** (`/admin/*`)
  - Wraps **AdminProvider** (scoped context -- loads companies, departments, teams, users)
  - Access: role must be `GOD_MODE` (check both ProtectedLayout and route middleware)

## 6. USER ROLES HIERARCHY

```
GOD_MODE    -> Full system access, admin panel
DIRECTOR    -> Company-level management
EXECUTIVE   -> Cross-team visibility
MANAGER     -> Team-level management
CLIENT_A    -> Full project access
CLIENT_B    -> Limited project access (view + comments)
CLIENT_C    -> Task-level only (see section 7)
USER_A      -> Full contributor
USER_B      -> Standard contributor
USER_C      -> Task-only contributor (see section 7)
```

### 6.1 USER_C / CLIENT_C -- Task-Only User Constraints
- Can ONLY see: backlog, tasks assigned to them, team tasks (read-only), project tasks (read-only)
- Can NOT: edit projects, edit epics/stories, prioritize, manage users
- **Max 5 tasks per day**: can select from backlog into their personal "Today" column
- **One task at a time in "Doing"**: dragging a new task to Doing pauses the current task (orange, "PAUSA" header, timer stops)
- **Timer starts** when a task enters Doing (green header, cronometro running)
- Dropping a task from Doing back to Today: resets to pending state

## 7. TWO-CONTEXT STATE ARCHITECTURE

### 7.1 AppCatalogContext (Global -- mounts at app init)
- **Scope**: entire app, never unmounts
- **Loads**: once after auth, `GET /api/catalogs`
- **Data**: `Record<CatalogType, CatalogItem[]>`
  - Types: `project_status`, `task_priority`, `task_status`, `task_type`
- **Consumers**: `CreateProjectModal`, `EditProjectModal`, `TaskDetailDialog`, `InviteMemberModal`
- **Hook**: `useAppCatalog()` -> `{ catalogs, byType(type), getKey(type, key), loading, error }`

### 7.1 AdminContext (Scoped -- wraps /admin/* routes)
- **Scope**: only visible routes under `/admin/*`
- **Loads**: when user navigates to admin section (lazy via AdminLayout)
- **Data**: `companies[]`, `departments[]`, `teams[]`, `users[]`
- **Consumers**: `AdminCompaniesPage`, `AdminDepartmentsPage`, `AdminTeamsPage`, `AdminCatalogsPage`
- **Hook**: `useAdmin()` -> `{ companies, departments, teams, fetchCompanies(params), createCompany, ... }`

## 8. GLASSMORPHISM DESIGN SYSTEM -- 100% MANDATORY

ALL UI components MUST use the glassmorphism design. Reference: https://i.pinimg.com/736x/64/a5/40/64a540dbf2cda82588438ae9eb478ce5.jpg

### CSS Variables (in `client/src/styles/glassmorphism.css` and `index.css`)
```css
--glass-bg: rgba(255, 255, 255, 0.12);
--glass-border: rgba(255, 255, 255, 0.2);
--glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
--glass-blur: blur(12px);
--glass-dark-bg: rgba(15, 23, 42, 0.6);
--glass-input-bg: rgba(255, 255, 255, 0.08);
--glass-hover-bg: rgba(255, 255, 255, 0.18);
```

### Utility Classes
- `.glass` -- base glass effect (bg + blur + border + shadow)
- `.glass-card` -- card variant with padding + rounded corners
- `.glass-input` -- input variant (darker bg, focus glow)
- `.glass-button` -- button variant (hover lift, active press)
- `.glass-sidebar` -- sidebar variant (full height, dark glass)
- `.glass-modal` -- modal variant (centered, elevated shadow)

### GlassCard Component
- `client/src/components/ui/glass-card.tsx`
- Variants: `default` | `interactive` (hover lift) | `dark` (dark overlay)
- Props: `variant`, `className`, `children`, `onClick`

## 9. CODE STYLE -- MANDATORY RULES

### Formatting (Prettier)
- tabs (not spaces), semicolons, single quotes, 100 char line width
- Tailwind CSS plugin for class sorting

### Imports -- STRICT ORDER
1. React / React DOM
2. Third-party libraries (react-router, framer-motion, dnd-kit, etc.)
3. `@/` alias imports (components, hooks, contexts, services, utils, types, locales)
4. Relative imports (../, ./)

### Naming
- Components: PascalCase
- Functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Files/directories: kebab-case
- Interfaces: PascalCase (I prefix optional)
- Enums: PascalCase
- Hooks: `use` prefix + camelCase
- CSS classes: kebab-case (Tailwind convention)

### TypeScript (strict mode)
- interfaces over `type` aliases for object shapes
- explicit return types on functions
- `unknown` over `any` -- never use `any` except temporarily with // TODO comment
- DTOs: `Create*DTO`, `Update*DTO`, `*Response` naming

## 10. DOMAIN RELATIONSHIPS

```
Company (empresa)
  +-- Team (equipo de trabajo, belongs to a department/company)
        +-- Member (usuario con rol dentro del team)
        +-- Project (proyecto, belongs to team, has projectNumber)
              +-- Epic (epica, belongs to project)
              |     +-- Story (historia, belongs to epic)
              +-- Task (tarea, belongs to project + team, has taskNumber)
                    +-- Status: backlog -> today -> doing -> review -> done
                    +-- Priority: low, medium, high, critical
                    +-- Type: task, bug, improvement
```

### Catalog System (SSoT for dropdowns/lists)
- Backed by `server/src/models/Catalog.ts` -- Mongoose model with `type`, `key`, `label/labelEn`
- `GET /api/catalogs` returns `Record<CatalogType, CatalogItem[]>`
- Types: `project_status`, `task_priority`, `task_status`, `task_type`
- Seeded via `server/src/scripts/seedCatalogs.ts`

## 11. COMMAND CHEAT SHEET

```bash
# Root
npm run dev          # Start both client + server
npm run build        # Production build
npm run lint         # Lint everything
npm run format       # Prettier format

# Client
npm --prefix client run dev          # Vite dev server
npm --prefix client run test:run     # Vitest
npm --prefix client run test:e2e     # Playwright

# Server
npm --prefix server run dev          # TSX dev server
npm --prefix server run test:run     # Vitest
npm --prefix server run typecheck    # tsc --noEmit
```

## 12. MODULE-SPECIFIC AGENTS.md (READ BEFORE MODIFYING)

Each module directory has its own AGENTS.md with detailed conventions.
**YOU MUST READ THE RELEVANT ONE BEFORE MODIFYING ANY FILE:**

| Directory | Read This |
|-----------|-----------|
| `server/src/controllers/` | `server/src/controllers/AGENTS.md` |
| `server/src/models/` | `server/src/models/AGENTS.md` |
| `server/src/services/` | `server/src/services/AGENTS.md` |
| `server/src/routes/` | `server/src/routes/AGENTS.md` |
| `server/src/middleware/` | `server/src/middleware/AGENTS.md` |
| `server/src/sockets/` | `server/src/sockets/AGENTS.md` |
| `server/src/types/` | `server/src/types/AGENTS.md` |
| `server/src/utils/` | `server/src/utils/AGENTS.md` |
| `server/src/scripts/` | `server/src/scripts/AGENTS.md` |
| `client/src/components/` | `client/src/components/AGENTS.md` |
| `client/src/contexts/` | `client/src/contexts/AGENTS.md` |
| `client/src/hooks/` | `client/src/hooks/AGENTS.md` |
| `client/src/services/` | `client/src/services/AGENTS.md` |
| `client/src/styles/` | `client/src/styles/AGENTS.md` |
| `client/src/types/` | `client/src/types/AGENTS.md` |
| `client/src/locales/` | `client/src/locales/AGENTS.md` |

## 13. DOCUMENTATION RULES

- `Documentacion/00_Indice_General.md` is the canonical index -- update when adding/removing docs
- Per-module AGENTS.md files live alongside the code they document
- Archive historical/sprint reports to `Documentacion/archive/`
- Do NOT create new .md files at repo root unless they are project-essential (README, CONTRIBUTING, SECURITY, INSTALLATION)
- Session artifacts (day reports, temp diagnostics) -> archive or delete

## 14. ERROR HANDLING PATTERNS

### Client
```typescript
// Correct: using api.ts with typed errors
import { api, ApiRequestError } from '@/services/api';

try {
  const { data } = await api.get<ResponseType>('/api/endpoint');
  return data;
} catch (err) {
  if (err instanceof ApiRequestError) {
    setError(err.data?.message || 'Error desconocido');
  }
}
```

### Server
```typescript
// Services throw typed errors
import { NotFoundError, BadRequestError } from '@/utils/errors.js';
throw new NotFoundError('Team not found');
```

## 15. TESTING - VITEST + PLAYWRIGHT

- Unit tests: Vitest for services, utils, hooks
- Component tests: React Testing Library via Vitest
- E2E tests: Playwright (Chromium)
- Test files: `{name}.test.ts` or `{name}.spec.ts`
- Mock api.ts and Socket.IO in component tests
- Group tests with `describe`, setup with `beforeEach`
- Server tests: use mongodb-memory-server for integration tests

## 16. i18n -- LOCALE SYSTEM

- All strings in `client/src/locales/index.ts`
- Two languages: `en` (default) and `es`
- Dot-notation keys, flat structure
- Example: `companies.createSuccess`, `teams.inviteMember`
- Use `useTranslation()` hook in components, NOT raw strings
- New feature = new key in both en and es

## 17. GIT CONVENTION

- Format: `<type>(<scope>): <subject>`
- Types: feat, fix, docs, style, refactor, perf, test, chore, revert
- Branching: `feature/`, `bugfix/`, `hotfix/`, `release/`
- Squash merge feature branches into main
- Always include `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`

## 18. KNOWN TECH DEBT & ISSUES

- `layout/` vs `layouts/` -- duplicate directories in client/src/components; `layouts/` is correct
- Types defined locally in hooks instead of `client/src/types/` -- migrate gradually
- Auth guard for admin: currently hardcoded email check in ProtectedLayout -- needs centralization
- No logger.ts or helpers.ts in server/src/utils/ (listed as TODO in AGENTS.md)
- Epic/Story CRUD frontend not yet built (backend complete)
- Kanban board exists but drag-and-drop persistence not fully wired
