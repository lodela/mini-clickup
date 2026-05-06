# Mini ClickUp — Épicas, Historias y Criterios de Aceptación

**Versión:** 3.0.0  
**Fecha:** 2026-05-06  
**Referencia:** 13_Roadmap_Rescate_MVP.md | Figma: IOYnTnClPHrmSnWFlKh96O

---

## FASE 0 — RESCATE

---

### EPIC E-RESCUE-01: Fix Bugs P0 en Backend

**Descripción:** Tres bugs críticos bloquean cualquier operación de escritura en el backend.  
**Labels GitHub:** `type: epic`, `phase: rescue`, `priority: P0-critical`, `domain: backend`

#### Story RES-01-S01: Fix DELETE /api/teams/:id (500 Error)

**Descripción:** Al confirmar la eliminación de un equipo, el endpoint devuelve 500 Internal Server Error. Visible en dev tools: `DELETE http://localhost:5000/api/teams/{id}`.

**Archivos afectados:**

- `server/src/routes/team.ts`
- `server/src/controllers/teamController.ts` (verificar)
- `server/src/services/teamService.ts` (verificar)

**Criterios de Aceptación:**

- [ ] `DELETE /api/teams/:id` devuelve 200 cuando el usuario es owner
- [ ] `DELETE /api/teams/:id` devuelve 403 cuando el usuario no es owner
- [ ] `DELETE /api/teams/:id` devuelve 404 cuando el team no existe
- [ ] La UI cierra el modal y remueve el team de la lista al confirmarse
- [ ] El test `should delete team` pasa en `server/tests/team.test.ts`
- [ ] No se lanzan errores 500 bajo uso normal

---

#### Story RES-01-S02: Fix middleware `authenticate` (sin paréntesis)

**Descripción:** En las rutas de projects, tasks y sprint, `authenticate` se usa sin invocar (`authenticate` en lugar de `authenticate()`), lo que hace que el middleware nunca se ejecute correctamente.

**Archivos afectados:**

- `server/src/routes/projects.ts`
- `server/src/routes/tasks.ts`
- `server/src/routes/sprint.ts`

**Criterios de Aceptación:**

- [ ] Todas las rutas protegidas usan `authenticate()` (con paréntesis)
- [ ] Un request sin token a `/api/projects` devuelve 401
- [ ] Un request sin token a `/api/tasks` devuelve 401
- [ ] Un request sin token a `/api/sprint` devuelve 401
- [ ] Un request con token válido pasa el middleware y llega al controller

---

#### Story RES-01-S03: Pasar los 12 tests fallidos de Teams

**Descripción:** 12 de 33 tests en `server/tests/team.test.ts` fallan. Deben pasar todos antes de avanzar.

**Criterios de Aceptación:**

- [ ] `npm run test:run --prefix server` → 33/33 tests pass
- [ ] No hay `describe.skip` o `it.skip` para ocultar fallos
- [ ] Los tests de permisos (owner vs member) pasan correctamente
- [ ] Los tests de invitación de miembros pasan

---

### EPIC E-RESCUE-02: Estabilizar Build TypeScript

**Labels GitHub:** `type: epic`, `phase: rescue`, `priority: P0-critical`, `domain: frontend`

#### Story RES-02-S01: Fix errores de TypeScript en el build

**Descripción:** `npm run build` falla con errores de TypeScript. Deben resolverse sin usar `any` como escape.

**Criterios de Aceptación:**

- [ ] `npm run build` completa sin errores
- [ ] `npm run typecheck --prefix server` → 0 errores
- [ ] `npm run typecheck --prefix client` → 0 errores
- [ ] No se agregan `// @ts-ignore` o `as any` sin comentario TODO explicativo

---

#### Story RES-02-S02: Reconciliar árbol dashboard duplicado

**Descripción:** Existe un árbol completo en `pages/dashboard/app/` (código legado) que duplica funcionalidad con `DashboardPage.tsx`. Debe decidirse cuál conservar y eliminar el otro.

**Decisión:** Conservar `DashboardPage.tsx` como punto de entrada + extraer los componentes útiles de `pages/dashboard/app/` que estén bien implementados.

**Criterios de Aceptación:**

- [ ] Solo existe una versión canónica del Dashboard
- [ ] La ruta `/dashboard` renderiza la versión correcta
- [ ] La ruta `/dashboard-2` es eliminada del router
- [ ] No hay imports rotos por la consolidación
- [ ] El build sigue pasando después de la consolidación

---

### EPIC E-RESCUE-03: Unificar Cliente API

**Labels GitHub:** `type: epic`, `phase: rescue`, `priority: P1-high`, `domain: frontend`

#### Story RES-03-S01: Migrar hooks de axios a services/api.ts

**Descripción:** `useTasks.ts`, `useProjects.ts`, `useSprints.ts` usan `axios` directamente. Deben migrar al cliente centralizado en `services/api.ts`.

**Criterios de Aceptación:**

- [ ] Ningún hook importa `axios` directamente
- [ ] Todos los hooks usan `import api from '@/services/api'`
- [ ] El manejo de errores es consistente con el resto del codebase
- [ ] Los interceptores de token/refresh funcionan para todos los requests

---

## FASE 1 — FUNDACIÓN API

---

### EPIC E-PROJ-01: Projects API CRUD

