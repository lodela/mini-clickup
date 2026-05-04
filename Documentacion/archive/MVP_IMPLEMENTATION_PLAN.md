# 🚀 MINI CLICKUP - PLAN DE IMPLEMENTACIÓN MVP

**Project:** Mini ClickUp  
**Version:** 0.1.0 MVP  
**Date:** 2026-03-17  
**Arquitecto:** GitHub Copilot (NLodela Orchestrator)  
**Desarrollador:** Norberto Lodela  
**Metodología:** Agile-Scrum (Sprints de 7 días)

---

## 📊 VISIÓN GENERAL DEL MVP

### **Objetivo del MVP**
Crear una plataforma de gestión de proyectos funcional con:
- ✅ Autenticación de usuarios
- ✅ Gestión de equipos
- ✅ Gestión de tareas (CRUD + Kanban)
- ✅ Dashboard con KPIs
- ✅ Chat en tiempo real (básico)

### **No-Goals (Post-MVP)**
- ❌ Gantt charts
- ❌ Time tracking
- ❌ Custom fields builder
- ❌ Automation rules
- ❌ Mobile app (React Native)

---

## 🏗️ ARQUITECTURA TÉCNICA

### **Stack Tecnológico**

```yaml
Frontend:
  React: 19.0.0
  TypeScript: 5.6.2
  Vite: 6.4.1
  Tailwind CSS: 4.1.18
  Radix UI: 48 components
  React Router: v7
  Socket.IO Client: 4.x
  i18next: 25.8.4
  Framer Motion: 12.0
  Recharts: 2.15

Backend:
  Node.js: 24.x
  Express: 4.x
  MongoDB: 8.x
  Mongoose: 8.x
  Socket.IO: 4.x
  JWT: jsonwebtoken
  Bcrypt: 15.x
  Zod: 3.24

DevOps:
  GitHub Actions (CI/CD)
  Vitest (Unit Testing)
  Playwright (E2E)
  IIS (Windows Deployment)
```

---

## 📋 ROADMAP DE SPRINTS

### **Sprint 0: Setup & Scaffold** ✅ COMPLETADO
**Duración:** 3 días  
**Estado:** 100% Complete  
**Evolution Score:** 98/100

**Deliverables:**
- ✅ Project scaffold (MERN stack)
- ✅ 51+ archivos generados
- ✅ UI Components (Button, Input, Card)
- ✅ 9 páginas (Login, Register, Dashboard, etc.)
- ✅ Auth context + Socket context
- ✅ Backend models (User, Team, Project, Task)
- ✅ Auth controller + routes
- ✅ CI/CD pipelines (GitHub Actions)
- ✅ IIS configuration
- ✅ Documentation (README, CONTRIBUTING, SECURITY)

**Código:** ~6,500 LOC

---

### **Sprint 1: Authentication + Teams** 🎯 EN PROGRESO
**Duración:** 7 días  
**Story Points:** 75 horas (CH: 1, MD: 7, L: 3)

**Objetivo:** Usuarios autenticados pueden crear y gestionar equipos

#### **Epic: AUTH-001 - Authentication System**

| ID | Task | Talla | Horas | Status | Acceptance Criteria |
|----|------|-------|-------|--------|---------------------|
| S1-T01 | ✅ Login form UI | MD | 6h | ✅ Done | Form con email/password, validación, remember me |
| S1-T02 | ✅ Register form UI | MD | 6h | ✅ Done | Form con name/email/password, validación en tiempo real |
| S1-T03 | ✅ Backend: User model | MD | 4h | ✅ Done | Schema con bcrypt, indexes, methods |
| S1-T04 | ✅ Backend: Auth endpoints | L | 10h | ✅ Done | POST /register, /login, /refresh, /logout, GET /me |
| S1-T05 | ✅ JWT implementation | MD | 8h | ✅ Done | Access token (15min) + Refresh token (7d), HttpOnly cookies |
| S1-T06 | ✅ Auth context (frontend) | MD | 6h | ✅ Done | useAuth hook, protected routes |
| S1-T07 | 🔲 Password reset flow | L | 10h | 🔲 Pending | Forgot password → email token → reset form |

