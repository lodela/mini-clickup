# 📋 Estrategia de Desarrollo e Implementación — Mini ClickUp Enterprise

**Version:** 3.0.0  
**Date:** 2026-05-04  
**Status:** Active — Sprints 1–3 Defined  
**Orchestrator:** Sisyphus (Level-0 Supreme)  
**Stack:** MERN + Socket.IO + React 19 + TypeScript + Tailwind CSS v4 + TipTap  

---

## 1. Executive Summary

Este documento define la estrategia de ejecución para completar el frontend faltante de Mini ClickUp Enterprise, alineado con:

- **SOLID/DRY/KISS/YAGNI** — cada archivo = una responsabilidad
- **Atomic Design** — átomos → moléculas → organismos → templates → páginas
- **TDD Obligatorio** — Red → Green → Refactor para TODO nuevo módulo
- **Glassmorphism 100%** — todas las UI components usan el design system existente
- **Context API 100%** — sin Redux/Zustand; Auth → AppCatalog → Socket
- **Fetch Puro** — `api.ts` exclusivo; cero axios
- **Agnosticidad Backend/Frontend** — services agnósticos, abstracción máxima

**Backend Epic/Story CRUD está 100% completo.** El trabajo pendiente es **frontend-only** para Sprints 1 y 3, y **backend+frontend** para Sprint 2 (PR Document + WYSIWYG).

---

## 2. Orquestación de Agentes (Dream Team)

```
Sisyphus (Level-0 Supreme Orchestrator)
    ├── Phase 1: ANALYSIS (Fan-Out)
    │   ├── nlodela-fullstack-architect → Arquitectura de boundary + DTOs
    │   ├── debt-tracker-agent → Identifica tech debt actual
    │   └── nlodela-quality-gate → Define acceptance criteria
    │
    ├── Phase 2: IMPLEMENTATION (Pipeline Sequential por Sprint)
    │   ├── Sprint 1
    │   │   ├── tdd-test-writer (RED) → Tests para epicService, storyService, hooks
    │   │   ├── nlodela-react-systems → Implementa frontend Epic/Story
    │   │   └── nlodela-quality-gate → Review + hallazgo check
    │   ├── Sprint 2
    │   │   ├── tdd-test-writer (RED) → Tests ProjectDocument service + TipTap
    │   │   ├── nlodela-backend-platform → Backend ProjectDocument + routes
    │   │   ├── nlodela-react-systems → Frontend PR Document con TipTap
    │   │   └── nlodela-quality-gate → Review + arquitectura fit
    │   └── Sprint 3
    │       ├── tdd-test-writer (RED) → Tests Kanban DnD persistence
    │       ├── frontend-agent → Kanban refinado + asignación + tags + fechas
    │       ├── nlodela-react-systems → Sprint creation UI + selectors
    │       └── nlodela-quality-gate → Review final + performance check
    │
    └── Phase 3: SYNTHESIS
        ├── manual-writer-agent → Actualiza Documentacion/
        ├── nlodela-quality-gate → Verificación final de entrega
        └── zeus (opcional) → Security audit si toca auth/middleware nuevo
```

### 2.1 Agent Assignment Matrix

| Sprint | Agent | Responsibility | MCP Servers | Output Location |
|--------|-------|----------------|-------------|-----------------|
| 1 | **tdd-test-writer** | Tests RED: epicService, storyService, useEpics, useStories | filesystem, context7 | `client/src/services/*.test.ts`, `client/src/hooks/*.test.ts` |
| 1 | **nlodela-react-systems** | Frontend Epic/Story: pages, modals, hooks, services, types, router, locales | filesystem, context7, memory | `client/src/components/pages/`, `client/src/services/`, `client/src/hooks/`, `client/src/types/`, `client/src/locales/`, `client/src/router.tsx` |
| 1 | **nlodela-quality-gate** | Review arquitectura, SOLID check, hallucination guard | filesystem, memory, github | `Documentacion/audit/` (reportes) |
| 2 | **tdd-test-writer** | Tests RED: projectDocumentService, ProjectDocumentPage, TipTap integration | filesystem, context7 | `server/src/services/*.test.ts`, `client/src/**/*.test.ts` |
| 2 | **nlodela-backend-platform** | Backend ProjectDocument: model, service, controller, route, validation | filesystem, context7, memory | `server/src/models/ProjectDocument.ts`, `server/src/services/projectDocumentService.ts`, `server/src/controllers/projectDocumentController.ts`, `server/src/routes/projectDocuments.ts` |
| 2 | **nlodela-react-systems** | Frontend PR Document: page, TipTap editor, service, hook, modal | filesystem, context7, memory | `client/src/components/pages/ProjectDocumentPage.tsx`, `client/src/services/projectDocumentService.ts`, etc. |
| 3 | **tdd-test-writer** | Tests RED: Kanban DnD persistence, task assignment flow | filesystem, context7 | `client/src/hooks/useKanban.test.ts`, etc. |
| 3 | **frontend-agent** | Kanban refinado: DnD persistence, glassmorphism cards, animaciones motion | filesystem, context7, memory | `client/src/components/organisms/KanbanBoard.tsx`, etc. |
| 3 | **nlodela-react-systems** | Sprint creation UI, selectors equipo→miembro, tags, fechas entrega | filesystem, context7 | `client/src/components/modals/CreateSprintModal.tsx`, etc. |

