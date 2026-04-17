# Mini ClickUp — Roadmap de Rescate y Desarrollo MVP

**Versión:** 2.0.0-rescue  
**Fecha:** 2026-04-16  
**Propietario:** Norberto Lodela  
**Estado:** 🔴 RESCATE ACTIVO → Construcción MVP  

---

## 🎯 Visión General

Mini ClickUp es una aplicación de gestión de proyectos inspirada en ClickUp, construida con MERN Stack + Socket.IO. El proyecto fue iniciado y dejado en estado roto por agentes anteriores. Este documento define el plan de rescate y desarrollo ordenado hacia un MVP funcional y verificable.

**Pila tecnológica confirmada:**
- Frontend: React 19 + Vite + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Base de datos: MongoDB 8.2 (Windows service, local)
- Realtime: Socket.IO
- Auth: JWT + HttpOnly cookies
- Diseño: Figma CRM Workroom Community (`IOYnTnClPHrmSnWFlKh96O`)

---

## 🗺️ Mapa de Pantallas (desde Figma + Codebase)

```
RUTAS PÚBLICAS (GuestLayout)
├── /login              ✅ 100% — LoginPage.tsx
├── /register           ✅ 100% — RegisterPage.tsx
├── /forgot-password    ✅ UI, ❌ email flow — ForgotPasswordPage.tsx
└── /reset-password     ✅ UI, ❌ token flow — ResetPasswordPage.tsx

RUTAS PROTEGIDAS (ProtectedLayout)
├── /dashboard          ⚠️  70% — DashboardPage.tsx + dashboard/app/
├── /projects           ⚠️  50% — ProjectsPage.tsx (mock data)
├── /tasks              ⚠️  40% — TasksPage.tsx (mock data)
├── /team               ⚠️  90% — TeamPage.tsx (bug: delete 500)
├── /backlog            ❌   0% — BacklogPage.tsx (stub)
├── /chat               ❌  15% — ChatPage.tsx (stub)
├── /calendar           ❌  20% — CalendarPage.tsx (stub)
├── /settings           ❌  20% — SettingsPage.tsx (stub)
└── [employees]         ❌  20% — pages/employees/index.tsx (sin ruta)
    [info-portal]       ❌   0% — pages/info/portal.tsx (sin ruta)
    [vacations]         ❌   0% — pages/vacations/index.tsx (sin ruta)
    [messenger]         ❌  15% — pages/messenger/index.tsx (sin ruta)
```

**Sidebar Figma confirmado:**
```
[Logo] [P]
├── Dashboard
├── Projects
├── Calendar
├── Vacations
├── Employees
├── Messenger
└── Info Portal
[Support widget]
[Logout]
```

---

## 🚨 Bugs Críticos Confirmados (Fase 0 Obligatoria)

| ID | Bug | Evidencia | Prioridad |
|----|-----|-----------|-----------|
| BUG-001 | `DELETE /api/teams/:id` → 500 Internal Server Error | Screenshot dev tools | P0 |
| BUG-002 | `authenticate` sin `()` en routes/projects.ts, tasks.ts, sprint.ts | Código fuente | P0 |
| BUG-003 | Build falla (errores TypeScript + imports rotos) | `npm run build` → error | P0 |
| BUG-004 | Tests de teams: 12/33 fallan | `npm run test` | P0 |
| BUG-005 | Duplicado de árbol dashboard (`pages/dashboard/app/`) vs `DashboardPage.tsx` | Estructura | P1 |
| BUG-006 | `axios` usado en hooks viejos en lugar de `services/api.ts` | useTasks, useProjects | P1 |
| BUG-007 | Socket.IO naming mixto: kebab-case vs colon-notation | SocketContext | P1 |

---

## 📋 Fases de Desarrollo

### FASE 0: RESCATE — "Estabilizar la base" 🔴

