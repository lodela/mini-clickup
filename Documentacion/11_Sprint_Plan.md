# Sprint Plan - Mini ClickUp MVP

**Project:** Mini ClickUp  
**Version:** 0.1.0  
**Created:** 2026-03-17  
**Sprint Duration:** 7 days  
**Story Point System:** Tallas (CH, MD, L, XL)  

---

## 📊 Story Point Tallas

| Talla | Horas | Complejidad | Descripción | Ejemplo |
|-------|-------|-------------|-------------|---------|
| **CH** | ≤4h | Baja | Task simple, implementación directa | Componente UI básico, bug fix |
| **MD** | 4-8h | Media | Feature con lógica moderada | Form con validación, API endpoint |
| **L** | 8-16h | Alta | Feature complejo, múltiples archivos | CRUD completo, integración API |
| **XL** | 16-24h | Muy Alta | Sistema completo | Drag-and-drop, real-time sync |

---

## 🗓️ Sprint 0: Setup & Scaffold (3 días)

**Goal:** Tener el proyecto funcionando con front + back + DB conectados

| ID | Task | Talla | Horas | Assignee | Status | Acceptance Criteria |
|----|------|-------|-------|----------|--------|---------------------|
| S0-T01 | Inicializar repo Git | CH | 1h | - | ✅ Done | Repo creado, .gitignore configurado |
| S0-T02 | Crear estructura de directorios | CH | 2h | - | ✅ Done | client/, server/, Documentacion/ |
| S0-T03 | Configurar Vite + React 19 | CH | 2h | - | ✅ Done | `npm run dev` levanta frontend |
| S0-T04 | Configurar Express + TypeScript | CH | 2h | - | 📝 Todo | `npm run dev` levanta backend |
| S0-T05 | Configurar MongoDB local | MD | 4h | - | 📝 Todo | Conexión verificada desde server |
| S0-T06 | Setup ESLint + Prettier | CH | 2h | - | 📝 Todo | Linting funciona en ambos proyectos |
| S0-T07 | Configurar Husky + lint-staged | CH | 2h | - | 📝 Todo | Git hooks pre-commit funcionando |
| S0-T08 | Crear README inicial | CH | 1h | - | ✅ Done | README.md con información básica |

**Sprint 0 Total:** CH: 6, MD: 1 = **16 horas**

---

## 🗓️ Sprint 1: Authentication + Teams (7 días)

**Goal:** Usuarios autenticados pueden crear y gestionar equipos

### Epic: AUTH-001 - Authentication System

| ID | Task | Talla | Horas | Acceptance Criteria |
|----|------|-------|-------|---------------------|
| S1-T01 | Register form UI | MD | 6h | Form con email, password, confirm password. Validación en tiempo real |
| S1-T02 | Login form UI | MD | 6h | Form con email/password. Remember me checkbox. Forgot password link |
| S1-T03 | Backend: User model (Mongoose) | MD | 4h | Schema con email, password (hash), name, role, createdAt |
| S1-T04 | Backend: Auth endpoints | L | 10h | POST /api/auth/register, POST /api/auth/login, POST /api/auth/refresh |
| S1-T05 | JWT implementation | MD | 8h | Access token (15min) + Refresh token (7d). HttpOnly cookies |
| S1-T06 | Auth context (frontend) | MD | 6h | AuthContext con useAuth hook. Protected routes |
| S1-T07 | Password reset flow | L | 10h | Forgot password → email token → reset form |

### Epic: TEAM-001 - Team Management

| ID | Task | Talla | Horas | Acceptance Criteria |
|----|------|-------|-------|---------------------|
| S1-T08 | Team model (Mongoose) | CH | 3h | Schema: name, description, members[], owner, createdAt |
| S1-T09 | Create team UI | MD | 6h | Modal/form para crear equipo. Nombre + descripción |
| S1-T10 | Team list page | MD | 8h | Grid de equipos. Cards con miembros y stats |
| S1-T11 | Invite members | L | 10h | Por email. Roles: admin, member, guest. Email notification |
| S1-T12 | Team settings | MD | 6h | Editar nombre, descripción. Eliminar equipo. Transfer ownership |

