# Protected Layout - Complete Documentation

## 🎯 Overview

This is a **production-ready Protected Layout** for authenticated users, built following the specifications from `AGENT.protectedLayout.json` and `UX-UI_Figma.md`.

## 📋 What Was Implemented

### ✅ Core Features

1. **Fixed Header + Fixed Sidebar + Flex Main** layout structure
2. **Atomic Design** architecture (atoms → molecules → organisms → templates)
3. **React Router DOM v7** with Data Router pattern
4. **Internationalization** (i18n) with English and Spanish support
5. **Fully accessible** components with ARIA labels
6. **Responsive** and production-ready styling with Tailwind CSS

---

## 📁 File Structure

```
src/
├── i18n/
│   └── config.ts                          # i18n setup (en/es)
│
├── app/
│   ├── components/
│   │   └── ui/
│   │       ├── atoms/                     # Indivisible UI elements
│   │       │   ├── Logo.tsx              # Company logo
│   │       │   ├── SearchInput.tsx       # Search input field
│   │       │   ├── NotificationBell.tsx  # Notification bell with badge
│   │       │   └── UserAvatar.tsx        # User avatar component
│   │       │
│   │       ├── molecules/                 # Simple combinations
│   │       │   ├── NavMenuItem.tsx       # Navigation menu item
│   │       │   ├── UserMenuDropdown.tsx  # User dropdown menu
│   │       │   └── SupportCard.tsx       # Support promotional card
│   │       │
│   │       ├── organisms/                 # Complex UI sections
│   │       │   ├── SidebarOrganism.tsx   # Main navigation sidebar
│   │       │   └── HeaderOrganism.tsx    # Application header
│   │       │
│   │       ├── templates/                 # Layout structures
│   │       │   └── ProtectedLayoutTemplate.tsx
│   │       │
│   │       └── README.md                  # UI components documentation
│   │
│   ├── layouts/
│   │   └── ProtectedLayout.tsx            # Layout container (connects everything)
│   │
│   ├── pages/                             # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── CalendarPage.tsx
│   │   ├── VacationsPage.tsx
│   │   ├── EmployeesPage.tsx
│   │   ├── MessengerPage.tsx
│   │   └── InfoPortalPage.tsx
│   │
│   ├── hooks/
│   │   └── useActiveRoute.ts              # Hook for active route detection
│   │
│   ├── types/
│   │   └── layout.types.ts                # TypeScript types for layout
│   │
│   ├── utils/
│   │   └── cn.ts                          # Class name utility (clsx + tailwind-merge)
│   │
│   ├── routes.tsx                         # React Router configuration
│   └── App.tsx                            # Main app entry (updated)
```

---

## 🏗️ Architecture

### Atomic Design Layers

#### 1. **Atoms** (Smallest building blocks)
- `Logo` - Brand logo with SVG paths
- `SearchInput` - Search field with icon
- `NotificationBell` - Bell icon with badge counter
- `UserAvatar` - Avatar with initials fallback

**Characteristics:**
- No business logic
- Pure presentational
- Receives all data via props

#### 2. **Molecules** (Simple combinations)
- `NavMenuItem` - Icon + Label + Active state
- `UserMenuDropdown` - Avatar + Name + Dropdown menu (Radix UI)
- `SupportCard` - Illustration + CTA button

**Characteristics:**
- Combines 2-5 atoms
- Can have simple UI state (dropdown open/close)
- No API calls

#### 3. **Organisms** (Complex sections)
- `SidebarOrganism` - Full sidebar with nav, logo, support, logout
- `HeaderOrganism` - Full header with search, notifications, user menu

**Characteristics:**
- Composed of molecules + atoms
- Can use UI context (theme, i18n)
- No business logic

#### 4. **Templates** (Page structures)
- `ProtectedLayoutTemplate` - Defines HEADER + SIDEBAR + MAIN structure

**Characteristics:**
- Receives organisms as props
- No specific data
- Pure layout definition

#### 5. **Containers/Pages** (Data layer)
- `ProtectedLayout.tsx` - Connects template with data
- `DashboardPage.tsx`, etc. - Page-specific containers

**Characteristics:**
- Handles state and business logic
- Fetches data (or will when connected to real API)
- Passes data to templates/organisms

