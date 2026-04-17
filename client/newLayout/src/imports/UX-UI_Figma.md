**Instrucciones precisas para el diseñador (UX/UI) – Entrega de componentes listos para integrar en Mini ClickUp**

---

## 1. Contexto del proyecto  
- **Stack**: MERN + Socket.IO, **React 19**, **Vite**, **TypeScript**, **Tailwind CSS v4**, **Radix UI** (vía `@radix-ui/react-*`), **TanStack Query** (v5), **clsx**, **cmdk**, **Embla Carousel**, **i18next** (es‑MX ↔ en), **Lucide Icons**, **Framer Motion**, **next‑themes**, **Recharts**, **shadcn‑ui** (basado en Radix), **Vaul** (para drawers).  
- **Build**: Vite 6, ESBuild, autoprefixer (PostCSS), ESLint + Prettier (config en raíz).  
- **Arquitectura**: **Atomic Design** (atoms → molecules → organisms → templates → pages) + **Container‑Presenter** + **Service‑Component**.  
- **State global**: React Context (`AuthContext`, `SocketContext`, `ThemeContext`, `i18nContext`).  
- **Rutas**: `createBrowserRouter` (React‑Router‑DOM v7) con `ProtectedLayout` y `GuestLayout`.  
- **Estilo de componentes**:  
  - Archivos **PascalCase** (ej. `Button.tsx`).  
  - Export **named** (no `export default` salvo en la página).  
  - Uso de `@/` alias para imports absolutos (ej. `@/components/ui/button`).  
  - Evitar **barrel exports** salvo para agrupar componentes estrictamente relacionados.  
  - No usar `any`; usar `unknown` + type guards cuando sea necesario.  
  - Los componentes deben ser **puras** (presentacionales) cuando reciben props; la lógica de datos queda en los **containers** (pages o custom hooks).  

---

## 2. Estructura esperada de los componentes entregados

| Nivel Atomic | Carpeta (relativa a `client/src/components`) | Responsabilidad | Ejemplo de nombre |
|--------------|----------------------------------------------|----------------|-------------------|
| **atoms**    | `ui/atoms/`                                  | Elementos indivisibles, sin lógica interna (botón, input, icon, badge, tooltip, separator, etc.) | `ButtonAtom.tsx`, `IconAtom.tsx` |
| **molecules**| `ui/molecules/`                              | Combinación sencilla de atoms con una responsabilidad clara (ej. campo de input + label, card + header, stat‑card, activity‑item). | `StatCardMolecule.tsx`, `ActivityItemMolecule.tsx` |
| **organisms**| `ui/organisms/`                              | Secciones reutilizables de la UI que pueden incluir varios molecules/atoms y manejan su propio estado interno limitado (sidebar, header, modal, drawer, stats‑grid, recent‑activity, employee‑form, project‑card). | `SidebarOrganism.tsx`, `HeaderOrganism.tsx`, `CalendarModalOrganism.tsx`, `StatsGridOrganism.tsx` |
| **templates**| `ui/templates/`                              | Estructura de página (layout) que define dónde van header, sidebar, main, footer. No contiene datos específicos. | `DashboardTemplate.tsx`, `BaseLayoutTemplate.tsx` |
| **pages**    | `pages/`                                     | **Containers** que consumen hooks/services, proveen datos a los templates/organisms y manejan navegación. No contienen marcado UI complejo (solo `<Template><Organism … /></Template>`). | `DashboardPage.tsx`, `EmployeesPage.tsx`, `InfoPage.tsx`, `MessengerPage.tsx`, `ProjectsPage.tsx`, `VacationsPage.tsx` |
| **hooks**    | `hooks/`                                     | Lógica reutilizable de datos (fetching, suscripciones, estado) – ej. `useDashboard.ts`, `useEmployees.ts`, `useCalendarModal.ts`. | `useDashboard.ts` |
| **services** | `services/`                                  | Capa de comunicación con API / Socket – funciones puras que retornan promesas. | `dashboardService.ts` |
| **utils**    | `utils/`                                     | Funciones puras de formato, helpers, `cn()` (clsx wrapper), date helpers, etc. | `cn.ts`, `formatters.ts` |
| **types**    | `types/`                                     | Interfaces y tipos compartidos (DTOs, respuestas, enums). | `dashboard.types.ts` |