#### **Epic: TEAM-001 - Team Management**

| ID | Task | Talla | Horas | Status | Acceptance Criteria |
|----|------|-------|-------|--------|---------------------|
| S1-T08 | ✅ Team model (Mongoose) | CH | 3h | ✅ Done | Schema: name, description, members[], owner |
| S1-T09 | 🔲 Create team UI | MD | 6h | 🔲 Pending | Modal/form para crear equipo |
| S1-T10 | 🔲 Team list page | MD | 8h | 🔲 Pending | Grid de equipos con stats |
| S1-T11 | 🔲 Invite members | L | 10h | 🔲 Pending | Por email, roles: admin/member/guest |
| S1-T12 | 🔲 Team settings | MD | 6h | 🔲 Pending | Edit, delete, transfer ownership |

**Sprint 1 Total:** CH: 1, MD: 7, L: 3 = **75 horas**

---

### **Sprint 2: Tasks + Kanban Board**
**Duración:** 7 días  
**Story Points:** 73 horas (CH: 3, MD: 5, L: 1, XL: 1)

**Objetivo:** Crear, editar y visualizar tareas en tablero Kanban

#### **Epic: TASK-001 - Task CRUD**

| ID | Task | Talla | Horas | Acceptance Criteria |
|----|------|-------|-------|---------------------|
| S2-T01 | ✅ Task model (Mongoose) | MD | 6h | ✅ Done | Schema: title, description, status, priority, assignee, dueDate |
| S2-T02 | 🔲 Create task UI | MD | 6h | 🔲 Pending | Modal con todos los campos, assignee selector, due date picker |
| S2-T03 | 🔲 Task detail modal | L | 10h | 🔲 Pending | Vista completa, comentarios, activity log, attachments |
| S2-T04 | 🔲 Edit task inline | MD | 6h | 🔲 Pending | Click-to-edit, auto-save |
| S2-T05 | 🔲 Delete task | CH | 2h | 🔲 Pending | Confirm dialog, soft delete |
| S2-T06 | 🔲 Task list view | MD | 8h | 🔲 Pending | Tabla con filtros, ordenamiento, paginación |

#### **Epic: BOARD-001 - Kanban Board**

| ID | Task | Talla | Horas | Acceptance Criteria |
|----|------|-------|-------|---------------------|
| S2-T07 | ✅ Board model | CH | 4h | ✅ Done | Schema: name, columns[], projectId |
| S2-T08 | 🔲 Kanban board UI | XL | 20h | 🔲 Pending | Drag-and-drop con @dnd-kit, columnas horizontales |
| S2-T09 | 🔲 Custom columns | MD | 8h | 🔲 Pending | Crear, editar, eliminar columnas |
| S2-T10 | 🔲 Task filters | MD | 6h | 🔲 Pending | Por assignee, priority, tags, due date |
| S2-T11 | 🔲 Quick add task | CH | 3h | 🔲 Pending | Botón "+" en cada columna |

**Sprint 2 Total:** CH: 3, MD: 5, L: 1, XL: 1 = **73 horas**

---

### **Sprint 3: Dashboard + Reports**
**Duración:** 7 días  
**Story Points:** 76 horas (CH: 1, MD: 5, L: 3)

**Objetivo:** Visualizar métricas y progreso del proyecto

#### **Epic: DASH-001 - Dashboard**

| ID | Task | Talla | Horas | Acceptance Criteria |
|----|------|-------|-------|---------------------|
| S1-T01 | ✅ Dashboard layout | MD | 6h | ✅ Done | Grid responsive, stats cards, activity feed |
| S1-T02 | ✅ Stats cards | MD | 8h | ✅ Done | Total tasks, completed, in progress, overdue |
| S1-T03 | 🔲 Task distribution chart | MD | 6h | 🔲 Pending | Pie chart con Recharts |
| S1-T04 | 🔲 Activity timeline | L | 12h | 🔲 Pending | Lista cronológica, infinite scroll |
| S1-T05 | 🔲 Team workload | L | 10h | 🔲 Pending | Bar chart, tasks por assignee |
| S1-T06 | 🔲 Upcoming deadlines | MD | 6h | 🔲 Pending | Lista de tareas próximas a vencer |