**Labels GitHub:** `type: epic`, `phase: api-foundation`, `priority: P1-high`, `domain: projects`

#### Story PROJ-01-S01: Crear modelo Mongoose de Project

**Archivos a crear:** `server/src/models/Project.ts`

**Schema:**

```typescript
{
  name: string (required, max 100)
  description?: string (max 500)
  code: string (auto-generated, e.g. PN0001265)
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'paused' | 'completed' | 'archived'
  team: ObjectId (ref: Team)
  owner: ObjectId (ref: User)
  members: ObjectId[] (ref: User)
  avatar?: string
  dueDate?: Date
  createdAt, updatedAt (timestamps)
}
```

**Criterios de Aceptación:**

- [ ] Schema creado con todos los campos especificados
- [ ] Validaciones en campos requeridos
- [ ] Índices en `team`, `owner`, `status`
- [ ] Método `toJSON` omite campos internos
- [ ] TypeScript interface exportada desde el modelo

---

#### Story PROJ-01-S02: Controller, Service y Routes de Projects

**Archivos a crear:**

- `server/src/controllers/projectController.ts`
- `server/src/services/projectService.ts`
- `server/src/routes/projects.ts`

**Endpoints:**

```
GET    /api/projects              → Listar proyectos del usuario (paginado)
POST   /api/projects              → Crear proyecto
GET    /api/projects/:id          → Obtener proyecto por ID
PATCH  /api/projects/:id          → Actualizar proyecto
DELETE /api/projects/:id          → Eliminar proyecto (owner only)
GET    /api/projects/:id/members  → Miembros del proyecto
POST   /api/projects/:id/members  → Agregar miembro
```

**Criterios de Aceptación:**

- [ ] Todos los endpoints requieren autenticación (`authenticate()`)
- [ ] `GET /api/projects` devuelve solo proyectos del equipo del usuario
- [ ] `POST /api/projects` valida con Zod y persiste en MongoDB
- [ ] `DELETE /api/projects/:id` requiere ser owner
- [ ] Respuestas usan `{ data, message, pagination? }` consistentemente
- [ ] Errores retornan códigos HTTP apropiados (400, 401, 403, 404, 422, 500)
- [ ] No hay datos mock en ningún endpoint

---

### EPIC E-TASK-01: Tasks API CRUD

**Labels GitHub:** `type: epic`, `phase: api-foundation`, `priority: P1-high`, `domain: tasks`

#### Story TASK-01-S01: Modelo Task con Workflow Fields

**Archivos a crear/modificar:** `server/src/models/Task.ts`

**Schema extendido:**

```typescript
{
  title: string (required)
  description?: string
  type: 'task' | 'bug' (default: 'task')
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'qa' | 'approved' | 'rejected'
  priority: 'low' | 'medium' | 'high' | 'critical'
  project: ObjectId (ref: Project)
  assignee?: ObjectId (ref: User)
  reporter: ObjectId (ref: User)
  tags: string[]
  dueDate?: Date
  estimatedHours?: number
  loggedHours?: number
  sprintId?: ObjectId
  qaRejectionReason?: string
  timeInQA?: number
  parentTask?: ObjectId (para bugs vinculados a task)
  comments: Comment[]
  attachments: Attachment[]
  order: number (para Kanban ordering)
}
```

**Criterios de Aceptación:**

- [ ] Schema con todos los campos de workflow
- [ ] Validaciones de transición de estado (no puede saltar pasos)
- [ ] Índices en `project`, `assignee`, `status`, `sprintId`
- [ ] TypeScript interfaces exportadas

---

#### Story TASK-01-S02: Controller, Service y Routes de Tasks

**Endpoints:**

```
GET    /api/tasks                → Listar tasks (con filtros: status, assignee, project)
POST   /api/tasks                → Crear task
GET    /api/tasks/:id            → Obtener task con comentarios
PATCH  /api/tasks/:id            → Actualizar task
PATCH  /api/tasks/:id/status     → Cambiar status (con validación de workflow)
DELETE /api/tasks/:id            → Eliminar task
POST   /api/tasks/:id/comments   → Agregar comentario
POST   /api/tasks/:id/qa-review  → Aprobar o rechazar en QA
```

**Criterios de Aceptación:**

- [ ] Todos los endpoints protegidos con `authenticate()`
- [ ] `PATCH /api/tasks/:id/status` valida transiciones legales
- [ ] `POST /api/tasks/:id/qa-review` solo accesible por rol `admin` o `qa`
- [ ] Comentarios se agregan sin reemplazar los existentes
- [ ] Datos paginados en listados
- [ ] Socket.IO emite `task:status-changed` al cambiar estado

---

### EPIC E-DASH-01: Dashboard con Datos Reales

**Labels GitHub:** `type: epic`, `phase: api-foundation`, `priority: P1-high`, `domain: dashboard`

#### Story DASH-01-S01: Endpoint de estadísticas del Dashboard

**Endpoint:**

```
GET /api/dashboard/stats → { totalTasks, activeTasks, completedTasks, overdueTasks, myTasks, teamWorkload[], recentActivity[] }
```

**Criterios de Aceptación:**

- [ ] Responde en <200ms para conjuntos de datos normales
- [ ] `teamWorkload` incluye tasks por miembro
- [ ] `recentActivity` incluye últimas 10 acciones ordenadas por fecha
- [ ] Datos filtrados al equipo/proyectos del usuario autenticado