> **Nota**: El diseñador **NO** debe crear archivos fuera de las carpetas `ui/atoms`, `ui/molecules`, `ui/organisms`, `ui/templates` a menos que sea un **component** claramente reutilizable (por ejemplo, un `Drawer` de Vaul que se usará en varios lugares). Todo lo que sea específico de una página debe ir dentro de `pages/` como **container**.

---

## 3. Qué debe entregar el diseñador (por cada componente)

1. **Archivo `.tsx`** con el componente **presentacional** (atoms, molecules, organisms, templates).  
2. **Archivo de estilos** (si necesita clases Tailwind que no se pueden expresar en línea) dentro de la misma carpeta, usando el mismo nombre y extensión `.css` o módulo CSS (`ComponentName.module.css`).  
   - Preferir **Tailwind utility‑first**; sólo usar CSS cuando sea indispensable (animaciones clave, keyframes, etc.).  
3. **Archivo de historias** opcional (`ComponentName.stories.tsx`) para Storyboard (no obligatorio pero recomendado).  
4. **Archivo de pruebas unitarias** opcional (`ComponentName.test.tsx`) – tampoco obligatorio, pero si lo entrega será bien visto.  
5. **Documentación breve** (comentario JSDoc en la parte superior) explicando:  
   - Propiedades recibidas (`Props` interface).  
   - Qué hace.  
   - Qué efectos secundarios tiene (ninguno, salvo que use `useEffect` interno para animaciones).  
6. **Exportación** mediante `export function NombreComponente(props: Props) { … }`.  
   - **No** exportar como `default` a menos que sea un **page** (`DashboardPage`).  

### Requisitos de código para cada nivel

| Nivel | Qué debe contener | Qué **NO** debe contener |
|-------|-------------------|--------------------------|
| **Atoms** | - Sólo etiquetas HTML o componentes Radix/Lucide. <br>- Props mínimas (variant, size, disabled, children, className opcional). <br>- No uso de hooks, no uso de context, no llamadas a API. | - Lógica de negocio, estado local (`useState`, `useEffect`), datos de la API, llamadas a servicios. |
| **Molecules** | - Composición de 2‑5 atoms (u otros molecules simples). <br>- Puede recibir callbacks (`onClick`, `onChange`) y datos simples para renderizar. <br>- Puede usar `useState` **solo** para estados UI internos (ej. toggle de un dropdown, apertura de un tooltip). | - Lógica de fetch, uso de `useContext` para datos de negocio, llamadas a servicios, manejo de rutas. |
| **Organisms** | - Agrupación de molecules/atoms que forma una sección reutilizable (sidebar, header, modal, card‑grid, formulario). <br>- Puede usar **context** *solo* para cosas estrictamente de presentación (ej. `ThemeContext` para cambiar colores, `i18nContext` para traducir strings internos). <br>- Puede usar hooks de UI (`useTransition`, `useDrag`, etc.) siempre que no implique datos de negocio. | - Lógica de fetch de API, uso de `useAuth`, `useSocket`, `useEmployees`, etc. <br>- Estado que persista más allá del ciclo de vida del componente (debería elevarse al container). |
| **Templates** | - Define la estructura de página: `<Sidebar />`, `<Header />`, `<main>{children}</main>`, opcionalmente `<Footer />`. <br>- No recibe datos de negocio, solo props de layout (ej. `showSidebar: boolean`). | - Lógica de datos, llamadas a hooks de negocio, estado que varie con la información de la página. |
| **Pages (Containers)** | - Importa hooks/services para obtener datos. <br>- Usa los templates/organisms para renderizar. <br>- Maneja navegación, mutations (crear/editar/eliminar), y efectos secundarios (`useEffect` para suscripciones socket, etc.). <br>- Puede tener estado local (`useState`) relacionado con UI de la página (ej. modal abierto, fila seleccionada). | - Marcado UI complejo directamente (evitar divs con clases largas dentro del container). Todo UI debe venir de los componentes de ui/. |

---

## 4. Componentes concretos a extraer del nuevo diseño (Figma) y cómo estructurarlos

### 4.1. Menú lateral reutilizable → `ui/organisms/SidebarOrganism.tsx`
- **Props**:  
  ```tsx
  interface SidebarProps {
    user: { name?: string; email?: string } | null;
    isConnected: boolean;
    onToggleSidebar: (open: boolean) => void;
    isSidebarOpen: boolean;
    navItems: Array<{
      icon: LucideIcon;        // componente de lucide, no string
      label: string;           // ya traducido (usar t() de i18next dentro del component si se necesita)
      path: string;
      highlight?: boolean;     // opcional para badge "NEW"
    }>;
    onLogout: () => Promise<void>;
    onNavigate: (path: string) => void;
    logoSrc: string;
    supportSrc: string;
  }
  ```