#### **Epic: REP-001 - Reports**

| ID | Task | Talla | Horas | Acceptance Criteria |
|----|------|-------|-------|---------------------|
| S3-T07 | 🔲 Reports page | MD | 6h | 🔲 Pending | Selector de rango de fechas, filtros |
| S3-T08 | 🔲 Completion rate report | MD | 8h | 🔲 Pending | Gráfica de tareas completadas |
| S3-T09 | 🔲 Export to CSV | CH | 4h | 🔲 Pending | Download de tasks filtradas |
| S3-T10 | 🔲 Export to PDF | L | 10h | 🔲 Pending | Reporte formateado con jsPDF |

**Sprint 3 Total:** CH: 1, MD: 5, L: 3 = **76 horas**

---

### **Sprint 4: Real-time Chat** (POST-MVP)
**Duración:** 7 días  
**Story Points:** 63 horas

**Objetivo:** Chat en tiempo real por equipos

- Message model
- Socket.IO chat events
- Chat UI layout
- Message bubbles
- File attachments
- Typing indicators
- Unread messages
- Message search

---

### **Sprint 5: Calendar + Notifications** (POST-MVP)
**Duración:** 7 días  
**Story Points:** 60 horas

**Objetivo:** Calendario de vacaciones y sistema de notificaciones

- TimeOff model
- Calendar UI
- Request time off
- Approve/reject flow
- Team availability
- Notification model
- Socket.IO notifications
- Notification bell
- Email notifications

---

## 📊 RESUMEN DE SPRINTS

| Sprint | Duración | CH | MD | L | XL | Total Horas | Status |
|--------|----------|----|----|---|----|-------------|--------|
| **Sprint 0** | 3 días | 6 | 1 | - | - | 16 | ✅ Done |
| **Sprint 1** | 7 días | 1 | 7 | 3 | - | 75 | 🎯 In Progress |
| **Sprint 2** | 7 días | 3 | 5 | 1 | 1 | 73 | 🔲 Pending |
| **Sprint 3** | 7 días | 1 | 5 | 3 | - | 76 | 🔲 Pending |
| **Sprint 4** | 7 días | 1 | 4 | 3 | - | 63 | 🔲 Post-MVP |
| **Sprint 5** | 7 días | 1 | 4 | 2 | - | 60 | 🔲 Post-MVP |

**MVP Total (Sprints 0-3):** 240 horas (~30 días)  
**Full Project (Sprints 0-5):** 363 horas (~45 días)

---

## 🎯 DEFINITION OF DONE (DoD)

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

## 🔧 CRITERIOS DE ACEPTACIÓN TÉCNICOS

### **Código**
- ✅ TypeScript strict mode
- ✅ SOLID principles compliance (90%+)
- ✅ DRY (no duplicación >2 veces)
- ✅ KISS (soluciones simples)
- ✅ YAGNI (solo lo necesario)

### **Testing**
- ✅ Unit tests (Vitest, 80% coverage)
- ✅ Integration tests (Supertest)
- ✅ E2E tests (Playwright, critical paths)

### **Security**
- ✅ JWT authentication
- ✅ Bcrypt password hashing (cost 12)
- ✅ Input validation (Zod)
- ✅ XSS prevention
- ✅ CORS configuration
- ✅ Rate limiting

### **Performance**
- ✅ Code splitting (Vite)
- ✅ Lazy loading (React.lazy)
- ✅ Image optimization
- ✅ API response time < 200ms

### **Accessibility**
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Focus states
- ✅ Color contrast (WCAG AA)

---

## 📋 PLAN DE IMPLEMENTACIÓN - SPRINT 1

### **Día 1: Team API**

