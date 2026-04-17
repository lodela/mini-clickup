# Client Src Guidelines

## Overview

Client-side source code: React components, hooks, contexts, styles, and utilities.

## Structure

```
client/src/
├── assets/           # Static assets (images, figma designs)
├── components/       # UI components (organized by feature/type)
├── contexts/         # React Context providers
├── hooks/            # Custom React hooks
├── locales/          # i18n translation files
├── services/         # API services + Socket.IO wrapper
├── styles/           # CSS, Tailwind config, design tokens
├── types/            # Shared TypeScript interfaces
└── utils/            # Helper functions, formatters, cn()
```

## Where to Look

| Task              | Location      |
| ----------------- | ------------- |
| UI components     | `components/` |
| Custom hooks      | `hooks/`      |
| Context providers | `contexts/`   |
| API calls         | `services/`   |
| Styling/Tailwind  | `styles/`     |
| Type definitions  | `types/`      |
| Helper functions  | `utils/`      |
| Translations      | `locales/`    |
| Static assets     | `assets/`     |

## Conventions

- Component files: PascalCase (e.g., `Button.tsx`)
- Hook files: camelCase with `use` prefix (e.g., `useAuth.ts`)
- Context files: PascalCase ending with `Context` (e.g., `AuthContext.tsx`)
- Utility files: camelCase (e.g., `formatters.ts`)
- Use `@/` alias for imports (e.g., `@/components/Button`)
- Tailwind config uses design tokens from Prisma Kirest derivative

## Anti-Patterns

- Deep relative paths: Avoid `../../../components/Button`
- Large components: Split if >200 lines
- Barrel exports: Use sparingly only for related items
- Missing Atomic Design: `atoms/`, `molecules/`, `organisms/`, `templates/` not implemented
- Duplicate layout: `layout/` and `layouts/` both exist (should consolidate)
- Non-standard folders: `teams/` and `modals/` in components/ (consider Atomic Design or feature-based)

## Notes

- `components/layout/` (1 file) and `components/layouts/` (3 files) should be merged
- Types defined in hooks (e.g., `useTeams.ts`) should move to `types/index.ts`
- Consider implementing Atomic Design structure or document current pattern
