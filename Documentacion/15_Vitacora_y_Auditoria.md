# 15 — Vitácora de Actividad & Auditoría

**Versión:** 1.0  
**Fecha:** 2026-04-29  
**Estado:** 📐 Diseño aprobado — pendiente implementación  
**Autor:** GitHub Copilot (NLodela Orchestrator)  
**Sesión de origen:** Solicitud del PM · Sprint 1 Review

---

## 1. Contexto y Motivación

El PM requiere un **registro exhaustivo y auditable de toda actividad de usuarios** dentro de Mini ClickUp:

> *"Saber cuándo entró un usuario, a qué sección, qué tarea abrió, la asignó a otro usuario, hizo priorizaciones del backlog, escribió notas en tareas, autorizó un diseño y salió de la app."*

Este documento define el diseño completo del sistema de vitácora:
arquitectura, esquema de datos, catálogo de eventos, estrategia de implementación y API de consulta.

---

## 2. Estado Actual — Gap Analysis

El modelo `ActionLog` **ya existe** (`server/src/models/ActionLog.ts`) pero es rudimentario:

| Aspecto | Estado actual | Requerido |
|---------|--------------|-----------|
| Tipos de acción | 6: `CREATE\|UPDATE\|DELETE\|LOGIN\|LOGOUT\|UPLOAD` | 40+ acciones específicas |
| Categorías | ❌ No existe | `auth`, `task`, `project`, `team`, `settings`, `navigation` |
| Contexto de equipo/proyecto | ❌ No existe | `teamId`, `projectId` para filtros multi-tenant |
| Resultado (éxito/falla) | ❌ No existe | `result: 'success' | 'failure' | 'partial'` |
| Diff before/after | `changes` como `Mixed` sin estructura | `metadata.before`, `metadata.after`, `metadata.changes[]` |
| Cobertura actual | `company`, `department`, `team` (parcial) | Todos los controllers + auth |
| Auth events | ❌ Login/logout NO se registra | Obligatorio (login, logout, intentos fallidos) |
| Task events | ❌ No se registra | Crítico (create, assign, status-change, comment) |
| Project/Sprint events | ❌ No se registra | Requerido |
| Indexes | ❌ Ninguno | Al menos 6 índices compuestos |
| TTL / retención | ❌ No existe | TTL configurable (90 días por defecto) |

**Decisión de arquitectura:** Evolucionar `ActionLog` de forma retrocompatible — no reemplazar.

---

## 3. Referencias y Estándares Aplicados

### 3.1 W3C ActivityStreams 2.0
El modelo **Actor → Verbo → Objeto** es el estándar global para describir actividad en aplicaciones sociales y de productividad. Define:
- **Actor**: quién realiza la acción (usuario, sistema)
- **Activity**: el verbo (Create, Update, Delete, Assign, Approve, etc.)
- **Object**: el recurso afectado (Task, Project, Team, User)
- **Target**: el contexto (el proyecto al que pertenece la tarea)

### 3.2 OWASP Logging Cheat Sheet
Todo evento debe capturar **WHEN · WHO · WHERE · WHAT**:
- `timestamp` — cuándo (UTC ISO 8601)
- `actor._id`, `actor.name`, `ipAddress`, `userAgent` — quién
- `category`, `entity`, `entityId` — dónde/qué recurso
- `action`, `details`, `result`, `metadata.changes` — qué ocurrió

**Nunca registrar:** contraseñas, tokens, datos bancarios, session IDs completos.

### 3.3 Martin Fowler — Audit Log Pattern
> *"Any time something significant happens you write some record indicating what happened and when it happened."*

La simpleza es una virtud. Escribir rápido, sin bloquear el flujo principal (**fire-and-forget**).

### 3.4 Mongoose Middleware (post-save hooks)
Para entidades clave, los hooks de Mongoose son una capa no-intrusiva. Sin embargo, carecen de contexto del request (actor, IP). La solución es combinarlos con `AsyncLocalStorage`.

