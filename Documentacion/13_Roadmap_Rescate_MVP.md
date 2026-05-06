# Mini ClickUp — Roadmap de Rescate y Desarrollo MVP

**Versión:** 3.0.0-rescue+agile  
**Fecha:** 2026-05-06  
**Propietario:** Norberto Lodela  
**Estado:** 🟡 FASE 0-2 COMPLETADA → Construyendo FASE 3-7

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

## 🗺️ Mapa de Pantallas (desde Figma + Codebase — Auditado 2026-05-06)

```
RUTAS PÚBLICAS (GuestLayout)
├── /login              ✅ 100% — LoginPage.tsx (glassmorphism, i18n, OTP)
├── /register           ✅ 100% — RegisterPage.tsx (glassmorphism, validación)
├── /forgot-password    ✅ 100% — ForgotPasswordPage.tsx (anti-enumeración)
└── /reset-password     ✅ 100% — ResetPasswordPage.tsx (token flow)

RUTAS PROTEGIDAS (ProtectedLayout)
├── /dashboard          ⚠️  70% — DashboardPage.tsx (datos mock hardcoded)
├── /projects           ⚠️  80% — ProjectsPage.tsx (API real, glassmorphism)
│   └── /projects/:id   ⚠️  50% — ProjectDetailPage (epics OK, tareas placeholder)
│       ├── /epics      ✅ 100% — EpicsPage.tsx (CRUD completo)
│       └── /epics/:id/stories ✅ 100% — StoriesPage.tsx (CRUD + reorder)
├── /tasks              ⚠️  70% — TasksPage.tsx (@dnd-kit Kanban, mock parcial)
├── /backlog            ⚠️  10% — BacklogPage.tsx (stub estático)
├── /team               ⚠️  90% — TeamPage.tsx (CRUD + invite, bug: delete 500)
├── /chat               ⚠️  15% — ChatPage.tsx (stub "Coming Soon")
├── /calendar           ⚠️  20% — CalendarPage.tsx (stub)
├── /settings           ⚠️  30% — SettingsPage.tsx (perfil parcial)
├── /vacations          ⚠️  15% — VacationsPage.tsx (stub)
├── /info-portal        ⚠️  10% — InfoPortalPage.tsx (stub)

RUTAS ADMIN (AdminLayout → AdminProvider)
├── /admin/companies    ✅ 100% — AdminCompaniesPage (CRUD + fuzzy + branding)
├── /admin/departments  ✅ 100% — AdminDepartmentsPage (CRUD completo)
└── /admin/teams        ✅ 100% — AdminTeamsPage (CRUD completo)

PANTALLAS FALTANTES (no implementadas aún)
├── /sprints            ❌   0% — SprintBoardPage (no existe)
├── /sprints/planning   ❌   0% — SprintPlanningPage (no existe)
├── /projects/:id/table ❌   0% — ListViewPage (no existe)
├── /projects/:id/gantt ❌   0% — GanttViewPage (no existe)
├── /notifications      ❌   0% — NotificationsPage (no existe)
└── /time-tracking      ❌   0% — TimeTrackingPage (no existe)
```

---

## 🚨 Bugs Críticos Confirmados (Auditado 2026-05-06)

| ID      | Bug                                     | Archivo                                     | Prioridad | Estado                      |
| ------- | --------------------------------------- | ------------------------------------------- | --------- | --------------------------- |
| BUG-001 | `DELETE /api/teams/:id` → 500           | teamController/teamService                  | P0        | ⏳ Pendiente                |
| BUG-002 | `authenticate` sin `()` en catalogs.ts  | `server/src/routes/catalogs.ts:12`          | P0        | ⏳ Pendiente                |
| BUG-003 | Build TypeScript falla                  | Proyecto                                    | P0        | ⏳ Parcial (commit 4f2bc1d) |
| BUG-004 | Tests de teams: 12/33 fallan            | `server/tests/team.test.ts`                 | P0        | ⏳ Pendiente                |
| BUG-005 | Duplicado de árbol dashboard            | `pages/dashboard/app/`                      | P1        | ⏳ Pendiente                |
| BUG-006 | `axios` en hooks viejos                 | useTasks, useProjects, useTeams             | P1        | ⚠️ Parcial                  |
| BUG-007 | Socket.IO naming mixto                  | SocketContext kebab vs colon                | P1        | ⏳ Pendiente                |
| BUG-008 | Sprint model SIN project/team/companyId | `server/src/models/Sprint.ts`               | P1        | ⏳ Pendiente                |
| BUG-009 | Socket no conectado a REST controllers  | `server/src/controllers/*.ts`               | P1        | ⏳ Pendiente                |
| BUG-010 | Hooks sin service layer                 | useTasks, useProjects, useTeams, useSprints | P2        | ⏳ Pendiente                |