---

## 3. Sprint 1 — Epic/Story Frontend CRUD + TDD

### 3.1 Estado Backend (✅ Completo)

| Componente | Status | Notas |
|------------|--------|-------|
| `server/src/models/Epic.ts` | ✅ | `epicNumber` (EPIC-0001), project ref, status, priority, owner |
| `server/src/models/Story.ts` | ✅ | `storyNumber` (STY-0001), epic ref, project ref, assignee, sizing (xs-xl), order |
| `server/src/services/epicService.ts` | ✅ | CRUD + `getEpicsByProject` + populate owner/project |
| `server/src/services/storyService.ts` | ✅ | CRUD + `reorderStories` (bulkWrite para DnD) |
| `server/src/controllers/epicController.ts` | ✅ | 5 métodos estáticos, respuesta `{ success, data }` |
| `server/src/controllers/storyController.ts` | ✅ | 6 métodos estáticos (incluye `reorderStories`) |
| `server/src/routes/epics.ts` | ✅ | `authenticate()` + 5 endpoints |
| `server/src/routes/stories.ts` | ✅ | `authenticate()` + 6 endpoints (incluye `PUT /:id/reorder`) |

### 3.2 Frontend Tareas (TDD Obligatorio)

**RED Phase (tdd-test-writer):**

```
1. client/src/services/epicService.test.ts
   - createEpic() → POST /epics, valida payload, maneja 401/404
   - getEpics(projectId) → GET /epics?projectId=xxx
   - updateEpic(id, data) → PUT /epics/:id
   - deleteEpic(id) → DELETE /epics/:id

2. client/src/services/storyService.test.ts
   - createStory() → POST /stories
   - getStories(epicId|projectId) → GET /stories?epicId=xxx
   - updateStory(id, data) → PUT /stories/:id
   - deleteStory(id) → DELETE /stories/:id
   - reorderStories(epicId, orderedIds) → PUT /stories/:id/reorder

3. client/src/hooks/useEpics.test.ts
   - Carga epics por proyecto
   - Crear epic actualiza estado local
   - Eliminar epic remueve del estado

4. client/src/hooks/useStories.test.ts
   - Carga stories por epic
   - Reorder actualiza orden local
   - Crear story asigna order automático
```

**GREEN Phase (nlodela-react-systems):**

| # | Tarea | Archivo(s) | Convención |
|---|-------|------------|------------|
| 1 | **Types** | `client/src/types/index.ts` | Añadir `Epic`, `Story`, `CreateEpicDTO`, `UpdateEpicDTO`, `CreateStoryDTO`, `UpdateStoryDTO` |
| 2 | **Services** | `client/src/services/epicService.ts`, `storyService.ts` | Usar `api.ts` (fetch puro). NUNCA axios. Export funciones nombradas. |
| 3 | **Hooks** | `client/src/hooks/useEpics.ts`, `useStories.ts` | Context API local (no global). `useCallback` para mutaciones. `useState` + `useEffect` para carga. |
| 4 | **Pages** | `client/src/components/pages/EpicsPage.tsx`, `StoriesPage.tsx` | Lazy-loaded en router. Glassmorphism 100%. Usar `useTranslation()`. |
| 5 | **Modals** | `client/src/components/modals/CreateEpicModal.tsx`, `EditEpicModal.tsx`, `CreateStoryModal.tsx`, `EditStoryModal.tsx` | Reutilizar `GlassCard` + `glass-input` + `glass-button`. Validación Zod antes de submit. |
| 6 | **Router** | `client/src/router.tsx` | Añadir `/projects/:id/epics` y `/projects/:id/epics/:epicId/stories` como lazy. |
| 7 | **Locales** | `client/src/locales/index.ts` | Añadir keys en `en` y `es` para Epic/Story CRUD. |