- **Interno**:  
  - Usa `useTranslation` de i18next para traducir etiquetas si el diseñador no las incluye ya traducidas.  
  - El componente **NO** llama a `logout` directamente; llama a `props.onLogout()` (el container se encarga de llamar al hook `useAuth`).  
  - El estado de apertura/cierre del sidebar lo controla el container (`DashboardPage` o `BaseLayoutTemplate`) mediante los props `isSidebarOpen` y `onToggleSidebar`.  
- **Estilo**: Mantener las clases actuales de Tailwind del diseño (glass, border, transition). No cambiar iconografía a menos que el diseñador proporcione un nuevo conjunto de iconos Lucide (se debe usar la librería `lucide-react`).

### 4.2. Header reutilizable → `ui/organisms/HeaderOrganism.tsx`
- **Props**:  
  ```tsx
  interface HeaderProps {
    user: { name?: string; email?: string } | null;
    isConnected: boolean;
    onToggleSidebar: (open: boolean) => void;
    isSidebarOpen: boolean;
  }
  ```
- **Interno**:  
  - Botón de menú (hamburguesa / cruz) que llama a `onToggleSidebar(!isSidebarOpen)`.  
  - Campo de búsqueda (input) sin lógica; el container puede pasar `onSearchChange` si necesita filtrado, pero **por ahora** el diseñador solo entrega el UI; el container lo conectará.  
  - Icono de notificación (bell) con badge opcional (puede ser controlado por un prop `notificationCount?: number`).  
  - No usar estado interno para el badge; lo recibe como prop.  
- **Estilo**: Mantener el `glass`, `flex items‑center justify‑between`, los colores de Tailwind existentes.

### 4.3. Layout base de la app → `ui/templates/BaseAppTemplate.tsx`
- **Props**:  
  ```tsx
  interface BaseAppTemplateProps {
    children: React.ReactNode;
    sidebar: React.ReactNode;   // <- SidebarOrganism
    header: React.ReactNode;    // <- HeaderOrganism
    showSidebar: boolean;
    toggleSidebar: (open: boolean) => void;
  }
  ```
- **Interno**:  
  ```tsx
  <div className="flex h-screen overflow-hidden">
    <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 glass border-r border-neutral-200 transform transition-transform duration-300 ${showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"`}>
      {sidebar}
    </aside>
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {header}
      <section className="flex-1 overflow-y-auto p-6">{children}</section>
    </main>
  </div>
  ```
- **Uso en pages**:  
  ```tsx
  <BaseAppTemplate
    showSidebar={sidebarOpen}
    toggleSidebar={setSidebarOpen}
    sidebar={<SidebarOrganism {...sidebarProps} />}
    header={<HeaderOrganism {...headerProps} />}
  >
    {/* Contenido específico de la página (Dashboard, Employees, etc.) */}
  </BaseAppTemplate>
  ```
> **Importante**: El diseñador **NO** debe modificar el menú lateral ni el header; su tarea es entregar los componentes **SidebarOrganism** y **HeaderOrganism** con los props descritos. El equipo de desarrollo los colocará dentro del `BaseAppTemplate`.

### 4.4. Modal de calendario reutilizable → `ui/organisms/CalendarModalOrganism.tsx`
- **Props**:  
  ```tsx
  interface CalendarModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    // datos que necesita mostrar (pueden venir del container)
    events: Array<{
      id: string;
      title: string;
      start: string; // ISO
      end: string;
      color?: string;
    }>;
    onCreateEvent: (event: Omit<EventType, "id">) => Promise<void>;
    onUpdateEvent: (event: EventType) => Promise<void>;
    onDeleteEvent: (id: string) => Promise<void>;
  }
  ```
- **Interno**:  
  - Usa el componente **Dialog** de Radix (`@radix-ui/react-dialog`) para el modal (accesible, foco, cierre con ESC, click fuera).  
  - Dentro, un calendario simple (puede ser `react-calendar` o una tabla manual) que permita seleccionar rango y crear/editar eventos.  
  - **No** llamar directamente a los servicios; llamar a los callbacks provistos por el container (`onCreateEvent`, etc.).  
  - El container (por ejemplo, `CalendarPage` o `DashboardPage` si lo muestra allí) será responsable de abrir/cerrar el modal mediante `open` y `onOpenChange`.  
- **Estilo**: Tailwind + clases de Radix (usar `data-[state]=open:` para animaciones). Mantener look del Figma (borde redondeado, sombra, fondo glass).

### 4.5. Estadísticas (Stats Grid) → `ui/molecules/StatCardMolecule.tsx` (ya existe, mejorar) y `ui/molecules/StatsGridMolecule.tsx`
- **StatCardMolecule**:  
  - Recibe `{title, value, trend, trendUp, icon, color}` tal como está actualmente.  
  - **No** usar estado interno; es totalmente presentacional.  
- **StatsGridMolecule**:  
  - Recibe `stats: Array<StatCardProps>` y renderiza un `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">` con las tarjetas.  
  - No contiene lógica de negocio.