---

## 🎨 Design Specifications

### Colors
Based on Figma design:
- **Primary Blue**: `#3f8cff`
- **Background**: `#f5f6fa`
- **Text Primary**: `#0a1629`
- **Text Muted**: `#7d8592`
- **White**: `#ffffff`

### Spacing
- **Header height**: `64px`
- **Sidebar width**: `240px`
- **Padding**: `24px` (main content)
- **Gap**: `4px` base scale

### Shadows
- **Cards**: `shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)]`
- **Support button**: `shadow-[0px_6px_12px_0px_rgba(63,140,255,0.26)]`

### Border Radius
- **Cards**: `rounded-[14px]`
- **Containers**: `rounded-[24px]`
- **Small elements**: `rounded-[10px]`

---

## 🌐 Internationalization (i18n)

### Supported Languages
- **English** (default)
- **Spanish**

### Translation Keys

```typescript
// Navigation
'nav.dashboard'     → "Dashboard" / "Tablero"
'nav.projects'      → "Projects" / "Proyectos"
'nav.calendar'      → "Calendar" / "Calendario"
'nav.vacations'     → "Vacations" / "Vacaciones"
'nav.employees'     → "Employees" / "Empleados"
'nav.messenger'     → "Messenger" / "Mensajería"
'nav.infoPortal'    → "Info Portal" / "Portal de Información"
'nav.logout'        → "Logout" / "Cerrar sesión"
'nav.support'       → "Support" / "Soporte"

// User Menu
'user.profile'      → "Profile" / "Perfil"
'user.settings'     → "Settings" / "Configuración"
'user.teams'        → "Your teams" / "Tus equipos"
'user.signOut'      → "Sign out" / "Cerrar sesión"

// Accessibility
'aria.mainNav'      → "Main navigation" / "Navegación principal"
'aria.globalSearch' → "Global search" / "Búsqueda global"
```

### Change Language

```typescript
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  return (
    <button onClick={() => i18n.changeLanguage('es')}>
      Español
    </button>
  );
}
```

---

## 🧭 Routing Structure

### Routes Configuration

```typescript
/ → Redirects to /dashboard

/dashboard       → DashboardPage
/projects        → ProjectsPage
/calendar        → CalendarPage
/vacations       → VacationsPage
/employees       → EmployeesPage
/messenger       → MessengerPage
/info-portal     → InfoPortalPage

* (404)          → 404 Not Found page
```

### Protected Layout Wrapper

All routes above are wrapped in `<ProtectedLayout />` which provides:
- Persistent sidebar navigation
- Persistent header
- Main content area via `<Outlet />`

---

## ♿ Accessibility Features

### ARIA Labels
- `role="banner"` on header
- `role="navigation"` on sidebar
- `aria-label="Main navigation"` on nav
- `aria-current="page"` on active nav items
- `aria-label="Global search"` on search input
- `aria-label="Notifications (count)"` on notification bell
- `aria-haspopup="menu"` on user dropdown

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus states defined (`:focus-visible`)
- Radix UI components have built-in keyboard support

---

## 🔌 Integration Guide

### Connecting to Real Authentication

Replace mock data in `ProtectedLayout.tsx`:

```typescript
// Current (mock):
const mockUser = {
  name: 'Evan Yates',
  email: 'evan.yates@company.com',
};

// Real implementation:
import { useAuth } from '@/hooks/useAuth';

export function ProtectedLayout() {
  const { user, logout } = useAuth();
  
  // ... rest of component
  
  function handleLogout() {
    logout(); // Call real logout
    navigate('/login');
  }
}
```

### Adding Real Notifications

```typescript
// In ProtectedLayout.tsx
import { useNotifications } from '@/hooks/useNotifications';

const { notifications, markAsRead } = useNotifications();

// Pass to HeaderOrganism
<HeaderOrganism
  user={user}
  notificationCount={notifications.filter(n => !n.read).length}
  onNotificationClick={handleNotificationClick}
  userMenuItems={userMenuItems}
/>
```

### Adding Search Functionality

```typescript
function handleSearch(value: string) {
  // Implement global search
  // Could navigate to /search?q=${value}
  // Or open a search modal with results
}
```

---

## 🎯 Navigation Items Configuration