---

## FASE 2 — PANTALLAS CORE

---

### EPIC E-DASH-02: Dashboard Figma-Accurate

**Labels GitHub:** `type: epic`, `phase: core-screens`, `priority: P1-high`, `domain: dashboard`

**Referencia visual:** Screenshot `DashboardPage.jpg` (Figma CRM Workroom Community)

#### Story DASH-02-S01: Layout principal del Dashboard

**Estructura (de Figma):**

```
Header: [Search] [Notification Bell] [User Avatar ▼]
Greeting: "Welcome back, {name}!"
Title: "Dashboard" + [Date Range Picker]

Main Grid (2 cols):
├── Col Izquierda (70%):
│   ├── Workload Widget (View all →)
│   │   └── Grid 4x2 de employee cards (avatar, name, role, level badge)
│   └── Projects Widget (View all →)
│       └── Lista de proyectos (code, name, priority badge, all/active tasks, assignees avatars)
└── Col Derecha (30%):
    ├── Nearest Events Widget (View all →)
    │   └── Lista de eventos (title, date/time, duration, priority arrow)
    └── Activity Stream
        └── Feed de actividad (avatar, nombre, acción, timestamp)
```

**Criterios de Aceptación:**

- [ ] Layout matches Figma en desktop (>1024px)
- [ ] Layout responsive en móvil (columnas apiladas)
- [ ] Workload widget muestra empleados reales del equipo
- [ ] Projects widget muestra proyectos reales con stats correctas
- [ ] Nearest Events muestra próximos eventos/deadlines
- [ ] Activity Stream muestra actividad reciente en tiempo real
- [ ] Date range picker funciona y filtra datos
- [ ] Greeting personalizado con nombre del usuario

---

#### Story DASH-02-S02: Workload Widget

**Criterios de Aceptación:**

- [ ] Muestra grid de team members con avatar, nombre, rol, nivel
- [ ] Avatar con fallback a iniciales
- [ ] Nivel badge: Junior / Middle / Senior (configurable por miembro)
- [ ] "View all" navega a `/team` o abre modal de equipo completo
- [ ] Animación de carga (skeleton) mientras carga

---

#### Story DASH-02-S03: Nearest Events Widget

**Criterios de Aceptación:**

- [ ] Muestra eventos del día/mañana primero
- [ ] Indica prioridad con flecha (↑ alta, ↓ baja)
- [ ] Muestra duración estimada
- [ ] Hace click navega al calendario
- [ ] "Today" vs fecha relativa

---

### EPIC E-TASK-03: Kanban Board

**Labels GitHub:** `type: epic`, `phase: core-screens`, `priority: P1-high`, `domain: tasks`

#### Story TASK-03-S01: Board View con columnas

**Columnas:** Todo | In Progress | Review | Done | QA

**Criterios de Aceptación:**

- [ ] Columnas renderizan con cards de tareas correctamente
- [ ] Cada card muestra: título, assignee avatar, priority badge, due date
- [ ] Drag-and-drop entre columnas usando `@dnd-kit`
- [ ] Al soltar card en nueva columna, se actualiza estado via `PATCH /api/tasks/:id/status`
- [ ] La columna "Done" no permite drag-out (transición automática a QA)
- [ ] Cards en "QA" tienen botones Aprobar/Rechazar (solo para admin/qa)
- [ ] Loading state mientras se actualiza

---

#### Story TASK-03-S02: Quick Add Task por columna

**Criterios de Aceptación:**

- [ ] Cada columna tiene botón "+" para agregar task rápida
- [ ] Mini-form in-place: solo título (Enter para crear)
- [ ] La task nueva aparece al final de la columna sin reload
- [ ] Validación mínima: título no vacío

---

#### Story TASK-03-S03: Task Filters

**Criterios de Aceptación:**

- [ ] Filtros: por assignee, priority, tags, due date
- [ ] Multi-select en assignee
- [ ] Estado de filtros persiste en URL (query params)
- [ ] "Clear filters" resetea todo

---

### EPIC E-TASK-04: Task Detail Modal

**Labels GitHub:** `type: epic`, `phase: core-screens`, `priority: P1-high`, `domain: tasks`

#### Story TASK-04-S01: Modal completo de task

**Criterios de Aceptación:**

- [ ] Abre al hacer click en cualquier task card
- [ ] Campos editables: título, descripción, assignee, priority, tags, dueDate
- [ ] Selector de assignee filtra por miembros del equipo
- [ ] Sección de comentarios con input + lista
- [ ] Comentarios nuevos aparecen en tiempo real (Socket.IO)
- [ ] Activity log (quién hizo qué y cuándo)
- [ ] Para bugs: razón de rechazo, link a task original
- [ ] Cierre limpio sin perder cambios (confirm si hay unsaved changes)

---

### EPIC E-UI-01: Atomic UI Components

**Labels GitHub:** `type: epic`, `phase: core-screens`, `priority: P2-medium`, `domain: frontend`

#### Story UI-01-S01: Badge Component

**Criterios de Aceptación:**

- [ ] Variantes: status (todo/in-progress/review/done/qa), priority (low/medium/high/critical), level (Junior/Middle/Senior)
- [ ] Colores del design system
- [ ] Size variants: sm, md, lg
- [ ] Accesible (role="status" o aria-label)