### 4.6. Actividad reciente → `ui/molecules/ActivityItemMolecule.tsx` y `ui/molecules/RecentActivityMolecule.tsx`
- **ActivityItemMolecule**: mismo que antes (props: `user, action, target, time`).  
- **RecentActivityMolecule**:  
  - Recibe `items: Array<ActivityItemProps>` y envuelve la lista en un `<Card glass>` con título “Recent Activity”.  

### 4.7. Página Dashboard (Container) → `pages/DashboardPage.tsx`
- **Responsabilidades**:  
  - Llama a `useAuth` y `useSocket`.  
  - (Opcional) crea un hook `useDashboard.ts` que obtenga datos de métricas y actividad reciente vía servicios (o use mock data por ahora).  
  - Renderiza `<BaseAppTemplate>` con `SidebarOrganism` y `HeaderOrganism` como hijos.  
  - En el `<main>` coloca `<StatsGridMolecule stats={dashboardStats} />` y `<RecentActivityMolecule items={recentActivity} />`.  
- **No** debe contener JSX complejo más allá de la composición de los componentes de UI.

### 4.8. Otras páginas (Employee, Info, Messenger, Projects, Vacations)  
- Cada una será un **container** (`pages/EmployeesPage.tsx`, etc.) que:  
  1. Usa el mismo `BaseAppTemplate`.  
  2. Importa los organisms/molecules necesarios (por ejemplo, `EmployeeFormOrganism`, `ProjectCardMolecule`, `VacationCalendarOrganism`).  
  3. Llama a hooks específicos (`useEmployees`, `useProjects`, `useVacations`).  
- **El diseñador debe entregar** los organismos y molecules que estas páginas necesitan (por ejemplo, un `EmployeeCardOrganism`, un `ProjectFormMolecule`, etc.) siguiendo la misma regla de **solo presentación + callbacks**.

---

## 5. Guía de estilo y buenas prácticas que el diseñador debe seguir