Add/remove navigation items in `ProtectedLayout.tsx`:

```typescript
const navItems = [
  {
    id: 'new-section',
    label: t('nav.newSection'),
    icon: Star, // From lucide-react
    path: '/new-section',
  },
  // ... existing items
];
```

Then add the corresponding route in `routes.tsx`:

```typescript
{
  path: 'new-section',
  element: <NewSectionPage />,
}
```

---

## 🎨 Customization

### Changing Colors

Edit the design tokens in `/src/styles/theme.css` or override in components:

```typescript
// Custom primary color
<div className="bg-[#your-color]">
```

### Changing Sidebar Width

In `ProtectedLayoutTemplate.tsx`:

```typescript
// Change from 240px to your desired width
<div className="w-[240px]"> {/* Change this */}
<div className="ml-[260px]"> {/* And this (width + padding) */}
```

### Adding Logo Image

Replace the SVG in `Logo.tsx` with:

```typescript
<img src="/path/to/logo.png" alt="Company Logo" />
```

---

## 📦 Dependencies Used

- ✅ `react-router-dom` ^7.13.1
- ✅ `i18next` ^25.8.20
- ✅ `react-i18next` ^16.5.8
- ✅ `lucide-react` (already installed)
- ✅ `@radix-ui/react-dropdown-menu` (already installed)
- ✅ `clsx` (already installed)
- ✅ `tailwind-merge` (already installed)

---

## 🚀 Next Steps

### Immediate Tasks
1. ✅ Layout structure is complete
2. ⏳ Connect to real authentication system
3. ⏳ Implement actual page content (Dashboard, Projects, etc.)
4. ⏳ Add notification system
5. ⏳ Implement search functionality

### Future Enhancements
- [ ] Sidebar collapse/expand on mobile
- [ ] Dark mode support
- [ ] Multi-team switcher in user dropdown
- [ ] Breadcrumb navigation
- [ ] Command palette (Cmd+K search)

---

## 💡 Component Usage Examples

### Using the Protected Layout

```typescript
// The layout is automatically applied to all routes
// defined under the ProtectedLayout in routes.tsx

// Example page:
export function MyPage() {
  return (
    <div>
      <h1>My Page Content</h1>
      {/* This content will appear in the main area */}
    </div>
  );
}
```

### Creating a New Page

1. Create the page component:
```typescript
// src/app/pages/MyNewPage.tsx
export function MyNewPage() {
  return <div>My New Content</div>;
}
```

2. Add route:
```typescript
// src/app/routes.tsx
{
  path: 'my-new-page',
  element: <MyNewPage />,
}
```

3. Add navigation item (optional):
```typescript
// src/app/layouts/ProtectedLayout.tsx
{
  id: 'my-new-page',
  label: t('nav.myNewPage'),
  icon: Star,
  path: '/my-new-page',
}
```

---

## 🐛 Troubleshooting

### Layout not showing?
- Ensure `App.tsx` imports `../i18n/config`
- Check that `RouterProvider` is rendering
- Verify routes are configured correctly

### Sidebar not sticky?
- Check that parent container has proper height (`h-screen`)
- Verify `fixed` positioning is applied

### Translations not working?
- Check that language files are loaded in `/src/i18n/config.ts`
- Verify `useTranslation()` hook is being used
- Ensure i18n is initialized in `App.tsx`

---

## 📚 Resources

- [React Router v7 Docs](https://reactrouter.com/)
- [i18next Documentation](https://www.i18next.com/)
- [Lucide Icons](https://lucide.dev/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## ✅ Deliverables Checklist

- [x] Atomic Design structure (atoms, molecules, organisms, templates)
- [x] ProtectedLayoutTemplate component
- [x] SidebarOrganism with navigation
- [x] HeaderOrganism with search and user menu
- [x] React Router DOM v7 configuration
- [x] i18n setup (English + Spanish)
- [x] All 7 navigation pages (placeholder)
- [x] Accessibility features (ARIA labels)
- [x] TypeScript types
- [x] Utility functions
- [x] Documentation

---

**Created by:** Figma Make AI Assistant
**Date:** March 20, 2026
**Version:** 1.0.0

🎉 **The Protected Layout is ready for integration!**