### 3.3 Acceptance Criteria Sprint 1

- [ ] Todos los tests RED escritos ANTES de implementación
- [ ] Build pasa (`npm run build`) sin errores TypeScript
- [ ] Lint pasa (`npm run lint`) sin warnings
- [ ] Glassmorphism aplicado en TODOS los nuevos componentes
- [ ] `api.ts` es el único método HTTP usado
- [ ] Atomic Design respetado (atoms/molecules para inputs/buttons/cards)
- [ ] i18n completo (es + en) para todos los strings nuevos
- [ ] Router lazy-loading funciona sin errores de Suspense

---

## 4. Sprint 2 — PR Document (Project Requirements) + WYSIWYG TipTap

### 4.1 Alcance

Cada proyecto debe tener un **Project Requirements Document** editable con:

- **Campos estructurados**: descripción, alcance, criterios de aceptación, fechas (inicio/fin), stakeholders (multi-select)
- **Cuerpo libre**: WYSIWYG con TipTap para texto enriquecido (negritas, listas, tablas, imágenes)
- **Versionado**: `version` number, `createdAt`, `updatedAt`, `updatedBy`
- **Permisos**: solo managers/admins del proyecto pueden editar; viewers pueden leer

### 4.2 Backend Tareas (nlodela-backend-platform)

**RED Phase (tdd-test-writer primero):**

```
server/src/services/projectDocumentService.test.ts
  - createDocument(projectId, data) → valida project existe
  - getDocumentByProject(projectId) → latest version
  - updateDocument(id, data, userId) → increment version
  - deleteDocument(id) → soft delete?

server/src/controllers/projectDocumentController.test.ts
  - 401 si no autenticado
  - 403 si no es miembro del proyecto
  - 404 si proyecto no existe
```

**GREEN Phase:**

| # | Tarea | Archivo | Notas |
|---|-------|---------|-------|
| 1 | **Model** | `server/src/models/ProjectDocument.ts` | Mongoose schema: `project` (ref), `title`, `structured` (embedded: description, scope, acceptanceCriteria[], dates, stakeholders[]), `body` (HTML string from TipTap), `version` (Number), `createdBy`, `updatedBy`. `.js` extension en imports. |
| 2 | **Service** | `server/src/services/projectDocumentService.ts` | Business logic: verifica membresía en proyecto antes de mutar. populate `createdBy`/`updatedBy`. |
| 3 | **Controller** | `server/src/controllers/projectDocumentController.ts` | Thin controller. Usar `checkTeamMembership` o similar para permisos. |
| 4 | **Route** | `server/src/routes/projectDocuments.ts` | `authenticate()` + `validate()` + `authorizeProjectMember()` + controller. |
| 5 | **Index** | `server/src/index.ts` | Mount router under `/api/project-documents`. |

### 4.3 Frontend Tareas (nlodela-react-systems)

**RED Phase (tdd-test-writer):**

```
client/src/services/projectDocumentService.test.ts
client/src/hooks/useProjectDocument.test.ts
client/src/components/pages/ProjectDocumentPage.test.tsx
```

**GREEN Phase:**

| # | Tarea | Archivo | Notas |
|---|-------|---------|-------|
| 1 | **TipTap Setup** | `client/package.json` + `client/src/components/ui/organisms/TipTapEditor.tsx` | Instalar `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-table`, `@tiptap/extension-image`. Wrapper React con glassmorphism toolbar. |
| 2 | **Service** | `client/src/services/projectDocumentService.ts` | `api.ts` wrapper. CRUD + `getByProject(projectId)`. |
| 3 | **Hook** | `client/src/hooks/useProjectDocument.ts` | Carga documento por projectId. Mutaciones: create, update, delete. |
| 4 | **Page** | `client/src/components/pages/ProjectDocumentPage.tsx` | Vista del PR Document. Tabs: "Structured" (form) / "Editor" (TipTap). Glassmorphism cards. |
| 5 | **Modal** | `client/src/components/modals/EditProjectDocumentModal.tsx` | Modal para edición inline desde ProjectDetailPage. |
| 6 | **Router** | `client/src/router.tsx` | Añadir `/projects/:id/documents` lazy route. |
| 7 | **Locales** | `client/src/locales/index.ts` | Keys para PR Document en es/en. |