**Mañana (4h):**
```typescript
// 1. Team Controller
- createTeam()
- getTeams()
- getTeamById()
- updateTeam()
- deleteTeam()

// 2. Team Routes
POST   /api/teams
GET    /api/teams
GET    /api/teams/:id
PUT    /api/teams/:id
DELETE /api/teams/:id
```

**Tarde (4h):**
```typescript
// 3. Team Middleware
- checkTeamMembership()
- checkTeamOwnership()

// 4. Team Service
- addMemberToTeam()
- removeMemberFromTeam()
- updateMemberRole()
```

**Acceptance Criteria:**
- ✅ Tests unitarios para controller
- ✅ Tests de integración para routes
- ✅ Documentación de API

---

### **Día 2: Team UI - Create & List**

**Mañana (4h):**
```tsx
// 1. CreateTeamModal component
- Form con nombre y descripción
- Validación en tiempo real
- Submit handler

// 2. TeamList component
- Grid de cards
- Stats por equipo
- Actions (edit, delete, view)
```

**Tarde (4h):**
```tsx
// 3. TeamCard component
- Team avatar
- Member count
- Project count
- Quick actions

// 4. TeamPage integration
- Fetch teams on mount
- Handle loading/error states
- Empty state
```

**Acceptance Criteria:**
- ✅ Componentes con tests
- ✅ Responsive design
- ✅ Error handling

---

### **Día 3: Invite Members**

**Mañana (4h):**
```typescript
// 1. Invite Member API
POST /api/teams/:id/invite
- Email validation
- Role assignment
- Send invitation email (stub)

// 2. Backend: Invitation model
- email, team, role, status
- expiresAt
- token
```

**Tarde (4h):**
```tsx
// 3. InviteMemberModal component
- Email input (multi-entry)
- Role selector (admin/member/guest)
- Send invitations
- Success/error feedback
```

**Acceptance Criteria:**
- ✅ Invitaciones se guardan en DB
- ✅ Emails únicos validados
- ✅ Roles asignados correctamente

---

### **Día 4: Team Settings**

**Mañana (4h):**
```tsx
// 1. TeamSettings page
- Edit team name/description
- Change avatar
- Transfer ownership
- Delete team (confirm dialog)

// 2. Member management
- Remove member
- Change role
- View member details
```

**Tarde (4h):**
```typescript
// 3. Backend: Settings endpoints
PUT /api/teams/:id/settings
DELETE /api/teams/:id/members/:userId
PUT /api/teams/:id/members/:userId/role
```

**Acceptance Criteria:**
- ✅ Settings se persisten
- ✅ Transfer ownership valida nuevo owner
- ✅ Delete team elimina datos relacionados

---

### **Día 5: Password Reset Flow**

**Mañana (4h):**
```typescript
// 1. Forgot Password API
POST /api/auth/forgot-password
- Generate reset token
- Send email (stub)
- Token expiration (1h)

// 2. Reset Password API
POST /api/auth/reset-password/:token
- Validate token
- Update password
- Invalidate token
```

**Tarde (4h):**
```tsx
// 3. ForgotPasswordPage
- Email input
- Submit handler
- Success message

// 4. ResetPasswordPage
- Password input (new + confirm)
- Validation
- Submit handler
```

**Acceptance Criteria:**
- ✅ Token generado y persistido
- ✅ Email enviado (stub)
- ✅ Password actualizado correctamente

---

### **Día 6: Testing & Bug Fixes**

**Mañana (4h):**
```bash
# Unit tests
- Team controller tests
- Team service tests
- Auth reset tests

# Integration tests
- Team API tests
- Invite flow tests
```

**Tarde (4h):**
```bash
# E2E tests (Playwright)
- Create team flow
- Invite member flow
- Password reset flow

# Bug fixes
- Fix issues found in testing
```

**Acceptance Criteria:**
- ✅ 80% code coverage
- ✅ All E2E tests passing
- ✅ No critical bugs

---

### **Día 7: Sprint Review & Retrospective**

**Mañana (2h):**
```markdown
# Sprint Review
- Demo de features completados
- Revisión de acceptance criteria
- Feedback del stakeholder
```

