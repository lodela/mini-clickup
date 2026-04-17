# Components Guidelines

## Overview

UI components organized by feature and type (layout, modals, pages, teams, UI primitives).

## Structure

```
client/src/components/
├── layout/           # Single layout component (HeaderNotifications)
├── layouts/          # Page layouts (Guest, Protected, PageLoader)
├── modals/           # Modal components
├── pages/            # Page components (Login, Register, Dashboard, etc.)
├── teams/            # Team-related components
└── ui/               # Primitive UI components (Button, Input, Card, etc.)
```

## Where to Look

| Task                   | Location                                |
| ---------------------- | --------------------------------------- |
| Page components        | `pages/`                                |
| Layout wrappers        | `layouts/`                              |
| Modal dialogs          | `modals/`                               |
| Team UI                | `teams/`                                |
| Reusable UI primitives | `ui/`                                   |
| Layout utilities       | `layout/` (consider moving to layouts/) |

## Conventions

- Component files: PascalCase (e.g., `Button.tsx`)
- Atomic Design: **NOT IMPLEMENTED** - missing `atoms/`, `molecules/`, `organisms/`, `templates/`
- Use `@/components/ui` alias for UI primitives
- Team components: Feature-based grouping in `teams/`
- Page components: Often suffixed with `Page` (e.g., `LoginPage.tsx`)

## Anti-Patterns

- Missing Atomic Design: No `atoms/`, `molecules/`, `organisms/`, `templates/` directories
- Duplicate layout: `layout/` (1 file) and `layouts/` (3 files) - should be consolidated
- Non-standard folders: `teams/` and `modals/` (consider Atomic Design or document as feature-based)
- Inconsistent organization: Mix of feature-based (`teams/`) and type-based (`ui/`) grouping

## Notes

- Consolidate `layout/` and `layouts/` into single `layouts/` directory
- Consider implementing Atomic Design structure or document current hybrid approach
- `teams/` and `modals/` could be reorganized under Atomic Design or kept as feature folders
- UI primitives in `ui/` should follow Atomic Design principles (atoms/molecules)
