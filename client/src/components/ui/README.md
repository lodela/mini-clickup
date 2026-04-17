# UI Components - Atomic Design Structure

This directory contains all UI components organized following the **Atomic Design** methodology.

## 📁 Directory Structure

```
ui/
├── atoms/           # Smallest, indivisible UI elements
├── molecules/       # Simple combinations of atoms
├── organisms/       # Complex, reusable UI sections
└── templates/       # Page layout structures
```

## 🧬 Component Hierarchy

### Atoms (`/atoms`)
Smallest building blocks with single responsibility:
- `Logo.tsx` - Company logo component
- `SearchInput.tsx` - Search input field with icon
- `NotificationBell.tsx` - Notification bell with badge
- `UserAvatar.tsx` - User avatar with fallback initials

**Rules:**
- No business logic
- No state (except simple UI state like hover)
- Receives all data via props
- Pure presentational components

### Molecules (`/molecules`)
Combinations of atoms with specific purpose:
- `NavMenuItem.tsx` - Navigation menu item (icon + label + active state)
- `UserMenuDropdown.tsx` - User menu with dropdown (avatar + name + menu)
- `SupportCard.tsx` - Support promotional card with CTA

**Rules:**
- Combines 2-5 atoms
- Can have simple internal UI state (e.g., dropdown open/closed)
- No API calls or business logic
- Receives callbacks via props

### Organisms (`/organisms`)
Complex, reusable sections of the UI:
- `SidebarOrganism.tsx` - Main navigation sidebar
- `HeaderOrganism.tsx` - Application header

**Rules:**
- Composed of molecules and atoms
- Can use UI-only context (theme, i18n)
- NO business logic or data fetching
- All data comes from props

### Templates (`/templates`)
Page structure definitions:
- `ProtectedLayoutTemplate.tsx` - Layout for authenticated users

**Rules:**
- Defines page structure (header, sidebar, main, footer)
- Receives organisms as props
- No business logic
- No specific data

## 🔄 Data Flow

```
Container/Page → Organisms → Molecules → Atoms
     ↓
  (business logic, state, API calls)
```

## 📝 Guidelines

1. **Export named functions**: `export function ComponentName() {}`
2. **Use TypeScript**: Define props interface for every component
3. **i18n**: Use `useTranslation()` for all user-facing text
4. **Icons**: Use `lucide-react` for all icons
5. **Styling**: Tailwind CSS utility-first approach
6. **Accessibility**: Include ARIA labels and semantic HTML

## 🎨 Styling Conventions

- Use theme variables from `/src/styles/theme.css`
- Follow the design system colors (primary: `#3f8cff`)
- Consistent spacing using Tailwind scale
- Shadows: `shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)]`
- Rounded corners: `rounded-[14px]` for cards, `rounded-[24px]` for containers

## 🧪 Testing

Each component should be testable in isolation:
- Mock all props
- Test rendering with different prop combinations
- Test accessibility (ARIA labels, keyboard navigation)

## 📚 Resources

- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)
- [React Component Patterns](https://www.patterns.dev/posts/react-component-patterns)
- [Tailwind CSS Documentation](https://tailwindcss.com)