---

## 📋 Fases de Desarrollo

### FASE 0: RESCATE — "Estabilizar la base" 🔴

**Objetivo:** Que el build pase, los tests de teams pasen, y los bugs P0 estén resueltos.  
**Milestone GitHub:** `Phase 0 — Rescue`  
**Condición de salida:** `npm run build` ✅ | `npm run test` sin fallos P0

#### Epics de Rescate

| Epic        | Descripción                                    | Issues  | Estimación |
| ----------- | ---------------------------------------------- | ------- | ---------- |
| E-RESCUE-01 | Fix bugs P0 en backend (routes, team delete)   | 3 tasks | CH         |
| E-RESCUE-02 | Estabilizar build TypeScript                   | 2 tasks | MD         |
| E-RESCUE-03 | Unificar cliente API (eliminar axios de hooks) | 1 task  | CH         |
| E-RESCUE-04 | Reconciliar árbol de dashboard duplicado       | 1 task  | MD         |

---

### FASE 1: FUNDACIÓN API — "Datos reales" 🟡

**Objetivo:** Projects y Tasks con CRUD real conectado a MongoDB. Dashboard con datos reales.  
**Milestone GitHub:** `Phase 1 — API Foundation`  
**Condición de salida:** Ningún mock data en Projects/Tasks/Dashboard

#### Epics

| Epic      | Descripción                                                | Estimación |
| --------- | ---------------------------------------------------------- | ---------- |
| E-PROJ-01 | Projects API — CRUD completo (controller, service, routes) | L          |
| E-PROJ-02 | Projects Frontend — conectar a API real                    | MD         |
| E-TASK-01 | Tasks API — CRUD completo (controller, service, routes)    | L          |
| E-TASK-02 | Tasks Frontend — conectar a API real                       | MD         |
| E-DASH-01 | Dashboard — conectar a APIs reales                         | MD         |

---

### FASE 2: PANTALLAS CORE — "App funcional" 🟡

**Objetivo:** Dashboard completo (Figma-accurate), Kanban board interactivo, Teams 100%.  
**Milestone GitHub:** `Phase 2 — Core Screens`  
**Condición de salida:** Usuario puede gestionar proyectos, tareas en Kanban, ver dashboard real

#### Epics

| Epic       | Descripción                                           | Estimación |
| ---------- | ----------------------------------------------------- | ---------- |
| E-DASH-02  | Dashboard — Workload, Nearest Events, Activity Stream | L          |
| E-TASK-03  | Kanban Board — drag-and-drop (@dnd-kit)               | XL         |
| E-TASK-04  | Task Detail Modal — completo                          | MD         |
| E-TEAMS-01 | Teams 100% — avatar upload, ownership transfer        | MD         |
| E-UI-01    | Atomic Components — Badge, Avatar, Checkbox, Radio    | MD         |

---

### FASE 3: MOTOR DE WORKFLOW — "Lógica de negocio" 🟠

**Objetivo:** Ciclo completo de vida de tareas: Todo→InProgress→Review→Done→QA→[Approved/Bug].  
**Milestone GitHub:** `Phase 3 — Workflow Engine`  
**Condición de salida:** QA puede aprobar/rechazar. Bugs creados automáticamente. Notificaciones RT.

#### Epics

| Epic       | Descripción                                         | Estimación |
| ---------- | --------------------------------------------------- | ---------- |
| E-FLOW-01  | Task Workflow — estados, transiciones, validaciones | MD         |
| E-FLOW-02  | QA Auto-transition (Done → QA automático)           | MD         |
| E-FLOW-03  | Bug Entity — creación desde rechazo QA              | MD         |
| E-NOTIF-01 | Notification System — Socket.IO + badge             | L          |
| E-BACK-01  | Backlog — sprint planning básico                    | MD         |

---

### FASE 4: PANTALLAS SECUNDARIAS — "Feature complete" 🟢