| Tema | Detalle |
|------|---------|
| **Tipografía y colores** | Usar las variables de Tailwind definidas en `tailwind.config.ts` (que provienen del design system Prisma Kirest). No introducir nuevos valores de color fuera de la paleta (`--primary`, `--electric-blue`, `--success`, `--warning`, `--destructive`, y los neutros). |
| **Espaciado** | Utilizar exclusivamente la escala de spacing de Tailwind (`px-[4px]`, `py-[8px]`, etc.) o las clases predefinidas (`p-4`, `mt-6`, `gap-4`). No usar valores arbitrarios como `margin-left: 12px;` salvo que esté dentro de un archivo CSS módulo y sea absolutamente necesario (animaciones, keyframes). |
| **Responsive** | Enfoque **mobile‑first**. Todas las clases deben comenzar sin prefijo y agregarse prefijos `sm:`, `md:`, `lg:`, `xl:` según necesidad. |
| **Iconografía** | Usar exclusivamente **Lucide** (`lucide-react`). Cada icono se importa como `<LucideIcon name="layout-dashboard" className="w-5 h-5" />` o mediante el componente helper `<Lucide icon="layout-dashboard" />` si el equipo ya lo tiene. No usar SVG inline a menos que el diseñador proporcione un componente que envuelva el SVG y lo exporte como un **atom** (`IconAtom.tsx`). |
| **Accesibilidad** | - Todos los botones deben ser `<button>` o componentes de Radix que renderizan un `<button>`. <br>- Los enlaces deben ser `<a>` dentro de componentes de navigation o usar `Link` de `react-router-dom` (que ya es accesible). <br>- Los modales deben ser `@radix-ui/react-dialog` (o `@radix-ui/react-popover` para menús). <br>- Los inputs deben tener `label` asociado mediante `htmlFor` o `aria-label`. <br>- Evitar usar `outline: none` sin proporcionar un `focus-visible` estilo. |
| **Animaciones y transiciones** | Usar exclusivamente **Framer Motion** para animaciones de entrada/salida de modales, listas, etc. Si el diseñador necesita una animación CSS clave, debe entregar un archivo `.css` o módulo con la animación y el componente debe importarla y aplicar mediante `className` o `style`. No usar animaciones inline de estilo (`style={{ transition: ... }}`) salvo que sea extremadamente simple y se justifique. |
| **Internacionalización** | Todas las cadenas visibles deben pasar por el hook `useTranslation()` de `i18next`. El diseñador puede entregar las etiquetas ya traducidas (es‑MX) y el container se encargará de llamar a `t('key')`. Si el diseñador incluye texto en inglés, deberá marcarlo con una clave de traducción (ej. `t('dashboard.welcome')`). |
| **Estado de carga y error** | Los componentes presentacionales **NO** deben manejar estados de carga o error; esos estados deben ser gestionados por el container y pasados como props (`isLoading?: boolean`, `error?: string | null`). El componente puede entonces mostrar un esqueleto (`skeleton` de Tailwind o un `Spinner` atom) o un mensaje de error genérico. |
| **Performance** | - Evitar re-renders innecesarios: usar `React.memo` solo cuando el componente reciba props que cambian frecuentemente y el costo de render sea alto (p.ej., una lista grande). <br>- Usar `useCallback` y `useMemo` en los containers, nunca dentro de los componentes presentacionales salvo que el diseñador lo necesite para evitar recreación de funciones pasadas como prop (en ese caso, el diseñador debe exponer esa función como prop y dejar que el container la memoice). |
| **Testing** | Si el diseñador entrega pruebas unitarias (`Component.test.tsx`), deben usar **Vitest** y **React Testing Library**. Los mocks de hooks deben ser simples (`jest.fn()`). |
| **Versionado de libs** (para que el diseñador conozca qué está disponible): <br> - `"react": "^19.0.0"` <br> - `"react-dom": "^19.0.0"` <br> - `"@radix-ui/react-dialog": "^1.1.2"` <br> - `"@radix-ui/react-popover": "^1.1.2"` <br> - `"@radix-ui/react-select": "^2.1.2"` <br> - `"@tanstack/react-query": "^5.56.2"` <br> - `"clsx": "^2.1.1"` <br> - `"cmdk": "^1.0.0"` <br> - `"embla-carousel-react": "^8.1.6"` <br> - `"framer-motion": "^11.5.4"` <br> - `"i18next": "^24.0.2"` <br> - `"react-i18next": "^15.0.2"` <br> - `"lucide-react": "^0.460.0"` <br> - `"next-themes": "^0.4.4"` <br> - `"recharts": "^2.12.7"` <br> - `"tailwindcss": "^4.0.0"` <br> - `"@headlessui/react": "^2.2.0"` (opcional, pero está disponible) <br> - `"vaul": "^0.9.1"` (para drawer si se necesita) |

---

## 6. Roadmap de trabajo (para el equipo de desarrollo) – entregables esperados del diseñador