### 4.4 Acceptance Criteria Sprint 2

- [ ] TDD RED→Green→Refactor completo para backend y frontend
- [ ] TipTap renderiza HTML rico con toolbar glassmorphism
- [ ] Formularios validan con Zod antes de enviar (campos obligatorios resaltados)
- [ ] Solo miembros del proyecto pueden editar; otros ven read-only
- [ ] Versionado automático en cada update
- [ ] Build + lint pasan

---

## 5. Sprint 3 — Kanban Refinado + Asignación + Sprints

### 5.1 Alcance

Refinar el Kanban board existente para que sea funcional como ClickUp:

1. **Drag-and-drop persistence**: mover tarjeta entre columnas persiste en backend (`task.status` + `task.order`)
2. **Asignación equipo → miembro**: dropdown select en TaskDetailDialog o card inline
3. **Tags**: multi-select con creación on-the-fly (como ClickUp labels)
4. **Fechas de entrega**: date picker con rangos (startDate, dueDate)
5. **Sprints**: crear sprint (nombre, fechas, goal), asignar tasks al sprint, burndown visual básico

### 5.2 Backend Tareas

| # | Tarea | Archivo | Notas |
|---|-------|---------|-------|
| 1 | **Task updates** | `server/src/services/taskService.ts` | Añadir `updateTaskStatusAndOrder(id, status, order)` para bulk DnD. Socket.IO emit para sync cross-user. |
| 2 | **Sprint model** | `server/src/models/Sprint.ts` (si no existe) | Verificar si existe. Si no, crear: `name`, `goal`, `startDate`, `endDate`, `project`, `status` (planning/active/completed). |
| 3 | **Sprint service** | `server/src/services/sprintService.ts` | CRUD + `assignTasks(sprintId, taskIds)` + `getBurndown(sprintId)`. |
| 4 | **Sprint controller/route** | `server/src/controllers/sprintController.ts`, `routes/sprints.ts` | Endpoints estándar. |

### 5.3 Frontend Tareas

| # | Tarea | Archivo | Notas |
|---|-------|---------|-------|
| 1 | **Kanban DnD persistence** | `client/src/components/organisms/KanbanBoard.tsx` | Usar `@dnd-kit` existente. On drag end: llamar `api.patch('/tasks/:id', { status, order })`. Actualizar optimista local + fallback en error. |
| 2 | **Asignación inline** | `client/src/components/molecules/TaskAssigneeSelect.tsx` | Dropdown equipo → filtra miembros → selecciona. Usar `AppCatalogContext` para catalogs si aplica. |
| 3 | **Tags input** | `client/src/components/molecules/TagInput.tsx` | Creatable multi-select. Colores desde `PROJECT_COLORS`. |
| 4 | **Date range picker** | `client/src/components/molecules/DateRangePicker.tsx` | Glassmorphism styled. `@radix-ui/react-popover` + date-fns. |
| 5 | **Sprint modals** | `client/src/components/modals/CreateSprintModal.tsx`, `EditSprintModal.tsx` | Form: nombre, goal, fechas. |
| 6 | **Sprint board** | `client/src/components/pages/SprintBoardPage.tsx` | Vista Kanban filtrada por sprint activo. |

### 5.4 Acceptance Criteria Sprint 3

- [ ] DnD persiste en backend y se sincroniza vía Socket.IO
- [ ] Asignación equipo→miembro funciona con validación de membresía
- [ ] Tags se crean/assignan en tiempo real
- [ ] Fechas renderizan en glassmorphism cards con badges de "overdue"
- [ ] Sprints se crean, activan, y completan con burndown básico
- [ ] TDD completo para hooks de Kanban y sprintService

---

## 6. Convenciones Obligatorias (No Negociables)

### 6.1 SOLID/DRY/KISS/YAGNI