**Objetivo:** Que el build pase, los tests de teams pasen, y los bugs P0 estén resueltos.  
**Milestone GitHub:** `Phase 0 — Rescue`  
**Condición de salida:** `npm run build` ✅ | `npm run test` sin fallos P0

#### Epics de Rescate

| Epic | Descripción | Issues | Estimación |
|------|-------------|--------|------------|
| E-RESCUE-01 | Fix bugs P0 en backend (routes, team delete) | 3 tasks | CH |
| E-RESCUE-02 | Estabilizar build TypeScript | 2 tasks | MD |
| E-RESCUE-03 | Unificar cliente API (eliminar axios de hooks) | 1 task | CH |
| E-RESCUE-04 | Reconciliar árbol de dashboard duplicado | 1 task | MD |

---

### FASE 1: FUNDACIÓN API — "Datos reales" 🟡

**Objetivo:** Projects y Tasks con CRUD real conectado a MongoDB. Dashboard con datos reales.  
**Milestone GitHub:** `Phase 1 — API Foundation`  
**Condición de salida:** Ningún mock data en Projects/Tasks/Dashboard

#### Epics

| Epic | Descripción | Estimación |
|------|-------------|------------|
| E-PROJ-01 | Projects API — CRUD completo (controller, service, routes) | L |
| E-PROJ-02 | Projects Frontend — conectar a API real | MD |
| E-TASK-01 | Tasks API — CRUD completo (controller, service, routes) | L |
| E-TASK-02 | Tasks Frontend — conectar a API real | MD |
| E-DASH-01 | Dashboard — conectar a APIs reales | MD |

---

### FASE 2: PANTALLAS CORE — "App funcional" 🟡

**Objetivo:** Dashboard completo (Figma-accurate), Kanban board interactivo, Teams 100%.  
**Milestone GitHub:** `Phase 2 — Core Screens`  
**Condición de salida:** Usuario puede gestionar proyectos, tareas en Kanban, ver dashboard real

#### Epics

| Epic | Descripción | Estimación |
|------|-------------|------------|
| E-DASH-02 | Dashboard — Workload, Nearest Events, Activity Stream | L |
| E-TASK-03 | Kanban Board — drag-and-drop (@dnd-kit) | XL |
| E-TASK-04 | Task Detail Modal — completo | MD |
| E-TEAMS-01 | Teams 100% — avatar upload, ownership transfer | MD |
| E-UI-01 | Atomic Components — Badge, Avatar, Checkbox, Radio | MD |

---

### FASE 3: MOTOR DE WORKFLOW — "Lógica de negocio" 🟠

**Objetivo:** Ciclo completo de vida de tareas: Todo→InProgress→Review→Done→QA→[Approved/Bug].  
**Milestone GitHub:** `Phase 3 — Workflow Engine`  
**Condición de salida:** QA puede aprobar/rechazar. Bugs creados automáticamente. Notificaciones RT.

#### Epics

| Epic | Descripción | Estimación |
|------|-------------|------------|
| E-FLOW-01 | Task Workflow — estados, transiciones, validaciones | MD |
| E-FLOW-02 | QA Auto-transition (Done → QA automático) | MD |
| E-FLOW-03 | Bug Entity — creación desde rechazo QA | MD |
| E-NOTIF-01 | Notification System — Socket.IO + badge | L |
| E-BACK-01 | Backlog — sprint planning básico | MD |

---

### FASE 4: PANTALLAS SECUNDARIAS — "Feature complete" 🟢

**Objetivo:** Todas las pantallas del sidebar de Figma implementadas.  
**Milestone GitHub:** `Phase 4 — Secondary Screens`  
**Condición de salida:** Todas las rutas del sidebar son funcionales

#### Epics