**Objetivo:** Todas las pantallas del sidebar de Figma implementadas.  
**Milestone GitHub:** `Phase 4 — Secondary Screens`  
**Condición de salida:** Todas las rutas del sidebar son funcionales

#### Epics

| Epic      | Descripción                              | Estimación |
| --------- | ---------------------------------------- | ---------- |
| E-CHAT-01 | Chat/Messenger — Socket.IO chat completo | XL         |
| E-CAL-01  | Calendar — vista mensual/semanal         | L          |
| E-VAC-01  | Vacations — solicitud y aprobación       | L          |
| E-EMP-01  | Employees — directorio y perfiles        | MD         |
| E-INFO-01 | Info Portal — contenido base             | CH         |
| E-SET-01  | Settings — perfil, notificaciones, tema  | MD         |

---

### FASE 5: PULIDO Y ENTREGA — "MVP Shippable" 🔵

**Objetivo:** Performance, accesibilidad, documentación técnica, deployment estable.  
**Milestone GitHub:** `Phase 5 — Polish & Ship`  
**Condición de salida:** Sin bloqueos en workflow crítico, <2s page loads

#### Epics

| Epic      | Descripción                                  | Estimación |
| --------- | -------------------------------------------- | ---------- |
| E-PERF-01 | Performance audit + optimizaciones           | MD         |
| E-A11Y-01 | Accessibility WCAG AA básico                 | CH         |
| E-DOCS-01 | OpenAPI spec + flowcharts                    | MD         |
| E-TEST-01 | Tests unitarios coverage >80% paths críticos | L          |

---

### FASE 6: MOTOR AGILE — "Sprints y Kanban real" 🟠

**Objetivo:** Ciclo ágil completo: Sprint Board, Planning, Burndown, Velocity, Backlog priorizado.  
**Milestone GitHub:** `Phase 6 — Agile Engine`  
**Condición de salida:** Un sprint completo se puede crear, planificar, ejecutar y cerrar con datos reales.

#### Epics

| Epic       | Descripción                                                                                                                        | Estimación |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| E-AGILE-01 | Sprint Board — Vista dedicada de sprint activo con columnas (Todo, In Progress, Review, Done), drag-and-drop, filtros por assignee | XL         |
| E-AGILE-02 | Burndown + Velocity Charts — Gráficos de burndown por sprint, velocity chart跨 sprints, chart.js o recharts                        | L          |
| E-AGILE-03 | Sprint Lifecycle — Endpoints: POST /sprints/:id/start, PATCH /sprints/:id/complete, report de sprint completado                    | MD         |
| E-AGILE-04 | Backlog Prioritization — BacklogPage funcional con drag-reorder, asignación a sprint, estimación por story points                  | L          |
| E-FIX-008  | Fix Sprint model — Agregar project, team, companyId al schema Sprint                                                               | CH         |
| E-FIX-010  | Service Layer — Crear taskService.ts, projectService.ts, teamService.ts, sprintService.ts, migrar hooks                            | MD         |

---

### FASE 7: PARIDAD CLICKUP — "Mini pero poderoso" 🟣

**Objetivo:** Aproximarse a ClickUp en features esenciales: vistas múltiples, subtasks, time tracking, notificaciones, automations.  
**Milestone GitHub:** `Phase 7 — ClickUp Parity`  
**Condición de salida:** Un usuario puede gestionar proyectos con vistas Board+List, crear subtasks, trackear tiempo, y recibir notificaciones.

#### Epics

| Epic       | Descripción                                                                                          | Estimación |
| ---------- | ---------------------------------------------------------------------------------------------------- | ---------- |
| E-VIEW-01  | List/Table View — Vista de tabla tipo spreadsheet para tareas, columnas configurables, sort + filter | XL         |
| E-TASK-05  | Subtasks + Checklists — Modelo Subtask con checklist dentro de tarea, drag-reorder, progreso %       | L          |
| E-TASK-06  | Dependencies — Task dependencies (blocks/blocked_by), visualización en board, validación de ciclos   | MD         |
| E-TIME-01  | Time Tracking — Timer start/stop por tarea, timesheets, reporte de tiempo por usuario/proyecto       | L          |
| E-NOTIF-02 | In-app Notification System — Badge count, notification center, Socket.IO real-time, mark as read     | MD         |
| E-AUTO-01  | Automation Rules — If-Then rules básicas (status change → assign, due date → notify)                 | XL         |
| E-TEMPL-01 | Project Templates — Plantillas reutilizables para crear proyectos con estructura predefinida         | MD         |
| E-GANTT-01 | Gantt View — Timeline visual con dependencias, drag para adjustar fechas                             | XL         |