---

## 4. Arquitectura del Sistema

```
Request HTTP
     │
     ▼
[requestContextMiddleware]           ← AsyncLocalStorage: { userId, ip, userAgent, teamId }
     │
     ▼
[Controller] ──► [Service] ──► [activityLogService.log()]
                                      │
                                      ▼ (fire-and-forget, setImmediate)
                               [ActionLog.create()]
                                      │
                                      ├──► MongoDB (colección activity_logs)
                                      │
                                      └──► Socket.IO emit('activity:logged') → team room
```

### Principios de diseño
1. **Fire-and-forget**: el logging no bloquea ni retrasa el response del request
2. **AsyncLocalStorage**: el contexto del actor (userId, ip) se propaga automáticamente sin pasarlo por parámetros
3. **Explícito en servicios**: no magia oculta — cada servicio llama `activityLogService.log()` intencionalmente
4. **Fail-safe**: si el log falla, se captura en `console.error` pero NO se propaga al request
5. **Retrocompatibilidad**: los `ActionLog.create()` existentes siguen funcionando

---

## 5. Schema Evolutivo — ActionLog v2

```typescript
// server/src/models/ActionLog.ts (versión evolutiva)

export type ActionCategory =
  | 'auth'
  | 'task'
  | 'project'
  | 'team'
  | 'sprint'
  | 'company'
  | 'settings'
  | 'navigation'
  | 'admin';

export type ActionVerb =
  // Auth
  | 'user.login'
  | 'user.login_failed'
  | 'user.logout'
  | 'user.register'
  | 'user.password_changed'
  | 'user.password_reset_requested'
  | 'user.temp_password_used'
  // Task
  | 'task.created'
  | 'task.updated'
  | 'task.deleted'
  | 'task.status_changed'
  | 'task.assigned'
  | 'task.unassigned'
  | 'task.priority_changed'
  | 'task.commented'
  | 'task.comment_deleted'
  | 'task.converted_to_bug'
  | 'task.moved_to_sprint'
  | 'task.qa_approved'
  | 'task.due_date_set'
  | 'task.tag_added'
  | 'task.attachment_added'
  // Project
  | 'project.created'
  | 'project.updated'
  | 'project.deleted'
  | 'project.archived'
  | 'project.member_added'
  | 'project.member_removed'
  | 'project.status_changed'
  // Team
  | 'team.created'
  | 'team.updated'
  | 'team.deleted'
  | 'team.member_invited'
  | 'team.member_joined'
  | 'team.member_removed'
  | 'team.member_role_changed'
  // Sprint
  | 'sprint.created'
  | 'sprint.updated'
  | 'sprint.started'
  | 'sprint.completed'
  | 'sprint.deleted'
  // Company / Onboarding
  | 'company.created'
  | 'company.updated'
  | 'company.admin_invited'
  | 'onboarding.step_completed'
  // Settings
  | 'settings.profile_updated'
  | 'settings.notification_updated'
  | 'settings.avatar_changed'
  // Navigation (optional / lightweight)
  | 'page.viewed'
  | 'task.opened'
  | 'project.opened'
  // Admin
  | 'admin.action'
  | 'admin.user_deactivated'
  | 'admin.role_changed';

interface IActionLogV2 extends Document {
  // === WHO ===
  actor: {
    _id: Types.ObjectId;
    name: string;
    email: string;
    role?: string;
  };
  // Keep legacy userId for backward compat
  userId: Types.ObjectId;

  // === WHAT ===
  action: ActionVerb;
  category: ActionCategory;
  details: string;             // Human-readable: "Assigned TASK-001 to Juan Pérez"
  result: 'success' | 'failure' | 'partial';

  // === WHERE / ON WHAT ===
  entity: string;              // 'Task', 'Project', 'Team', 'User'...
  entityId?: Types.ObjectId;   // optional: failed logins have no entityId

  // === CONTEXT (for multi-tenant scoped queries) ===
  companyId?: Types.ObjectId;
  teamId?: Types.ObjectId;
  projectId?: Types.ObjectId;

  // === DIFF ===
  metadata?: {
    before?: Record<string, unknown>;   // old field values
    after?: Record<string, unknown>;    // new field values
    changes?: string[];                 // ['status', 'assignee', 'priority']
    description?: string;               // extra human-readable context
    extra?: Record<string, unknown>;    // arbitrary extra data
  };

  // === REQUEST INFO ===
  ipAddress?: string;
  userAgent?: string;

  // === TIMESTAMP ===
  createdAt: Date;
}
```