---

#### Story UI-01-S02: Avatar Component

**Criterios de Aceptación:**

- [ ] Muestra imagen si existe, fallback a iniciales
- [ ] Generación determinista de color de fondo por nombre
- [ ] Size variants: xs, sm, md, lg, xl
- [ ] AvatarGroup: muestra N avatares + "+N más"
- [ ] Accesible (alt text con nombre)

---

## FASE 3 — MOTOR DE WORKFLOW

---

### EPIC E-FLOW-01: Task Workflow Engine

**Labels GitHub:** `type: epic`, `phase: workflow`, `priority: P1-high`, `domain: tasks`

#### Story FLOW-01-S01: Máquina de estados de tareas

**Estados válidos y transiciones permitidas:**

```
todo ──► in-progress ──► review ──► done ──► qa (automático)
                                              ├──► approved ──► [sprint backlog]
                                              └──► rejected ──► bug (nueva entidad)
```

**Criterios de Aceptación:**

- [ ] Transiciones inválidas devuelven 422 con mensaje claro
- [ ] Transición `done → qa` es automática (no requiere acción del usuario)
- [ ] Solo usuarios con rol `admin` o `qa` pueden transicionar desde `qa`
- [ ] Historial de estados guardado en el documento
- [ ] Socket.IO emite `task:status-changed` en cada transición

---

### EPIC E-FLOW-02: Bug Entity desde QA Rejection

**Labels GitHub:** `type: epic`, `phase: workflow`, `priority: P1-high`, `domain: tasks`

#### Story FLOW-02-S01: Creación de Bug en rechazo QA

**Criterios de Aceptación:**

- [ ] Al rechazar en QA, se crea automáticamente un task de tipo `bug`
- [ ] El bug hereda: project, assignee original, descripción
- [ ] El bug tiene campo `parentTask` apuntando a la task rechazada
- [ ] El bug tiene campo `qaRejectionReason` con el motivo ingresado
- [ ] La task original queda en estado `rejected`
- [ ] Socket.IO emite `bug:created` con payload `{ bugId, rejectedTaskId, reason }`
- [ ] El bug aparece en el Kanban en columna `Todo` (nuevo ciclo)

---

### EPIC E-NOTIF-01: Sistema de Notificaciones

**Labels GitHub:** `type: epic`, `phase: workflow`, `priority: P2-medium`, `domain: notifications`

#### Story NOTIF-01-S01: Notification Bell en Header

**Criterios de Aceptación:**

- [ ] Ícono de campana en header con badge de contador (no leídas)
- [ ] Click abre dropdown con lista de notificaciones
- [ ] Notificaciones marcadas como leídas al ver el dropdown
- [ ] "Mark all as read" funciona
- [ ] Badge desaparece cuando contador = 0

---

#### Story NOTIF-01-S02: Socket.IO Notification Events

**Eventos a implementar (kebab-case uniformemente):**

```
task-status-changed   → { taskId, oldStatus, newStatus, userId }
task-assigned         → { taskId, assigneeId, assignerId }
task-qa-ready         → { taskId, completedById }
bug-created           → { bugId, rejectedTaskId, reason }
comment-added         → { taskId, commentId, authorId }
```

**Criterios de Aceptación:**

- [ ] Todos los eventos usan kebab-case (eliminar colon-notation)
- [ ] Los eventos solo se emiten al room del team/project correcto
- [ ] El cliente recibe notificaciones sin recargar la página
- [ ] Las notificaciones se persisten en MongoDB

---

### EPIC E-BACK-01: Backlog y Sprint Planning

**Labels GitHub:** `type: epic`, `phase: workflow`, `priority: P2-medium`, `domain: backlog`

#### Story BACK-01-S01: Backlog View

**Criterios de Aceptación:**

- [ ] Ruta `/backlog` muestra tasks aprobadas en QA sin sprint asignado
- [ ] Drag-and-drop para reordenar prioridad
- [ ] Asignar item a sprint activo con selector
- [ ] Crear nuevo sprint desde la vista

---

## FASE 4 — PANTALLAS SECUNDARIAS

---

### EPIC E-CHAT-01: Chat / Messenger

**Labels GitHub:** `type: epic`, `phase: secondary-screens`, `priority: P2-medium`, `domain: chat`

#### Story CHAT-01-S01: Chat en tiempo real por equipo

**Criterios de Aceptación:**

- [ ] Ruta `/chat` o sidebar item "Messenger" navega al chat
- [ ] Rooms por equipo (join/leave automático)
- [ ] Mensajes en tiempo real via Socket.IO (`chat-message`, `chat-message-received`)
- [ ] Indicador "escribiendo..." con debounce
- [ ] Historial de mensajes paginado (scroll infinito hacia arriba)
- [ ] Contador de mensajes no leídos en sidebar
- [ ] Timestamps en mensajes

---

### EPIC E-CAL-01: Calendar de Vacaciones y Eventos

**Labels GitHub:** `type: epic`, `phase: secondary-screens`, `priority: P2-medium`, `domain: calendar`

#### Story CAL-01-S01: Vista de Calendario

**Criterios de Aceptación:**