**Sprint 1 Total:** CH: 1, MD: 7, L: 3 = **75 horas**

---

## 🗓️ Sprint 2: Tasks + Kanban Board (7 días)

**Goal:** Crear, editar y visualizar tareas en tablero Kanban

### Epic: TASK-001 - Task CRUD

| ID | Task | Talla | Horas | Acceptance Criteria |
|----|------|-------|-------|---------------------|
| S2-T01 | Task model (Mongoose) | MD | 6h | Schema: title, description, status, priority, assignee, dueDate, tags, projectId |
| S2-T02 | Create task UI | MD | 6h | Modal con todos los campos. Assignee selector. Due date picker |
| S2-T03 | Task detail modal | L | 10h | Vista completa. Comentarios. Activity log. Attachments |
| S2-T04 | Edit task inline | MD | 6h | Click-to-edit en título, descripción, priority. Auto-save |
| S2-T05 | Delete task | CH | 2h | Confirm dialog. Soft delete |
| S2-T06 | Task list view | MD | 8h | Tabla con filtros, ordenamiento, paginación |

### Epic: BOARD-001 - Kanban Board

| ID | Task | Talla | Horas | Acceptance Criteria |
|----|------|-------|-------|---------------------|
| S2-T07 | Board model | CH | 4h | Schema: name, columns[], projectId. Default columns: Todo, In Progress, Done |
| S2-T08 | Kanban board UI | XL | 20h | Drag-and-drop con @dnd-kit. Columnas horizontales. Scroll |
| S2-T09 | Custom columns | MD | 8h | Crear, editar, eliminar columnas. Reordenar columnas |
| S2-T10 | Task filters | MD | 6h | Por assignee, priority, tags, due date. Multi-select |
| S2-T11 | Quick add task | CH | 3h | Botón "+" en cada columna. Modal minimalista |

**Sprint 2 Total:** CH: 3, MD: 5, L: 1, XL: 1 = **73 horas**

---

## 🗓️ Sprint 3: Dashboard + Reports (7 días)

**Goal:** Visualizar métricas y progreso del proyecto

### Epic: DASH-001 - Dashboard

| ID | Task | Talla | Horas | Acceptance Criteria |
|----|------|-------|-------|---------------------|
| S3-T01 | Dashboard layout | MD | 6h | Grid responsive. Stats cards, charts, activity feed |
| S3-T02 | Stats cards | MD | 8h | Total tasks, completed, in progress, overdue. Con iconos y trend |
| S3-T03 | Task distribution chart | MD | 6h | Pie chart con Recharts. Por status o assignee |
| S3-T04 | Activity timeline | L | 12h | Lista cronológica. Tasks created, completed, comments. Infinite scroll |
| S3-T05 | Team workload | L | 10h | Bar chart. Tasks por assignee. Over/under allocation |
| S3-T06 | Upcoming deadlines | MD | 6h | Lista de tareas próximas a vencer. Código de colores por urgencia |

### Epic: REP-001 - Reports

| ID | Task | Talla | Horas | Acceptance Criteria |
|----|------|-------|-------|---------------------|
| S3-T07 | Reports page | MD | 6h | Selector de rango de fechas. Filtros por proyecto/team |
| S3-T08 | Completion rate report | MD | 8h | Gráfica de tareas completadas por día/semana |
| S3-T09 | Export to CSV | CH | 4h | Download de tasks filtradas en formato CSV |
| S3-T10 | Export to PDF | L | 10h | Reporte formateado con jsPDF. Logo, fecha, filtros |

**Sprint 3 Total:** CH: 1, MD: 5, L: 3 = **76 horas**

---

## 🗓️ Sprint 4: Real-time Chat (7 días) - POST-MVP

**Goal:** Chat en tiempo real por equipos

### Epic: CHAT-001 - Messaging System