### Índices de rendimiento

```typescript
// Cronológico por actor (historial de usuario)
actionLogSchema.index({ 'actor._id': 1, createdAt: -1 });

// Por recurso (historial de una tarea/proyecto)
actionLogSchema.index({ entity: 1, entityId: 1, createdAt: -1 });

// Por equipo (audit log de equipo)
actionLogSchema.index({ teamId: 1, createdAt: -1 });

// Por acción + fecha (filtros en dashboard)
actionLogSchema.index({ action: 1, createdAt: -1 });

// Por categoría + equipo (tab de actividad por categoría)
actionLogSchema.index({ category: 1, teamId: 1, createdAt: -1 });

// TTL: eliminar registros de navegación después de 30 días
// TTL: eliminar registros de audit después de 180 días
// (implementar con colecciones separadas o campo `ttl`)
actionLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15552000 }); // 180 días
```

---

## 6. Catálogo de Eventos — Taxonomía Completa

### 6.1 Auth Events (`category: 'auth'`)

| Verbo | Cuándo | entity | ¿entityId? | Metadata relevante |
|-------|--------|--------|-----------|-------------------|
| `user.login` | Login exitoso | `User` | userId | `{ ip, userAgent }` |
| `user.login_failed` | Contraseña incorrecta | `User` | ❌ (email en `details`) | `{ attemptedEmail }` |
| `user.logout` | Logout explícito | `User` | userId | — |
| `user.register` | Registro nuevo | `User` | userId | `{ method: 'invite' | 'self' }` |
| `user.password_changed` | Cambio de contraseña exitoso | `User` | userId | `{ reason: 'ritual' | 'forgot' | 'voluntary' }` |
| `user.temp_password_used` | Login con temp password | `User` | userId | `{ remainingUses }` |

### 6.2 Task Events (`category: 'task'`)

| Verbo | Cuándo | Metadata relevante |
|-------|--------|-------------------|
| `task.created` | `POST /api/tasks` | `{ after: { title, type, priority, status } }` |
| `task.status_changed` | `PUT /api/tasks/:id` (status field) | `{ before: { status }, after: { status } }` |
| `task.assigned` | `PUT /api/tasks/:id` (assignee field) | `{ before: { assignee }, after: { assignee }, changes: ['assignee'] }` |
| `task.priority_changed` | `PUT /api/tasks/:id` (priority field) | `{ before: { priority }, after: { priority } }` |
| `task.commented` | `POST /api/tasks/:id/comments` | `{ extra: { commentPreview: first100chars } }` |
| `task.converted_to_bug` | `POST /api/tasks/:id/convert-to-bug` | `{ before: { type: 'task' }, after: { type: 'bug' } }` |
| `task.qa_approved` | `POST /api/tasks/:id/approve-for-sprint` | `{ after: { status: 'approved' } }` |
| `task.deleted` | `DELETE /api/tasks/:id` | `{ before: { title, status, assignee } }` |
| `task.updated` | `PUT /api/tasks/:id` (otros campos) | `{ before, after, changes[] }` |

### 6.3 Project Events (`category: 'project'`)