- [ ] Vista mensual con navegación (← mes anterior / mes siguiente →)
- [ ] Vista semanal opcional
- [ ] Eventos de vacaciones visibles como bloques de color
- [ ] Click en día abre modal para crear evento/solicitud

---

#### Story CAL-01-S02: Solicitud de Vacaciones

**Criterios de Aceptación:**

- [ ] Form: fecha inicio, fecha fin, tipo (vacation/sick/other), razón
- [ ] Owner/admin puede aprobar o rechazar
- [ ] Notificación al solicitante al aprobar/rechazar
- [ ] Vacaciones aprobadas bloquean la disponibilidad en el workload del dashboard

---

### EPIC E-EMP-01: Directorio de Empleados

**Labels GitHub:** `type: epic`, `phase: secondary-screens`, `priority: P3-low`, `domain: employees`

#### Story EMP-01-S01: Listado de empleados del equipo

**Criterios de Aceptación:**

- [ ] Grid/lista de todos los miembros del equipo
- [ ] Avatar, nombre, rol, nivel, tareas activas
- [ ] Click en empleado abre perfil detallado
- [ ] Filtro por rol/nivel

---

### EPIC E-SET-01: Configuración de Usuario

**Labels GitHub:** `type: epic`, `phase: secondary-screens`, `priority: P3-low`, `domain: settings`

#### Story SET-01-S01: Perfil de usuario

**Criterios de Aceptación:**

- [ ] Editar nombre, avatar, email
- [ ] Cambiar contraseña (requiere contraseña actual)
- [ ] Seleccionar idioma (en/es)
- [ ] Toggle tema claro/oscuro
- [ ] Preferencias de notificaciones (qué notificaciones recibir)

---

## FASE 5 — PULIDO Y ENTREGA

---

### EPIC E-DOCS-01: Documentación Técnica

**Labels GitHub:** `type: epic`, `phase: polish`, `priority: P2-medium`, `domain: docs`

#### Story DOCS-01-S01: OpenAPI Specification

**Criterios de Aceptación:**

- [ ] Spec OpenAPI 3.0 en `docs/openapi.yaml`
- [ ] Todos los endpoints documentados con params, responses, ejemplos
- [ ] Schemas de error consistentes
- [ ] Auth (Bearer JWT) documentado
- [ ] Valida contra OpenAPI 3.0 standard

---

#### Story DOCS-01-S02: Workflow Flowcharts

**Criterios de Aceptación:**

- [ ] Mermaid diagram: Task lifecycle (Todo → ... → Approved/Bug)
- [ ] Mermaid diagram: Notification flow
- [ ] Mermaid diagram: Auth flow
- [ ] Guardados en `docs/flowcharts.md`

---

## 📋 Resumen de Issues a Crear en GitHub

| Epic ID     | Stories               | Milestone                   |
| ----------- | --------------------- | --------------------------- |
| E-RESCUE-01 | RES-01-S01, S02, S03  | Phase 0 — Rescue            |
| E-RESCUE-02 | RES-02-S01, S02       | Phase 0 — Rescue            |
| E-RESCUE-03 | RES-03-S01            | Phase 0 — Rescue            |
| E-PROJ-01   | PROJ-01-S01, S02      | Phase 1 — API Foundation    |
| E-TASK-01   | TASK-01-S01, S02      | Phase 1 — API Foundation    |
| E-DASH-01   | DASH-01-S01           | Phase 1 — API Foundation    |
| E-DASH-02   | DASH-02-S01, S02, S03 | Phase 2 — Core Screens      |
| E-TASK-03   | TASK-03-S01, S02, S03 | Phase 2 — Core Screens      |
| E-TASK-04   | TASK-04-S01           | Phase 2 — Core Screens      |
| E-UI-01     | UI-01-S01, S02        | Phase 2 — Core Screens      |
| E-FLOW-01   | FLOW-01-S01           | Phase 3 — Workflow Engine   |
| E-FLOW-02   | FLOW-02-S01           | Phase 3 — Workflow Engine   |
| E-NOTIF-01  | NOTIF-01-S01, S02     | Phase 3 — Workflow Engine   |
| E-BACK-01   | BACK-01-S01           | Phase 3 — Workflow Engine   |
| E-CHAT-01   | CHAT-01-S01           | Phase 4 — Secondary Screens |
| E-CAL-01    | CAL-01-S01, S02       | Phase 4 — Secondary Screens |
| E-EMP-01    | EMP-01-S01            | Phase 4 — Secondary Screens |
| E-SET-01    | SET-01-S01            | Phase 4 — Secondary Screens |
| E-DOCS-01   | DOCS-01-S01, S02      | Phase 5 — Polish & Ship     |

**Total: 27 epics | 52 stories**

---

## FASE 6 — MOTOR AGILE

---

### EPIC E-AGILE-01: Sprint Board (vista dedicada de sprint activo)

**Labels GitHub:** `type: epic`, `phase: agile-engine`, `priority: P1-high`, `domain: sprints`

#### Story AGILE-01-S01: Sprint Board Page con columnas DnD

**Criterios de Aceptación:**

- [ ] Ruta `/sprints` muestra el sprint activo con columnas: Todo, In Progress, Review, Done
- [ ] Solo tareas asignadas al sprint activo aparecen en el board
- [ ] Drag-and-drop entre columnas actualiza status en MongoDB via PATCH /tasks/:id/status
- [ ] Filtros por assignee, priority, type
- [ ] Indicador visual de sprint activo (nombre, fechas, días restantes)
- [ ] Sin sprint activo → mensaje "No hay sprint activo" con botón "Crear Sprint"

