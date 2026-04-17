# Mini ClickUp Agent Guidelines

**Status**: MVP Development (Sprint 1 in progress)
**Last Updated**: 2026-03-19

## Overview

Mini Clickup is a MERN Stack + Socket.IO project management application featuring:

- React 19 + Vite frontend with TypeScript
- Node.js + Express backend with TypeScript
- MongoDB database with Mongoose ODM
- Socket.IO for real-time communication
- Tailwind CSS for styling
- JWT authentication with HttpOnly cookies

## Structure

```
mini-clickup/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI components (layout, teams, modals, ui, pages)
│   │   ├── contexts/       # React Context (Auth, Team, Task, Socket)
│   │   ├── hooks/          # Custom hooks (useTasks, useTeam, useChat)
│   │   ├── services/       # API calls + Socket.IO
│   │   ├── utils/          # Helpers, formatters, cn()
│   │   ├── types/          # TypeScript interfaces
│   │   ├── locales/        # i18n (en, es)
│   │   ├── styles/         # Tailwind + Design Tokens
│   │   ├── App.tsx         # Root component
│   │   ├── main.tsx        # Entry point
│   │   ├── index.css       # Global styles
│   │   └── router.tsx      # React Router v7 configuration
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── package.json
│
├── server/                 # Express Backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript interfaces
│   │   ├── scripts/        # DB seeding, utilities
│   │   └── index.ts        # Server entry point
│   ├── tests/
│   └── package.json
│
├── Documentacion/          # Technical Documentation
│   ├── 00_Indice_General.md
│   ├── 01_Arquitectura_y_Stack.md
│   ├── 02_Metodologias_y_Convenciones.md
│   ├── 03_Componentes_Core.md
│   ├── 04_Servicios_y_Red.md
│   ├── 05_Utilidades_y_Hooks.md
│   ├── 06_Testing_y_QA.md
│   ├── 07_Build_Despliegue.md
│   ├── 08_Internacionalizacion_i18n.md
│   ├── 09_Estado_Global_y_Contextos.md
│   └── 10_Roadmap_y_Deuda_Tecnica.md
│
├── .github/                # GitHub configuration
│   ├── workflows/          # CI/CD pipelines
│   └── ISSUE_TEMPLATE/     # Issue templates
│
├── .husky/                 # Git hooks
├── .vscode/                # VS Code settings
├── design-tokens/          # Design token definitions
├── docs/                   # Additional documentation
├── AGENTS.md               # This file
├── .env                    # Environment variables
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## Development Commands

```bash
# Root level
npm run dev                 # Start both client and server
npm run dev:client          # Start only client
npm run dev:server          # Start only server
npm run build               # Build for production
npm run start               # Start production server
npm run test                # Run all tests
npm run lint                # Run linter
npm run format              # Format code with Prettier

# Client-specific
npm run dev --prefix client           # Vite dev server
npm run test:run --prefix client      # Vitest run
npm run test:coverage --prefix client # Vitest with coverage
npm run test:e2e --prefix client      # Playwright E2E tests
npm run lint --prefix client          # Lint client code
npm run lint:fix --prefix client      # Fix lint errors