| Verbo | Cuándo | Metadata relevante |
|-------|--------|-------------------|
| `project.created` | `POST /api/projects` | `{ after: { name, status } }` |
| `project.updated` | `PUT /api/projects/:id` | `{ before, after, changes[] }` |
| `project.deleted` | `DELETE /api/projects/:id` | `{ before: { name, status } }` |
| `project.status_changed` | Status update en project | `{ before: { status }, after: { status } }` |
| `project.member_added` | Agregar miembro a proyecto | `{ extra: { addedUserId, addedUserName } }` |

### 6.4 Team Events (`category: 'team'`)

| Verbo | Cuándo | Metadata relevante |
|-------|--------|-------------------|
| `team.created` | `POST /api/teams` | `{ after: { name } }` |
| `team.member_invited` | `POST /api/teams/:id/members` | `{ extra: { invitedEmail, role } }` |
| `team.member_removed` | `DELETE /api/teams/:id/members/:userId` | `{ extra: { removedUserId, removedUserName } }` |
| `team.member_role_changed` | `PUT /api/teams/:id/members/:userId/role` | `{ before: { role }, after: { role } }` |
| `team.deleted` | `DELETE /api/teams/:id` | `{ before: { name, membersCount } }` |

### 6.5 Sprint Events (`category: 'sprint'`)

| Verbo | Cuándo |
|-------|--------|
| `sprint.created` | `POST /api/sprints` |
| `sprint.started` | Status → `active` |
| `sprint.completed` | Status → `completed` |
| `sprint.deleted` | `DELETE /api/sprints/:id` |

### 6.6 Settings Events (`category: 'settings'`)

| Verbo | Cuándo |
|-------|--------|
| `settings.profile_updated` | `PUT /api/auth/profile` |
| `settings.notification_updated` | Cambio en preferencias de notificaciones |

### 6.7 Navigation Events (`category: 'navigation'`) — Opcional

> ⚠️ Estos eventos son de alto volumen. Considerar almacenarlos en colección separada con TTL de 30 días.

| Verbo | Cuándo |
|-------|--------|
| `page.viewed` | Usuario navega a una sección |
| `task.opened` | Usuario abre el detalle de una tarea |
| `project.opened` | Usuario abre un proyecto |

---

## 7. Implementación — Plan por Fases

### FASE A: Infraestructura Core (Prerequisito)

#### A1 — Evolucionar ActionLog Schema
**Archivo:** `server/src/models/ActionLog.ts`

- Agregar `actor` subdocument `{ _id, name, email, role }`
- Expandir `action` enum a `ActionVerb` (40+ valores)
- Agregar campo `category: ActionCategory`
- Agregar `result: 'success' | 'failure' | 'partial'` (default: `'success'`)
- Agregar `metadata?: { before, after, changes[], description, extra }`
- Agregar `teamId?: ObjectId`, `projectId?: ObjectId`
- Hacer `entityId` opcional
- Agregar los 6 índices compuestos
- Agregar TTL index (180 días)
- Mantener retrocompatibilidad (los campos viejos siguen funcionando)

#### A2 — AsyncLocalStorage Middleware
**Archivo:** `server/src/middleware/requestContext.ts`

```typescript
import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
  userId?: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  ipAddress?: string;
  userAgent?: string;
  teamId?: string;
}

export const requestContextStorage = new AsyncLocalStorage<RequestContext>();

export function requestContextMiddleware(req, res, next) {
  const context: RequestContext = {
    userId: req.user?._id?.toString(),
    userName: req.user?.name,
    userEmail: req.user?.email,
    userRole: req.user?.role,
    ipAddress: req.ip || req.socket?.remoteAddress,
    userAgent: req.headers['user-agent'],
  };
  requestContextStorage.run(context, next);
}
```

**Montar en `index.ts`:** después de `cookieParser()`, antes de las rutas.

#### A3 — ActivityLogService
**Archivo:** `server/src/services/activityLogService.ts`