#### Story AGILE-01-S02: Sprint Board con swimlanes por assignee

**Criterios de Aceptación:**

- [ ] Vista alternativa con swimlanes por assignee
- [ ] Toggle entre vista por status y vista por assignee
- [ ] Tareas sin assignee agrupadas en lane "Unassigned"
- [ ] Responsive: en móvil, swimlanes se convierten en filtros

---

### EPIC E-AGILE-02: Burndown + Velocity Charts

**Labels GitHub:** `type: epic`, `phase: agile-engine`, `priority: P2-medium`, `domain: analytics`

#### Story AGILE-02-S01: Burndown Chart

**Criterios de Aceptación:**

- [ ] Gráfico de burndown por sprint: eje X = días, eje Y = story points restantes
- [ ] Línea ideal (guía) vs línea real
- [ ] Datos calculados desde tareas del sprint (total points - completed points por día)
- [ ] Librería: recharts (preferida) o chart.js
- [ ] Actualización en tiempo real cuando tareas cambian de status

#### Story AGILE-02-S02: Velocity Chart

**Criterios de Aceptación:**

- [ ] Gráfico de velocity: puntos completados por sprint (últimos N sprints)
- [ ] Línea de tendencia (media móvil)
- [ ] Comparación: comprometido vs completado por sprint
- [ ] Hover muestra detalle del sprint

---

### EPIC E-AGILE-03: Sprint Lifecycle (start, complete, report)

**Labels GitHub:** `type: epic`, `phase: agile-engine`, `priority: P1-high`, `domain: sprints`

#### Story AGILE-03-S01: Sprint Start endpoint + UI

**Criterios de Aceptación:**

- [ ] `POST /api/sprints/:id/start` cambia status a `active`, setea `startDate`
- [ ] Validación: solo un sprint activo por proyecto a la vez
- [ ] Sprint activo aparece en sidebar y SprintBoardPage
- [ ] Socket.IO emite `sprint:started` al room del proyecto

#### Story AGILE-03-S02: Sprint Complete endpoint + UI

**Criterios de Aceptación:**

- [ ] `PATCH /api/sprints/:id/complete` cambia status a `completed`, setea `endDate`
- [ ] Mover tareas no completadas al backlog o al siguiente sprint (configurable)
- [ ] Generar reporte: puntos completados, tareas completadas, velocity
- [ ] Socket.IO emite `sprint:completed`

#### Story AGILE-03-S03: Sprint Report

**Criterios de Aceptación:**

- [ ] Vista de reporte post-sprint: puntos completados, tareas, velocity
- [ ] Comparación con sprint anterior
- [ ] Lista de tareas carry-over (no completadas)
- [ ] Exportar reporte como PDF (opcional)

---

### EPIC E-AGILE-04: Backlog Prioritization

**Labels GitHub:** `type: epic`, `phase: agile-engine`, `priority: P1-high`, `domain: backlog`

#### Story AGILE-04-S01: BacklogPage funcional con DnD

**Criterios de Aceptación:**

- [ ] Ruta `/backlog` muestra todas las tareas sin sprint (status: backlog, approved)
- [ ] Drag-and-drop para reordenar prioridad (campo `order`)
- [ ] Asignar tarea a sprint con selector de sprint activo
- [ ] Filtrar por proyecto, tipo, prioridad
- [ ] Estimación rápida: editar story points inline

#### Story AGILE-04-S02: Sprint Planning desde Backlog

**Criterios de Aceptación:**

- [ ] Botón "Start Sprint Planning" crea una vista de planeación
- [ ] Dos paneles: Backlog (izquierda) + Sprint (derecha)
- [ ] Drag de backlog → sprint agrega la tarea al sprint
- [ ] Contador de story points en sprint (vs capacidad del equipo)
- [ ] Confirmar planning inicia el sprint

---

### EPIC E-FIX-008: Fix Sprint Model

**Labels GitHub:** `type: epic`, `phase: agile-engine`, `priority: P0-critical`, `domain: backend`

#### Story FIX-008-S01: Agregar project, team, companyId al Sprint

**Criterios de Aceptación:**

- [ ] Sprint model tiene campos: `project` (ref Project), `team` (ref Team), `companyId` (ref Company)
- [ ] Todos los endpoints de sprint filtran por companyId para multi-tenant
- [ ] GET /sprints?projectId=:id filtra por proyecto
- [ ] Migración de datos existentes (si hay sprints huérfanos)
- [ ] Tests actualizados

---

### EPIC E-FIX-010: Service Layer Migration

**Labels GitHub:** `type: epic`, `phase: agile-engine`, `priority: P1-high`, `domain: refactor`

#### Story FIX-010-S01: Crear servicios faltantes

**Criterios de Aceptación:**

- [ ] `client/src/services/taskService.ts` con CRUD completo via api.ts
- [ ] `client/src/services/projectService.ts` con CRUD completo via api.ts
- [ ] `client/src/services/teamService.ts` con CRUD completo via api.ts
- [ ] `client/src/services/sprintService.ts` con CRUD completo via api.ts
- [ ] Migrar useTasks, useProjects, useTeams, useSprints a usar servicios
- [ ] Eliminar importaciones directas de api.ts en hooks

