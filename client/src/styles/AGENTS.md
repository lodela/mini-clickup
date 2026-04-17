# Styles Guidelines

## Overview

Styling files: Tailwind CSS configuration, global styles, and design tokens.

## Structure

```
client/src/styles/
├── globals.css     # Global styles, glassmorphism utilities, design tokens
└── index.css       # Entry point (imports Tailwind and globals.css)
```

## Where to Look

| Task             | Location                               |
| ---------------- | -------------------------------------- |
| Global styles    | `globals.css`                          |
| Tailwind setup   | `index.css`                            |
| Design tokens    | `globals.css` (CSS variables)          |
| Glassmorphism    | `globals.css` (.glass, .glass-intense) |
| Custom utilities | `globals.css`                          |

## Conventions

- Uses Tailwind CSS v4 with Prisma Kirest v2.7.0 design tokens
- Design tokens implemented as CSS variables in `:root` (colors, spacing, radius, etc.)
- Glassmorphism utilities: `.glass` and `.glass-intense` classes
- Global styles in `globals.css` (imported via `index.css`)
- Tailwind configuration in `tailwind.config.ts` (not in this folder)
- Use utility-first approach; avoid custom CSS when possible
- Use `@apply` sparingly and only for component-specific styles
- Responsive prefixes: mobile-first (sm:, md:, lg:, xl:, 2xl:)
- Arbitrary values only when necessary: `[--custom-value: 10px]`
- Custom class naming: `[&>svg]:text-[var(--color)]`

## Anti-Patterns

- Custom CSS: Avoid creating custom CSS when Tailwind utilities suffice
- Overusing `@apply`: Can defeat purpose of utility-first approach
- Ignoring design system: Not using existing color, spacing, typography utilities
- Arbitrary values: Use sparingly, prefer design system values
- Missing responsive prefixes: Forgetting mobile-first breakpoints
- Conflicting utilities: Applying opposing classes (e.g., `w-full w-1/2`)

## Notes

- `globals.css` defines CSS variables for design tokens (from Prisma Kirest)
- Glassmorphism: `--glass-bg`, `--glass-border`, `--glass-shadow`, `--blur-md`, `--blur-lg`
- Tailwind config: `tailwind.config.ts` in client/ root (extends design tokens)
- index.css only contains imports; no custom styles
- Consider adding component-specific styles to globals.css if reused frequently