```typescript
import ActionLog from '../models/ActionLog.js';
import { requestContextStorage } from '../middleware/requestContext.js';

interface LogPayload {
  action: ActionVerb;
  category: ActionCategory;
  entity: string;
  entityId?: Types.ObjectId | string;
  details: string;
  result?: 'success' | 'failure' | 'partial';
  teamId?: Types.ObjectId | string;
  projectId?: Types.ObjectId | string;
  companyId?: Types.ObjectId | string;
  metadata?: { before?: object; after?: object; changes?: string[]; extra?: object };
  // Override actor (for system actions or when context is not available)
  actorOverride?: { _id: string; name: string; email: string; role?: string };
}

export function log(payload: LogPayload): void {
  // Fire-and-forget — never awaited
  setImmediate(async () => {
    try {
      const ctx = requestContextStorage.getStore();
      const actor = payload.actorOverride ?? {
        _id: ctx?.userId,
        name: ctx?.userName ?? 'System',
        email: ctx?.userEmail ?? 'system@miniclickup.app',
        role: ctx?.userRole,
      };

      await ActionLog.create({
        userId: actor._id,
        actor,
        action: payload.action,
        category: payload.category,
        entity: payload.entity,
        entityId: payload.entityId,
        details: payload.details,
        result: payload.result ?? 'success',
        teamId: payload.teamId,
        projectId: payload.projectId,
        companyId: payload.companyId,
        metadata: payload.metadata,
        ipAddress: ctx?.ipAddress,
        userAgent: ctx?.userAgent,
      });
    } catch (err) {
      // Never propagate log failures
      console.error('[ActivityLog] Failed to write log entry:', err);
    }
  });
}

// Typed helper for auth events
export function logAuth(params: { action: AuthAction; userId?: string; details: string; result?: 'success' | 'failure'; extra?: object }): void {
  log({ ...params, category: 'auth', entity: 'User' });
}

// Typed helper for task events
export function logTask(params: { action: TaskAction; task: { _id: string; title: string; taskNumber: string }; teamId: string; projectId: string; details: string; metadata?: object }): void {
  log({ ...params, category: 'task', entity: 'Task', entityId: params.task._id });
}
```

### FASE B: Instrumentar Eventos (por controller)

**Prioridad 1 (crítico):**
- `authController.ts` → `user.login`, `user.login_failed`, `user.logout`, `user.password_changed`
- `taskController.ts` → todos los task events

**Prioridad 2 (importante):**
- `projectController.ts` → project events
- `teamController.ts` → reemplazar `ActionLog.create()` directo con `activityLogService.log()`
- `sprintController.ts` → sprint events

**Prioridad 3 (nice to have):**
- `companyController.ts`, `departmentController.ts` → migrar a nuevo servicio
- Navigation events (client-side → endpoint `/api/activity-log/track`)

### FASE C: API de Consulta

**Archivo:** `server/src/routes/activityLog.ts`

```
GET /api/activity-log                    → Global (admin only, paginado)
GET /api/activity-log/me                 → Log del usuario autenticado
GET /api/activity-log/user/:userId       → Log de un usuario (admin/manager)
GET /api/activity-log/team/:teamId       → Log del equipo (admin/owner)
GET /api/activity-log/resource/:type/:id → Historial de un recurso específico
POST /api/activity-log/track             → Client-side navigation tracking
```

**Query params universales:**
```
?action=task.assigned          → filtrar por acción específica
?category=task                 → filtrar por categoría
?from=2026-01-01               → fecha inicio
?to=2026-04-30                 → fecha fin
?result=failure                → solo eventos fallidos
?limit=50                      → resultados por página (max 100)
?cursor=<lastId>               → cursor-based pagination (ObjectId del último)
```

**Response shape:**
```json
{
  "success": true,
  "data": {
    "logs": [ { ...activityLog } ],
    "nextCursor": "665a...",
    "total": 1234
  }
}
```

### FASE D: Real-time (Socket.IO)