---

## FASE 7 — PARIDAD CLICKUP

---

### EPIC E-VIEW-01: List/Table View

**Labels GitHub:** `type: epic`, `phase: clickup-parity`, `priority: P2-medium`, `domain: views`

#### Story VIEW-01-S01: Vista de Tabla tipo Spreadsheet

**Criterios de Aceptación:**

- [ ] Ruta `/projects/:id/table` muestra tareas en vista de tabla
- [ ] Columnas: Task, Status, Assignee, Priority, Due Date, Story Points
- [ ] Columnas configurables (mostrar/ocultar)
- [ ] Sort por cualquier columna (click header)
- [ ] Filter por status, assignee, priority, type
- [ ] Inline editing: click en celda para editar status, assignee, etc.
- [ ] Toggle entre Board view y Table view en ProjectDetailPage

---

### EPIC E-TASK-05: Subtasks + Checklists

**Labels GitHub:** `type: epic`, `phase: clickup-parity`, `priority: P2-medium`, `domain: tasks`

#### Story TASK-05-S01: Subtask Model y API

**Criterios de Aceptación:**

- [ ] Modelo Subtask: parentTask (ref Task), title, status, assignee, order
- [ ] CRUD API: POST/GET/PATCH/DELETE /tasks/:taskId/subtasks
- [ ] Progreso de subtasks se calcula en el parent task (subtaskProgress)
- [ ] Socket.IO emite `subtask:created`, `subtask:updated`, `subtask:deleted`

#### Story TASK-05-S02: Checklist dentro de Tarea

**Criterios de Aceptación:**

- [ ] Sección "Checklist" en TaskDetailDialog
- [ ] Agregar items de checklist con título
- [ ] Marcar como completado (checkbox)
- [ ] Drag-reorder de items
- [ ] Progreso visual (3/5 items completados = 60%)
- [ ] Persistido en Task model como array de `{ text, checked, order }`

---

### EPIC E-TASK-06: Dependencies

**Labels GitHub:** `type: epic`, `phase: clickup-parity`, `priority: P3-low`, `domain: tasks`

#### Story TASK-06-S01: Task Dependencies API + UI

**Criterios de Aceptación:**

- [ ] Modelo: Task tiene `dependencies: [{ task: ref, type: 'blocks'|'blocked_by' }]`
- [ ] API: POST/DELETE /tasks/:id/dependencies
- [ ] En TaskDetailDialog: sección "Dependencies" con add/remove
- [ ] Validación de ciclos: no permitir dependencias circulares
- [ ] Indicador visual en Kanban: icono 🔗 para tasks con dependencias
- [ ] Tooltip: "Bloqueado por: Task X, Task Y"

---

### EPIC E-TIME-01: Time Tracking

**Labels GitHub:** `type: epic`, `phase: clickup-parity`, `priority: P2-medium`, `domain: time`

#### Story TIME-01-S01: Timer por Tarea

**Criterios de Aceptación:**

- [ ] Botón "Start Timer" en TaskDetailDialog
- [ ] Timer visible en header/sidebar cuando está corriendo
- [ ] Pausar/reanudar timer
- [ ] Al cerrar tarea con timer corriendo, ofrecer opción de detener o dejar en background
- [ ] Log de tiempo: entrada en TimeLog model (taskId, userId, startTime, endTime, duration, description)
- [ ] API: POST /tasks/:id/time-entries, GET /tasks/:id/time-entries

#### Story TIME-01-S02: Timesheets y Reportes

**Criterios de Aceptación:**

- [ ] Ruta `/time-tracking` muestra vista de timesheets
- [ ] Filtro por usuario, proyecto, rango de fechas
- [ ] Total de horas por tarea, por usuario, por proyecto
- [ ] Exportar como CSV

---

### EPIC E-NOTIF-02: In-app Notification System

**Labels GitHub:** `type: epic`, `phase: clickup-parity`, `priority: P1-high`, `domain: notifications`

#### Story NOTIF-02-S01: Notification Model + API

**Criterios de Aceptación:**

- [ ] Modelo Notification: userId, type, title, message, read, link, createdAt
- [ ] API: GET /notifications (paginado), PATCH /notifications/:id/read, PATCH /notifications/read-all
- [ ] Socket.IO: emitir `notification:new` en tiempo real
- [ ] Tipos: task-assigned, task-status-changed, comment-added, sprint-started, sprint-completed, mention

#### Story NOTIF-02-S02: Notification Center UI

**Criterios de Aceptación:**

- [ ] Bell icon en HeaderOrganism con badge contador (no leídas)
- [ ] Dropdown con lista de notificaciones (últimas 20)
- [ ] Click en notificación navega al recurso (task, project, sprint)
- [ ] "Mark all as read" funciona
- [ ] Notificaciones agrupadas por tipo (ej: "3 tareas asignadas")
- [ ] Página completa `/notifications` con historial paginado

---

### EPIC E-AUTO-01: Automation Rules

**Labels GitHub:** `type: epic`, `phase: clickup-parity`, `priority: P3-low`, `domain: automation`

#### Story AUTO-01-S01: If-Then Rules Engine

**Criterios de Aceptación:**