| Epic | Descripción | Estimación |
|------|-------------|------------|
| E-CHAT-01 | Chat/Messenger — Socket.IO chat completo | XL |
| E-CAL-01 | Calendar — vista mensual/semanal | L |
| E-VAC-01 | Vacations — solicitud y aprobación | L |
| E-EMP-01 | Employees — directorio y perfiles | MD |
| E-INFO-01 | Info Portal — contenido base | CH |
| E-SET-01 | Settings — perfil, notificaciones, tema | MD |

---

### FASE 5: PULIDO Y ENTREGA — "MVP Shippable" 🔵

**Objetivo:** Performance, accesibilidad, documentación técnica, deployment estable.  
**Milestone GitHub:** `Phase 5 — Polish & Ship`  
**Condición de salida:** Sin bloqueos en workflow crítico, <2s page loads

#### Epics

| Epic | Descripción | Estimación |
|------|-------------|------------|
| E-PERF-01 | Performance audit + optimizaciones | MD |
| E-A11Y-01 | Accessibility WCAG AA básico | CH |
| E-DOCS-01 | OpenAPI spec + flowcharts | MD |
| E-TEST-01 | Tests unitarios coverage >80% paths críticos | L |

---

## 📊 Resumen de Esfuerzo

| Fase | Epics | Estimación | Prioridad |
|------|-------|------------|-----------|
| **Phase 0: Rescue** | 4 | ~1 día | 🔴 Inmediata |
| **Phase 1: API Foundation** | 5 | ~3 días | 🔴 Alta |
| **Phase 2: Core Screens** | 5 | ~5 días | 🟡 Alta |
| **Phase 3: Workflow** | 5 | ~4 días | 🟡 Media-Alta |
| **Phase 4: Secondary** | 6 | ~6 días | 🟢 Media |
| **Phase 5: Polish** | 4 | ~2 días | 🔵 Baja |
| **TOTAL** | **29** | **~21 días** | — |

---

## 🔗 Dependencias Críticas

```
Phase 0 (Rescue)
    └─► Phase 1 (API Foundation)
            ├─► Phase 2 (Core Screens)
            │       └─► Phase 3 (Workflow)
            │               └─► Phase 4 (Secondary)
            │                       └─► Phase 5 (Polish)
            └─► [PARALELO] Phase 4 secondary screens no-dependientes
                (Employees, Info Portal, Settings — sin dependencia de Tasks/Workflow)
```

---

## ✅ Definition of Done (DoD) Global

Para que cualquier story se considere Done:
1. Código implementado y funcionando
2. TypeScript sin errores (`npm run typecheck`)
3. ESLint + Prettier pass (`npm run lint`)
4. Build exitoso (`npm run build`)
5. Criterios de aceptación verificados manualmente
6. Sin regresiones en tests existentes
7. Documentación actualizada si aplica

---

## 🔧 Herramientas Disponibles para el Desarrollo

| Herramienta | Estado | Uso |
|-------------|--------|-----|
| Figma MCP (`IOYnTnClPHrmSnWFlKh96O`) | ⚠️ Auth issue | Diseño de referencia |
| GitHub Issues API | ✅ Disponible | Tracking de tasks |
| MongoDB 8.2 local | ✅ Running | DB de desarrollo |
| Socket.IO | ✅ Configurado | Realtime |
| @dnd-kit | ✅ Instalado (sin uso) | Kanban drag-and-drop |
| @tanstack/react-query | ✅ Instalado (sin uso) | Cache y fetching |
| zustand | ✅ Instalado (sin uso) | State management |

### Sugerencias de herramientas adicionales

| Herramienta | Propósito | Acción |
|-------------|-----------|--------|
| Figma MCP token refresh | Acceso completo al diseño | Verificar `FIGMA_API_TOKEN` |
| GitHub Projects GraphQL API | Kanban board en GitHub | Agregar al MCP config |
| `mongosh` v2.8.2 | Ya instalado ✅ | Disponible |

---

_Documento generado: 2026-04-16 | Autor: GitHub Copilot + Norberto Lodela_
_Referencia: estado-actual.md + Figma screenshot análisis + codebase audit_