| ID | Task | Talla | Horas | Acceptance Criteria |
|----|------|-------|-------|---------------------|
| S4-T01 | Message model | MD | 6h | Schema: content, sender, teamId, timestamp, edited, attachments |
| S4-T02 | Socket.IO chat events | L | 12h | chat-message, chat-message-received, typing, user-joined, user-left |
| S4-T03 | Chat UI layout | L | 10h | Sidebar con rooms. Message list. Input area. Emoji picker |
| S4-T04 | Message bubbles | MD | 6h | Diferenciar mensajes propios/ajenos. Timestamp. Edit indicator |
| S4-T05 | File attachments | L | 12h | Upload images/docs. Preview. Download. Storage en MongoDB |
| S4-T06 | Typing indicators | CH | 3h | "User is typing..." con debounce |
| S4-T07 | Unread messages | MD | 6h | Badge con contador. Marcar como leído al ver |
| S4-T08 | Message search | MD | 8h | Buscar por texto, fecha, usuario. Highlight results |

**Sprint 4 Total:** CH: 1, MD: 4, L: 3 = **63 horas**

---

## 🗓️ Sprint 5: Calendar + Notifications (7 días) - POST-MVP

**Goal:** Calendario de vacaciones y sistema de notificaciones

### Epic: CAL-001 - Vacation Calendar

| ID | Task | Talla | Horas | Acceptance Criteria |
|----|------|-------|-------|---------------------|
| S5-T01 | TimeOff model | MD | 6h | Schema: user, team, startDate, endDate, type, status, reason |
| S5-T02 | Calendar UI | L | 12h | Vista mensual/semanal. Eventos de vacaciones. Filter por team member |
| S5-T03 | Request time off | MD | 8h | Form para solicitar vacaciones. Selector de fechas y tipo |
| S5-T04 | Approve/reject | MD | 6h | Admin approval flow. Notification al solicitante |
| S5-T05 | Team availability | MD | 8h | Vista de quién está disponible/out. Integración con tasks |

### Epic: NOTIF-001 - Notifications

| ID | Task | Talla | Horas | Acceptance Criteria |
|----|------|-------|-------|---------------------|
| S5-T06 | Notification model | CH | 4h | Schema: user, type, message, read, link, createdAt |
| S5-T07 | Socket.IO notifications | MD | 8h | task-assigned, task-updated, mention, comment. Real-time push |
| S5-T08 | Notification bell | MD | 6h | Badge con contador. Dropdown con lista. Marcar como leído |
| S5-T09 | Email notifications | L | 10h | Daily digest. Instant notifications. Unsubscribe options |

**Sprint 5 Total:** CH: 1, MD: 4, L: 2 = **60 horas**

---

## 📊 Sprint Summary

| Sprint | Duration | CH | MD | L | XL | Total Horas |
|--------|----------|----|----|---|----|-------------|
| **Sprint 0** | 3 días | 6 | 1 | - | - | 16 |
| **Sprint 1** | 7 días | 1 | 7 | 3 | - | 75 |
| **Sprint 2** | 7 días | 3 | 5 | 1 | 1 | 73 |
| **Sprint 3** | 7 días | 1 | 5 | 3 | - | 76 |
| **Sprint 4** | 7 días | 1 | 4 | 3 | - | 63 |
| **Sprint 5** | 7 días | 1 | 4 | 2 | - | 60 |

**MVP Total (Sprints 0-3):** 240 horas (~30 días)  
**Full Project (Sprints 0-5):** 363 horas (~45 días)

---

## 🎯 Definition of Done (DoD)

Para que una task se considere **Done**:

- [ ] Código implementado
- [ ] Tests unitarios escritos (min 80% coverage)
- [ ] Tests E2E para flujos críticos
- [ ] ESLint + Prettier pass
- [ ] TypeScript sin errores
- [ ] Documentación actualizada (si aplica)
- [ ] Code review aprobado
- [ ] Deploy a staging
- [ ] QA verification

---

## 📝 Notes

- **Velocity estimada:** 20-25 puntos por sprint (7 días)
- **Buffer:** 20% adicional para imprevistos
- **Dependencies:** MongoDB debe estar corriendo antes de cada sprint
- **Risk:** Sprint 2 (Kanban drag-and-drop) es el más complejo - considerar pair programming

---

**Created by:** Milly AI - SprintPlanner Agent  
**Date:** 2026-03-17  
**Next Review:** Sprint Planning Meeting