---

## 📊 Resumen de Esfuerzo

| Fase                        | Epics  | Estimación   | Prioridad     | Estado         |
| --------------------------- | ------ | ------------ | ------------- | -------------- |
| **Phase 0: Rescue**         | 4      | ~1 día       | 🔴 Inmediata  | ✅ Completada  |
| **Phase 1: API Foundation** | 5      | ~3 días      | 🔴 Alta       | ✅ Completada  |
| **Phase 2: Core Screens**   | 5      | ~5 días      | 🟡 Alta       | ✅ Completada  |
| **Phase 3: Workflow**       | 5      | ~4 días      | 🟡 Media-Alta | 🟡 En progreso |
| **Phase 4: Secondary**      | 6      | ~6 días      | 🟢 Media      | ⏳ Pendiente   |
| **Phase 5: Polish**         | 4      | ~2 días      | 🔵 Baja       | ⏳ Pendiente   |
| **Phase 6: Agile Engine**   | 6      | ~8 días      | 🟠 Alta       | ⏳ Pendiente   |
| **Phase 7: ClickUp Parity** | 8      | ~14 días     | 🟣 Media      | ⏳ Pendiente   |
| **TOTAL**                   | **43** | **~43 días** | —             | —              |

---

## 🔗 Dependencias Críticas

```
Phase 0 (Rescue) ✅
    └─► Phase 1 (API Foundation) ✅
            └─► Phase 2 (Core Screens) ✅
                    ├─► Phase 3 (Workflow) 🟡 EN PROGRESO
                    │       └─► Phase 4 (Secondary) ⏳
                    │               └─► Phase 5 (Polish) ⏳
                    │                       └─► Phase 6 (Agile Engine) ⏳
                    │                               └─► Phase 7 (ClickUp Parity) ⏳
                    └─► [PARALELO] Phase 4 secondary screens no-dependientes
                        (Employees, Info Portal, Settings — sin dependencia de Tasks/Workflow)
```

**Nuevas dependencias FASE 6 → 7:**

- E-AGILE-01 (Sprint Board) depende de E-AGILE-04 (Backlog priorizado)
- E-AGILE-03 (Sprint Lifecycle) depende de E-FIX-008 (Sprint model fix)
- E-VIEW-01 (List/Table View) requiere E-TASK-01 (Tasks API) ✅ ya completado
- E-TIME-01 (Time Tracking) depende de E-AGILE-03 (Sprint Lifecycle)
- E-AUTO-01 (Automation) depende de E-NOTIF-02 (Notificaciones)

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

| Herramienta                          | Estado                 | Uso                                                                            |
| ------------------------------------ | ---------------------- | ------------------------------------------------------------------------------ |
| Figma MCP (`IOYnTnClPHrmSnWFlKh96O`) | ⚠️ Auth issue          | Diseño de referencia                                                           |
| GitHub Issues API                    | ✅ Disponible          | Tracking de tasks                                                              |
| MongoDB 8.2 local                    | ✅ Running             | DB de desarrollo                                                               |
| Socket.IO                            | ✅ Configurado         | Realtime                                                                       |
| @dnd-kit                             | ✅ Instalado y en uso  | Kanban + Stories drag-and-drop                                                 |
| @tanstack/react-query                | ✅ Instalado (sin uso) | Cache y fetching                                                               |
| zustand                              | ✅ Instalado (sin uso) | State management                                                               |
| recharts                             | ❌ No instalado        | Gráficos Burndown/Velocity                                                     |
| chart.js                             | ❌ No instalado        | Alternativa para gráficos                                                      |
| TipTap                               | ✅ Instalado           | WYSIWYG en ProjectDocument                                                     |
| Glassmorphism CSS                    | ✅ Completo            | .glass, .glass-card, .glass-input, .glass-button, .glass-modal, .glass-sidebar |

---

_Documento actualizado: 2026-05-06 | Audit: Copilot Agent | Basado en exploración completa del codebase + análisis de paridad ClickUp_