Después de cada `ActionLog.create()` en `activityLogService.ts`:
```typescript
const io = app.get('io'); // accesible via AsyncLocalStorage o parámetro
io.to(`team:${payload.teamId}`).emit('activity:logged', {
  action: payload.action,
  actor: { name: actor.name },
  details: payload.details,
  timestamp: new Date().toISOString(),
});
```

El cliente suscribe al room `team:<teamId>` y muestra el feed de actividad en tiempo real.

---

## 8. Datos a NUNCA registrar

Per OWASP — campos prohibidos en logs:
- ❌ Contraseñas (planas o hasheadas)
- ❌ Tokens JWT completos
- ❌ Session IDs completos (solo hash si se necesita correlación)
- ❌ Datos bancarios
- ❌ Información sensible de PII no necesaria

---

## 9. Estrategia de Testing

### Unit tests (`activityLogService.test.ts`)
- `log()` no lanza excepciones si MongoDB falla
- `log()` usa el contexto de AsyncLocalStorage correctamente
- `logAuth()` → persiste con `category: 'auth'`
- `logTask()` → persiste con campos correctos

### Integration tests
- `POST /api/tasks` → genera `task.created` en ActivityLog
- `POST /api/auth/login` (éxito) → genera `user.login`
- `POST /api/auth/login` (falla) → genera `user.login_failed` con `result: 'failure'`
- `GET /api/activity-log/team/:teamId` → retorna solo logs del equipo
- `GET /api/activity-log/resource/Task/:id` → historial cronológico de la tarea

---

## 10. Retención y Performance

| Categoría | TTL recomendado | Justificación |
|-----------|----------------|---------------|
| `auth` | 365 días | Auditoría de seguridad |
| `task`, `project`, `team` | 180 días | Trazabilidad de trabajo |
| `settings` | 180 días | Compliance |
| `navigation` | 30 días | Solo analítica |
| Errores/fallos | 365 días | Auditoría de seguridad |

**Implementación:** TTL index en MongoDB o campo `expiresAt` por categoría.

**Capped collection para navegación:** Considerar colección separada `navigation_logs` capped a 100K documentos para eventos de alta frecuencia.

---

## 11. Roadmap de Implementación

```
FASE A — Infraestructura (1 sprint)
  A1: Evolucionar ActionLog schema + índices
  A2: requestContextMiddleware (AsyncLocalStorage)
  A3: activityLogService.ts con helpers tipados
  Tests unitarios de A3

FASE B — Instrumentación de eventos (1 sprint)
  B1: authController.ts (login/logout/password)
  B2: taskController.ts (todos los task events)
  B3: projectController.ts
  B4: teamController.ts (migrar de direct ActionLog.create)
  B5: sprintController.ts
  Tests de integración por controller

FASE C — API de consulta (0.5 sprint)
  C1: activityLogController.ts
  C2: activityLog routes + auth/permission middleware
  C3: Paginación cursor-based
  Tests de API

FASE D — Real-time + UI (0.5 sprint)
  D1: Socket.IO emit en activityLogService
  D2: ActivityFeed component (cliente)
  D3: Dashboard widget "Actividad Reciente"
  D4: Historial en detalle de tarea

FASE E — Navigation tracking (opcional)
  E1: Client-side tracker hook (useActivityTracker)
  E2: Batched POST /api/activity-log/track
  E3: Colección separada navigation_logs con TTL 30 días
```

---

## 12. Criterios de Aceptación del Sistema

| Criterio | Métrica |
|----------|---------|
| Login de usuario registrado en vitácora | 100% de logins → `user.login` en ActionLog |
| Acciones sobre tareas registradas | Create, assign, status-change siempre logeados |
| El log NO bloquea el response | `p99` de requests no aumenta > 5ms por causa del log |
| Historial por recurso disponible | `GET /api/activity-log/resource/Task/:id` retorna historial cronológico |
| Historial por usuario disponible | `GET /api/activity-log/me` retorna actividad del usuario |
| Auditoría de seguridad | Login fallido registrado con IP y userAgent |
| Retención correcta | Documentos de nav eliminados a los 30 días (TTL) |
| Tests | ≥ 80% coverage en activityLogService y API endpoints |