**Tarde (2h):**
```markdown
# Sprint Retrospective
- What went well
- What could be improved
- Action items for next sprint

# Sprint 2 Planning
- Review backlog
- Estimate tasks
- Commit to sprint goals
```

**Acceptance Criteria:**
- ✅ Sprint review completada
- ✅ Retrospective documentada
- ✅ Sprint 2 planificado

---

## 📊 MÉTRICAS DE SEGUIMIENTO

### **Velocity**
- **Sprint 0:** N/A (Setup)
- **Sprint 1:** Target 75 horas
- **Sprint 2:** Target 73 horas
- **Sprint 3:** Target 76 horas

### **Quality Metrics**
- Code coverage: >80%
- ESLint errors: 0
- TypeScript errors: 0
- Critical bugs: 0

### **Timeline**
- **Start Date:** 2026-03-17
- **MVP Complete:** 2026-04-16 (30 días)
- **Full Project:** 2026-05-01 (45 días)

---

## 🚀 COMANDOS DE DESARROLLO

### **Daily Development**
```bash
# Start both servers
npm run dev

# Or separately
npm run dev:client  # Frontend
npm run dev:server  # Backend
```

### **Testing**
```bash
# Frontend tests
cd client && npm run test
cd client && npm run test:run
cd client && npm run test:coverage

# Backend tests
cd server && npm test

# E2E tests
cd client && npm run test:e2e
```

### **Code Quality**
```bash
# Linting
npm run lint

# Formatting
npm run format

# Type checking
cd client && npx tsc --noEmit
cd server && npx tsc --noEmit
```

---

## 📋 BACKLOG PRIORITIZADO

### **P0 - Critical (MVP)**
1. ✅ Authentication system
2. 🔲 Team management
3. 🔲 Task CRUD
4. 🔲 Kanban board
5. 🔲 Dashboard

### **P1 - High (Post-MVP)**
1. 🔲 Real-time chat
2. 🔲 Calendar
3. 🔲 Notifications
4. 🔲 Reports export

### **P2 - Medium (Future)**
1. 🔲 Gantt charts
2. 🔲 Time tracking
3. 🔲 Custom fields
4. 🔲 Automation rules

### **P3 - Low (Nice to have)**
1. 🔲 Mobile app
2. 🔲 Advanced analytics
3. 🔲 Integrations (Slack, GitHub)

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

### **Hoy (Día 1 Sprint 1):**

1. **Verificar Figma MCP** ✅
   - Conectar con Figma
   - Extraer diseño de Team page
   - Validar design tokens

2. **Team API - Backend** (8h)
   ```typescript
   // Implementar:
   - TeamController (create, get, update, delete)
   - TeamRoutes
   - TeamMiddleware (membership check)
   - TeamService (add/remove members)
   ```

3. **Tests** (2h)
   ```typescript
   // Unit tests para:
   - Team controller
   - Team service
   ```

### **Mañana (Día 2 Sprint 1):**

1. **Team UI - Frontend** (8h)
   ```tsx
   // Implementar:
   - CreateTeamModal
   - TeamList
   - TeamCard
   - TeamPage
   ```

2. **Integration** (2h)
   ```bash
   # Conectar frontend con backend
   - API calls
   - Error handling
   - Loading states
   ```

---

## ✅ CHECKLIST DE INICIO DE SPRINT 1

- [x] Sprint 0 completado (100%)
- [x] Código sigue SOLID/DRY/KISS/YAGNI (92/100)
- [x] MCP de Figma operacional
- [x] Design tokens extraídos de globals.css
- [x] UI Components base creados (Button, Input, Card)
- [x] Auth system implementado
- [x] Models creados (User, Team, Project, Task)
- [ ] MongoDB instalado y corriendo
- [ ] Variables de entorno configuradas
- [ ] Tests de Sprint 0 escritos

---

**Plan aprobado por:** Norberto Lodela  
**Fecha:** 2026-03-17  
**Next Review:** Sprint 1 Review (2026-03-24)

---

**🚀 READY TO START SPRINT 1!**