| Sprint / Fase | Tarea del diseñador | Salida esperada | Comentario de aceptación |
|---------------|----------------------|----------------|--------------------------|
| **0 – Preparación** | Revisar la guía anterior y confirmar que entiende los niveles atomic, los props requeridos y las libs disponibles. | Documento de confirmación (un issue o comentario) | Sin comentarios negativos. |
| **1 – Layout base** | Entregar `BaseAppTemplate.tsx` (estructura) + los dos organismos: `SidebarOrganism.tsx` y `HeaderOrganism.tsx` con los props especificados. | Archivos `.tsx` (y opcional `.module.css`) en `client/src/components/ui/templates/` y `ui/organisms/`. | Revisión de que los componentes solo reciben props y no hacen fetches ni usan context de negocio. |
| **2 – Menu lateral y header** | Asegurarse de que los componentes usan `LucideIcon` para los iconos (no strings) y que los textos son pasados como props (listos para i18n). | Mismo entregable que la fase 1, con correcciones de iconografía y tipado de props. | Aprobación tras lint y revisión de código. |
| **3 – Modals reutilizables** | Entregar `CalendarModalOrganism.tsx` (usando `@radix-ui/react-dialog`) con props `open`, `onOpenChange`, eventos y callbacks. | Archivo en `ui/organisms/`. | Se verifica que el modal se abre/cierra mediante props y llama a los callbacks. |
| **4 – Molecules de UI** | Entregar `StatCardMolecule.tsx`, `StatsGridMolecule.tsx`, `ActivityItemMolecule.tsx`, `RecentActivityMolecule.tsx`. | Archivos en `ui/molecules/`. | Revisión de que son puramente presentacionales (sin `useEffect` de datos, sin llamadas a servicios). |
| **5 – Página Dashboard (container)** | El diseñador **NO** crea la página; el equipo de desarrollo creará `DashboardPage.tsx` usando los organismos y molecules entregados. El diseñador solo necesita confirmar que los componentes entregados son compatibles con el container (props correctos). | Ningún archivo nuevo del diseñador; solo feedback. | El equipo crea el container y hace un PR; el diseñador revisa que el aspecto visual coincida con su Figma (aprox. 95% de fidelidad). |
| **6 – Otras páginas** | Para cada una de las páginas restantes (Employees, Info, Messenger, Projects, Vacations) entregar los **organisms** y **molecules** específicos que esas páginas necesitan (ej. `EmployeeCardOrganism`, `ProjectFormMolecule`, `VacationCalendarOrganism`, `InfoSectionOrganism`, `MessengerListOrganism`, etc.). Cada componente debe seguir la regla de presentacional + callbacks. | Conjunto de archivos en `ui/organisms/` y `ui/molecules/` según corresponda. | Cada componente pasa la revisión de atomic design y no contiene lógica de negocio. |
| **7 – Integración final** | El equipo de desarrollo crea los containers (pages) y los hooks/services necesarios, conectando todo con el `BaseAppTemplate`. El diseñador hace una revisión de UI (pixel‑perfect usando herramientas como Storybook o screenshots) y aprueba. | Aplicación completa con el nuevo diseño integrado. | Se marca como “Listo para QA”. |
| **8 – Documentación** | Entregar un breve README dentro de `client/src/components/ui/` explicando la organización atomic y cómo usar cada componente (opcional pero muy apreciado). | Archivo `README.md` en `ui/`. | Se valida que exista y sea claro. |

---

## 7. Checklist de aceptación para cada componente entregado por el diseñador

- [ ] Archivo `.tsx` con nombre **PascalCase** y extensión `.tsx`.  
- [ ] Exportación **named** (`export function NombreComponente(...)`).  
- [ ] Prop Types definidos mediante interface `NombreComponenteProps`.  
- [ ] **No** uso de `useState`, `useEffect`, `useContext` (excepto para `ThemeContext` o `i18nContext` si es exclusivamente de presentación).  
- [ ] **No** llamadas a servicios, hooks de datos (`useAuth`, `useSocket`, `useEmployees`, etc.).  
- [ ] Uso de **LucideIcon** para iconografía (importado desde `lucide-react`).  
- [ ] Estilos principalmente **Tailwind utility‑first**; si se usa CSS módulo, el nombre del archivo coincide con el componente (`NombreComponente.module.css`).  
- [ ] Si necesita animaciones, usar **Framer Motion** y exponer las variantes como props (por ejemplo, `initial`, `animate`, `exit`).  
- [ ] Si el componente necesita mostrar texto, ese texto debe ser un prop (listo para i18n) o bien el componente debe usar `useTranslation()` (solo si el diseñador está de acuerdo en que el componente sea responsable de la traducción).  
- [ ] El componente debe ser **puro**: mismos props => misma salida (sin efectos secundarios internos).  
- [ ] Archivo de estilos (si existe) no contiene selectores globales que afecten a otros componentes.  
- [ ] (Opcional) Archivo de prueba `.test.tsx` que renderiza el componente con props variados y verifica que el output contiene el texto esperado.  

---

## 8. Resumen rápido para el diseñador

> **Tu trabajo es entregar “piezas de LEGO” (atoms, molecules, organisms, templates) que el equipo de desarrollo podrá ensamblar en las páginas (containers). No debes escribir lógica de datos, ni usar hooks de negocio, ni modificar el menú lateral ni el header más allá de proporcionar los componentes reutilizables con los props especificados.**  
> **Siguiendo la guía de atomic design, los principios SOLID/DRY/KISS/YAGNI, y usando exclusivamente las bibliotecas listadas, el equipo podrá integrar tu trabajo de forma rápida y mantener la coherencia del códigobase.**

Con estas instrucciones el próximo entrega del diseñador será directamente utilizable, minimizando el tiempo de adaptación y garantizando que la aplicación siga el patrón de arquitectura acordado. ¡Adelante! 🚀

---