```yaml
S - Single Responsibility:
  - Cada archivo <= 200 líneas (ideal <= 150)
  - Un hook = un concern (useEpics NO maneja stories)
  - Un service = un recurso (epicService NO importa storyService)

O - Open/Closed:
  - Usar CVA para variantes de componentes (Button, GlassCard)
  - Extender schemas Mongoose con métodos estáticos, no modificar instancias

L - Liskov Substitution:
  - Interfaces frontend alineadas con backend DTOs
  - Epic/Story types en client/src/types/index.ts deben reflejar IEpic/IStory exactamente

I - Interface Segregation:
  - DTOs pequeños: CreateEpicDTO solo tiene campos requeridos para creación
  - Context hooks no exponen métodos no usados por consumidores

D - Dependency Inversion:
  - Controllers dependen de services (abstracciones)
  - Components dependen de hooks (abstracciones), NO de api.ts directamente
  - Services frontend dependen de api.ts (abstracción), nunca fetch directo

DRY:
  - Extraer validaciones Zod a `client/src/utils/validation.ts` y `server/src/utils/validation.ts`
  - Extraer formatos de fecha a `client/src/utils/formatters.ts`
  - Reutilizar GlassCard, glass-input, glass-button en TODOS los modales

KISS:
  - No crear abstracciones genéricas CRUD "baseService" a menos que se repitan >3 veces
  - Preferir useState + useEffect sobre useReducer salvo que el estado sea complejo (>3 props relacionadas)

YAGNI:
  - No implementar colaboración en tiempo real en TipTap (solo guardar/load)
  - No implementar notificaciones push para Sprint 3 (usar Socket.IO existente)
  - No implementar reportes avanzados hasta que se pida explícitamente
```

### 6.2 Atomic Design + Glassmorphism

```yaml
atoms:
  - GlassButton (con variantes: default, primary, danger, ghost)
  - GlassInput (con estados: default, error, disabled)
  - GlassSelect (dropdown estilizado)
  - GlassBadge (para status/priority/tags)

molecules:
  - EpicCard (usa GlassCard + GlassBadge + GlassButton)
  - StoryCard (usa GlassCard + GlassBadge + assignee avatar)
  - FormField (label + GlassInput + error message)
  - TagInput (creatable multi-select con GlassBadge)

organisms:
  - EpicList (lista de EpicCards con DnD si aplica)
  - StoryList (lista de StoryCards con reorder)
  - TipTapEditor (toolbar + editor area)
  - KanbanColumn (columna de status con cards)

templates:
  - ProjectDetailTemplate (layout de proyecto con tabs: Overview, Epics, Stories, Documents, Kanban)

pages:
  - EpicsPage
  - StoriesPage
  - ProjectDocumentPage
  - SprintBoardPage
```

### 6.3 HTTP Layer (FETCH PURO)

```typescript
// ❌ PROHIBIDO
import axios from 'axios';

// ✅ OBLIGATORIO
import { api, ApiRequestError } from '@/services/api';

try {
  const { data } = await api.get<Epic[]>('/epics?projectId=' + projectId);
} catch (err) {
  if (err instanceof ApiRequestError) {
    toast.error(err.data?.message || t('errors.unknown'));
  }
}
```

### 6.4 State Management (Context API)

```
AuthProvider (global) → AppCatalogProvider (global) → SocketProvider (global)
  └── Router
       ├── /projects/:id → ProjectDetailPage
       │   └── ProjectContext (scoped, creado en page) → Epics + Stories + Document
       └── /tasks → TaskContext (existe, no modificar)
```

**NO crear Context global para Epics/Stories.** Usar Context local en `ProjectDetailPage` o hooks con `useState` + `useCallback` si el árbol es pequeño (< 5 niveles).

### 6.5 Server ESM Imports

```typescript
// ✅ OBLIGATORIO
import EpicService from '../services/epicService.js';
import { NotFoundError } from '../utils/errors.js';

// ❌ PROHIBIDO (rompe build de dist/)
import EpicService from '../services/epicService';
```

---

## 7. Quality Gates

### 7.1 Pre-Implementation Gate (antes de escribir código)

- [ ] Tests RED escritos y fallando (tdd-test-writer)
- [ ] DTOs definidos en `client/src/types/index.ts` y `server/src/types/`
- [ ] Router entries planificados (sin conflictos de path)
- [ ] Locales keys definidos en es + en
- [ ] Glassmorphism CSS classes identificadas (reutilizar `.glass-card`, `.glass-input`, etc.)

### 7.2 Implementation Gate (durante código)