# Server-specific
npm run dev --prefix server           # TSX watcher
npm run build --prefix server         # Build TS to JS
npm run start --prefix server         # Start built server
npm run test:run --prefix server      # Vitest run
npm run test:coverage --prefix server # Vitest with coverage
npm run lint --prefix server          # Lint server code
npm run lint:fix --prefix server      # Fix lint errors
npm run typecheck --prefix server     # Type checking without emission
```

## Code Style Guidelines

- **Formatting**: Prettier with Tailwind plugin, 100 char line length, tabs, semicolons, single quotes
- **Imports**:
  - Order: React → 3rd-party → `@/` alias → relative
  - Client `@/` alias: `@/components`, `@/hooks`, `@/contexts`, `@/services`, `@/utils`, `@/assets`
  - Server `@/` alias: `@/controllers`, `@/services`, `@/models`, `@/middleware`, `@/types`, `@/utils`
- **TypeScript**: Strict mode, interfaces over types, explicit return types, `unknown` over `any`
- **React**: Functional components with hooks, arrow function handlers, Fragment for multiple elements, early return pattern
- **Styling**: Utility-first Tailwind, `@apply` sparingly, design system colors/spacing, mobile-first prefixes
- **Naming**:
  - Components: PascalCase
  - Functions/vars: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Files/dirs: kebab-case
  - Interfaces: PascalCase (optional I prefix)
  - Enums: PascalCase
  - Hooks: `use` prefix + camelCase

## File Organization

- Group related components in feature-based directories
- Keep components small (<200 lines when possible)
- Separate concerns: components, hooks, utils, services, types
- Use barrel exports (`index.ts`) sparingly and only for related items

## Error Handling

- Use try/catch for async operations
- Throw typed errors using custom Error classes
- React components: use error boundaries for UI errors
- Log errors in dev, use proper logging service in prod
- Never empty catch blocks; at minimum log the error
- Handle both network and API error responses for requests

## Database Guidelines (MongoDB/Mongoose)

- Mongoose schemas for all models
- Implement instance/static methods on schemas
- Validate data at schema level
- Use transactions for multi-document operations when needed
- Index frequently queried fields
- Use lean() for read-only queries when possible
- Handle casting and validation errors appropriately

## Socket.IO Guidelines

- Emit events with kebab-case naming
- Use namespaces for major feature separation if needed
- Join/leave rooms appropriately for scoped broadcasts
- Handle disconnections/reconnections gracefully
- Validate all incoming data from clients
- Use acknowledgments (callbacks) for critical operations

## Testing Guidelines

- Unit tests for utilities, hooks, services
- React Testing Library for component testing
- Mock external dependencies (API, Socket.IO) in tests
- Test positive and negative cases
- Aim for >80% coverage on critical paths
- Vitest for client/server testing
- Playwright for end-to-end testing
- Test files: `{name}.test.ts` or `{name}.spec.ts`
- Group tests with `describe` blocks
- Use `beforeEach`/`afterEach` for setup/teardown

## Git Guidelines

- **Commits**: Conventional Commits format

  ```
  <type>(<scope>): <subject>

  <body>

  <footer>
  ```

  Types: feat, fix, docs, style, refactor, perf, test, chore, revert

- **Branching**: `feature/`, `bugfix/`, `hotfix/`, `release/`
- Atomic, focused commits with descriptive messages
- PRs should reference related issues
- Squash merge feature branches into main

## Performance Considerations

- React.memo() for components with stable props
- Virtualization for long lists (@tanstack/react-virtual)
- Debounce expensive operations (search, resize listeners)
- Lazy-load routes and heavy components
- Optimize image sizes, use next-gen formats
- Browser caching and CDN for assets
- Monitor bundle size with source-map-explorer
- useCallback/useMemo judiciously (not prematurely)

## Security Guidelines

- Never store tokens in localStorage/sessionStorage
- HttpOnly, Secure cookies for JWT tokens
- Validate/sanitize all user inputs
- Rate limiting on API endpoints
- helmet.js for security headers
- Keep dependencies updated with npm audit
- Proper CORS policies
- Environment variables for secrets (never commit .env)
- Proper error handling to avoid leaking stack traces

## Documentation

- Document complex algorithms and business logic
- JSDoc for public APIs and utility functions
- Update README when adding significant features
- Comment non-obvious code sections
- Keep documentation in sync with code changes

## Troubleshooting Common Issues

1. **"Failed to fetch dynamically imported module"**:
   - Check syntax errors (missing brackets, incorrect JSX)
   - Verify file paths and imports are correct
   - Ensure TypeScript compilation succeeds

2. **Socket.IO authentication errors**:
   - Verify token sent correctly from client
   - Check cookie parsing logic in server middleware
   - Ensure JWT secret matches between client and server

3. **Tailwind classes not applying**:
   - Check class name spelling
   - Verify content paths in tailwind.config.js
   - Look for conflicting CSS rules
   - Ensure class is not in a conditional that's false

4. **TypeScript errors**:
   - Read error messages carefully
   - Check type definitions and imports
   - Use `any` temporarily only for debugging with TODO comment
   - Consult existing similar patterns in codebase