- [ ] Modelo AutomationRule: trigger, conditions, actions, enabled, projectId
- [ ] Triggers: task-status-changed, task-assigned, due-date-approaching
- [ ] Actions: change-status, assign-user, send-notification, move-to-sprint
- [ ] UI: formulario visual para crear reglas (trigger → conditions → actions)
- [ ] Reglas se ejecutan en el service layer al ocurrir el trigger
- [ ] Limitado a 5 reglas por proyecto en MVP

---

### EPIC E-TEMPL-01: Project Templates

**Labels GitHub:** `type: epic`, `phase: clickup-parity`, `priority: P3-low`, `domain: projects`

#### Story TEMPL-01-S01: Plantillas de Proyecto

**Criterios de Aceptación:**

- [ ] Modelo ProjectTemplate: name, description, structure (epics, default tasks)
- [ ] API: CRUD /project-templates
- [ ] Al crear proyecto, opción "Desde plantilla"
- [ ] Plantilla crea: epics, stories placeholder, configuración de status
- [ ] Plantillas predefinidas: "Software Sprint", "Marketing Campaign", "Product Launch"
- [ ] Admin puede crear plantillas personalizadas

---

### EPIC E-GANTT-01: Gantt View

**Labels GitHub:** `type: epic`, `phase: clickup-parity`, `priority: P3-low`, `domain: views`

#### Story GANTT-01-S01: Vista Timeline/Gantt

**Criterios de Aceptación:**

- [ ] Ruta `/projects/:id/gantt` muestra vista timeline
- [ ] Barras horizontales representan tareas con fecha inicio/fin
- [ ] Drag para adjustar fechas
- [ ] Dependencias mostradas como flechas entre barras
- [ ] Zoom: día, semana, mes
- [ ] Librería: preferir `@bryntum/gantt` o `frappe-gantt`
- [ ] Solo disponible si tarea tiene `startDate` y `dueDate`

---

## 📋 Resumen de Issues a Crear en GitHub

| Epic ID     | Stories                | Milestone                   |
| ----------- | ---------------------- | --------------------------- |
| E-RESCUE-01 | RES-01-S01, S02, S03   | Phase 0 — Rescue            |
| E-RESCUE-02 | RES-02-S01, S02        | Phase 0 — Rescue            |
| E-RESCUE-03 | RES-03-S01             | Phase 0 — Rescue            |
| E-PROJ-01   | PROJ-01-S01, S02       | Phase 1 — API Foundation    |
| E-TASK-01   | TASK-01-S01, S02       | Phase 1 — API Foundation    |
| E-DASH-01   | DASH-01-S01            | Phase 1 — API Foundation    |
| E-DASH-02   | DASH-02-S01, S02, S03  | Phase 2 — Core Screens      |
| E-TASK-03   | TASK-03-S01, S02, S03  | Phase 2 — Core Screens      |
| E-TASK-04   | TASK-04-S01            | Phase 2 — Core Screens      |
| E-UI-01     | UI-01-S01, S02         | Phase 2 — Core Screens      |
| E-FLOW-01   | FLOW-01-S01            | Phase 3 — Workflow Engine   |
| E-FLOW-02   | FLOW-02-S01            | Phase 3 — Workflow Engine   |
| E-NOTIF-01  | NOTIF-01-S01, S02      | Phase 3 — Workflow Engine   |
| E-BACK-01   | BACK-01-S01            | Phase 3 — Workflow Engine   |
| E-CHAT-01   | CHAT-01-S01            | Phase 4 — Secondary Screens |
| E-CAL-01    | CAL-01-S01, S02        | Phase 4 — Secondary Screens |
| E-EMP-01    | EMP-01-S01             | Phase 4 — Secondary Screens |
| E-SET-01    | SET-01-S01             | Phase 4 — Secondary Screens |
| E-DOCS-01   | DOCS-01-S01, S02       | Phase 5 — Polish & Ship     |
| E-AGILE-01  | AGILE-01-S01, S02      | Phase 6 — Agile Engine      |
| E-AGILE-02  | AGILE-02-S01, S02      | Phase 6 — Agile Engine      |
| E-AGILE-03  | AGILE-03-S01, S02, S03 | Phase 6 — Agile Engine      |
| E-AGILE-04  | AGILE-04-S01, S02      | Phase 6 — Agile Engine      |
| E-FIX-008   | FIX-008-S01            | Phase 6 — Agile Engine      |
| E-FIX-010   | FIX-010-S01            | Phase 6 — Agile Engine      |
| E-VIEW-01   | VIEW-01-S01            | Phase 7 — ClickUp Parity    |
| E-TASK-05   | TASK-05-S01, S02       | Phase 7 — ClickUp Parity    |
| E-TASK-06   | TASK-06-S01            | Phase 7 — ClickUp Parity    |
| E-TIME-01   | TIME-01-S01, S02       | Phase 7 — ClickUp Parity    |
| E-NOTIF-02  | NOTIF-02-S01, S02      | Phase 7 — ClickUp Parity    |
| E-AUTO-01   | AUTO-01-S01            | Phase 7 — ClickUp Parity    |
| E-TEMPL-01  | TEMPL-01-S01           | Phase 7 — ClickUp Parity    |
| E-GANTT-01  | GANTT-01-S01           | Phase 7 — ClickUp Parity    |

**Total: 33 epics | 52 stories**