- [ ] Cada commit <= 50 líneas de cambio (facilita review)
- [ ] Git message: `feat(scope): description` (ej: `feat(epics): add CreateEpicModal with glassmorphism`)
- [ ] Co-authored-by: Copilot incluido
- [ ] No `any` usado (TypeScript strict)
- [ ] Import order: React → 3rd party → `@/` → relative

### 7.3 Post-Implementation Gate (antes de merge)

- [ ] `npm run build` pasa (client + server)
- [ ] `npm run lint` pasa sin errores
- [ ] `npm --prefix client run test:run` pasa (Vitest)
- [ ] `npm --prefix server run test:run` pasa (Vitest)
- [ ] `npm --prefix server run typecheck` pasa (`tsc --noEmit`)
- [ ] nlodela-quality-gate revisa: SOLID compliance, DRY check, hallucination guard
- [ ] zeus (opcional) audita si hay cambios en auth/middleware

---

## 8. Handoff Contracts

### 8.1 tdd-test-writer → nlodela-react-systems

```yaml
input:
  test_files:
    - client/src/services/epicService.test.ts
    - client/src/services/storyService.test.ts
    - client/src/hooks/useEpics.test.ts
    - client/src/hooks/useStories.test.ts
  contract:
    - Cada test describe el comportamiento esperado (no la implementación)
    - Mocks de api.ts para aislar services
    - Mocks de services para aislar hooks

output:
  implementation:
    - Services que pasan los tests
    - Hooks que pasan los tests
    - Components que integran hooks
```

### 8.2 nlodela-backend-platform → nlodela-react-systems (Sprint 2)

```yaml
input:
  backend_contract:
    - OpenAPI-like spec: endpoints, payloads, response shapes
    - DTOs en server/src/types/
    - Postman/curl examples en Documentacion/

output:
  frontend_integration:
    - Services que consumen exactamente los endpoints definidos
    - Types que mapean 1:1 con backend DTOs
```

### 8.3 nlodela-react-systems → nlodela-quality-gate

```yaml
input:
  code_bundle:
    - Files modificados (git diff)
    - Tests nuevos + existentes
    - Storybook/preview si aplica

output:
  review_report:
    - SOLID score
    - DRY violations
    - Glassmorphism compliance
    - i18n completeness
    - Hallucination check (código inventado?)
```

---

## 9. Commands Cheat Sheet para Agentes

```bash
# Verificar build antes de cualquier PR
npm run build

# Tests (obligatorio TDD)
npm --prefix client run test:run
npm --prefix server run test:run

# Lint (obligatorio en cada commit)
npm run lint

# TypeCheck server
npm --prefix server run typecheck

# Dev (para validación manual)
npm run dev

# Instalar TipTap (Sprint 2)
npm --prefix client install @tiptap/react @tiptap/starter-kit @tiptap/extension-table @tiptap/extension-image

# Instalar dnd-kit si falta (Sprint 3)
npm --prefix client install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

---

## 10. Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **TipTap bundle size** | Medium | Medium | Usar lazy import del editor. Solo cargar en `/projects/:id/documents`. |
| **DnD persistence race conditions** | Medium | High | Usar optimistic update + rollback en error. Socket.IO sync cross-user. |
| **Context API performance** | Low | Medium | Si ProjectContext crece > 5 props, split en EpicContext + StoryContext. |
| **Backend auth middleware gaps** | Low | High | Zeus audita si se añaden nuevas rutas sin `authenticate()` + `authorize()`. |
| **i18n incompleto** | High | Low | Quality gate verifica keys faltantes con script grep. |

---

## 11. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 3.0.0 | 2026-05-04 | Copilot (NLodela) | Initial strategy covering Sprints 1–3 with agent orchestration, TDD, and glassmorphism constraints |

---

**Canonical Sources of Truth:**
- `AGENTS.md` (repo root) — Main architecture constraints
- `CODE_REVIEW_SOLID.md` — SOLID/DRY/KISS/YAGNI reference
- `Documentacion/00_Indice_General.md` — Documentation index

**Next Steps:**
1. Sisyphus activa Phase 1 (Fan-Out Analysis)
2. tdd-test-writer genera tests RED para Sprint 1
3. nlodela-react-systems implementa Epic/Story frontend
4. nlodela-quality-gate verifica entrega Sprint 1
5. Repetir para Sprint 2 y 3