---

## 13. Estado de Implementación — Pendientes

**Última actualización:** 2026-04-29  
**Estado global:** ⏳ En cola — implementación programada para próximo sprint

Todos los items de este sistema son **nuevas funcionalidades** — no modifican comportamiento existente.  
El orden de ejecución debe seguir las fases estrictamente (las fases B–E dependen de la fase A).

### Fase A — Infraestructura Core (prerequisito obligatorio)

| ID | Tarea | Archivo(s) | Estado |
|----|-------|-----------|--------|
| A1 | Evolucionar `ActionLog` model: nuevos tipos, índices compuestos, TTL index | `server/src/models/ActionLog.ts` | ⏳ Pendiente |
| A2 | Crear `requestContextMiddleware` con AsyncLocalStorage | `server/src/middleware/requestContext.ts` | ⏳ Pendiente |
| A3 | Crear `activityLogService.ts` con helpers tipados (`logEvent`, `logAsync`) | `server/src/services/activityLogService.ts` | ⏳ Pendiente |
| A4 | Montar middleware en index.ts ANTES de las rutas | `server/src/index.ts` | ⏳ Pendiente |

### Fase B — Instrumentación de Controllers (Prioridad Alta)

| ID | Tarea | Archivo(s) | Estado |
|----|-------|-----------|--------|
| B1 | Instrumentar `authController.ts` — login, login_failed, logout, password_changed | `server/src/controllers/authController.ts` | ⏳ Pendiente |
| B2 | Instrumentar `taskController.ts` — create, assign, status_change, qa_approved | `server/src/controllers/taskController.ts` | ⏳ Pendiente |
| B3 | Instrumentar `projectController.ts` — project events | `server/src/controllers/projectController.ts` | ⏳ Pendiente |
| B4 | Migrar `teamController.ts` — reemplazar `ActionLog.create()` directo por servicio | `server/src/controllers/teamController.ts` | ⏳ Pendiente |

### Fase C — API de Consulta

| ID | Tarea | Archivo(s) | Estado |
|----|-------|-----------|--------|
| C1 | Crear `activityLogController.ts` + rutas con paginación cursor-based | `server/src/controllers/activityLogController.ts` | ⏳ Pendiente |

### Fase D — Real-time

| ID | Tarea | Archivo(s) | Estado |
|----|-------|-----------|--------|
| D1 | Emitir `activity:logged` al team room desde activityLogService | `server/src/services/activityLogService.ts` | ⏳ Pendiente |

### Fase E — Navigation Tracking (Opcional, post-MVP)

| ID | Tarea | Archivo(s) | Estado |
|----|-------|-----------|--------|
| E1 | Hook `useActivityTracker` para tracking de navegación client-side | `client/src/hooks/useActivityTracker.ts` | ⏳ Opcional |

### Notas de Ejecución

- Los SQL todos en la sesión activa están bajo IDs `actlog-*` (12 items)
- La verificación de `AuthContext.tsx` (ruta `response.data.data.passwordChangeRequired`) debe hacerse ANTES de instrumentar `authController.ts`
- Ver deuda técnica transversal en `Documentacion/10_Roadmap_y_Deuda_Tecnica.md`

---

## Referencias

- [W3C ActivityStreams 2.0 Vocabulary](https://www.w3.org/TR/activitystreams-vocabulary/)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [Martin Fowler — Audit Log Pattern](https://martinfowler.com/eaaDev/AuditLog.html)
- [Mongoose Middleware (post-save hooks)](https://mongoosejs.com/docs/middleware.html)
- [Node.js AsyncLocalStorage](https://nodejs.org/api/async_context.html#class-asynclocalstorage)
- `server/src/models/ActionLog.ts` — modelo existente a evolucionar
- `Documentacion/10_Roadmap_y_Deuda_Tecnica.md` — deuda técnica transversal del proyecto
