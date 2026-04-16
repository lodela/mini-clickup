# Mini ClickUp MVP Work Plan

**Version:** 1.0.0  
**Created:** 2026-03-19  
**Status:** Ready for Execution  
**Architecture:** MERN Stack + Socket.IO  
**Team:** 1 Developer (20+ years experience) + 1 Planner (AI Agent)

---

## 🎯 Executive Summary

This work plan delivers a **usable Minimum Viable Product (MVP)** for Mini ClickUp that fulfills the core requirements:

✅ **User authentication** (login/register/logout) - _Already 100% complete_  
✅ **Team management** - _90% complete, needs minor finishing_  
✅ **Task workflow with Kanban board** (Todo → In Progress → Review → Done → QA)  
✅ **Automatic QA transition** when tasks reach "Done"  
✅ **Bug creation** on QA rejection (separate entity from tasks)  
✅ **Socket.IO notifications** (header indicator + team chat)  
✅ **Sprint backlog tracking** for approved QA items  
✅ **Complete documentation** with flowcharts and OpenAPI specs

**Excluded from MVP:** Advanced reporting, Gantt charts, custom fields, automation rules, mobile app, email notifications.

**Total Estimated Effort:** 29 story points (~7-10 days at current velocity)

---

## 📊 Current State Assessment

### ✅ Working Components (No Action Needed)

| Component                    | Status      | Evidence                                                                    |
| ---------------------------- | ----------- | --------------------------------------------------------------------------- |
| **Authentication**           | 100%        | JWT, refresh tokens, HttpOnly cookies, bcrypt, validation                   |
| **Team Management**          | 90%         | CRUD, invitations, roles working (avatar upload/ownership transfer pending) |
| **Socket.IO Infrastructure** | Configured  | SocketContext.tsx established                                               |
| **Design Tokens**            | Implemented | Colors, typography, spacing in globals.css                                  |
| **CI/CD Pipeline**           | Complete    | GitHub Actions, IIS deployment ready                                        |

### ⚠️ Partially Complete (Needs Work)

| Component             | Status     | Gap                                           |
| --------------------- | ---------- | --------------------------------------------- |
| **Projects API**      | 0% missing | No controller/service/routes                  |
| **Tasks API**         | 0% missing | No controller/service/routes                  |
| **Kanban Board**      | 0% missing | Mock data only in frontend                    |
| **Workflow Logic**    | 0% missing | No QA automation, bug tracking, notifications |
| **Atomic Components** | Missing    | Checkbox, Radio, Badge, Avatar components     |

### ❌ Not Started

| Component                   | Status          |
| --------------------------- | --------------- |
| **Bug Entity/Model**        | Not implemented |
| **Sprint/Backlog Tracking** | Not implemented |
| **Notification System**     | Not implemented |
| **OpenAPI Documentation**   | Not created     |
| **Workflow Flowcharts**     | Not created     |

---

## 🗂️ Phase Breakdown

### Phase 1: Core API Infrastructure (8 story points)

**Goal:** Replace mock data with real Projects and Tasks APIs connected to MongoDB.

#### Tasks:

1. **Create Projects API** (2 MD)
   - `server/src/controllers/projectController.ts`
   - `server/src/services/projectService.ts`
   - `server/src/routes/projects.ts`
   - Implement full CRUD operations
   - Add validation with Zod schemas
   - Connect to existing Team/User models

2. **Create Tasks API** (2 MD)
   - `server/src/controllers/taskController.ts`
   - `server/src/services/taskService.ts`
   - `server/src/routes/tasks.ts`
   - Implement full CRUD operations
   - Add validation with Zod schemas
   - Include task-specific methods (updateStatus, addComment, etc.)

3. **Connect Frontend to Real APIs** (2 L)
   - `client/src/hooks/useProjects.ts`
   - `client/src/hooks/useTasks.ts`
   - Update `ProjectsPage.tsx` to use real API
   - Update `TasksPage.tsx` to use real API
   - Update `DashboardPage.tsx` to show real stats
   - Remove all hardcoded mock data

**Acceptance Criteria:**

- [ ] Projects API returns real data from MongoDB (not mock)
- [ ] Tasks API returns real data from MongoDB (not mock)
- [ ] Creating/updating/deleting projects persists to database
- [ ] Creating/updating/deleting tasks persists to database
- [ ] Dashboard shows real-time statistics from APIs
- [ ] All API endpoints return proper HTTP status codes
- [ ] Input validation works correctly (Zod schemas)
- [ ] Error handling returns appropriate error messages
- [ ] No hardcoded mock data remains in Projects/Tasks pages

---

### Phase 2: Workflow Implementation (13 story points)

**Goal:** Implement the complete task lifecycle: Create → In Progress → Review → Done → QA (auto) → [Approved=sprint backlog, Rejected=bug].

#### Tasks:

1. **Extend Task Model for Workflow** (1 L)
   - Add `type: 'task' | 'bug'` discriminator field
   - Add `workflowState` enum: ['draft', 'in-progress', 'review', 'done', 'qa', 'approved', 'rejected']
   - Add `qaRejectionReason` field (string, nullable)
   - Add `timeInQA` field (number, hours, nullable)
   - Add `sprintId` reference (ObjectId, nullable)
   - Implement automatic QA transition in `updateStatus` method
   - Implement bug creation method on QA rejection

2. **Create Bug Handling Methods** (1 MD)
   - `taskSchema.methods.convertToBug(reason: string): Promise<IBug>`
   - `taskSchema.methods.approveForSprint(sprintId: Types.ObjectId): Promise<void>`
   - Ensure bugs have separate workflow (can't go back to task state)

3. **Implement Notification System** (2 MD)
   - Socket.IO events:
     - `task:status-changed` (payload: { taskId, oldStatus, newStatus, userId })
     - `task:assigned` (payload: { taskId, assigneeId, assignerId })
     - `task:qa-ready` (payload: { taskId, completedById })
     - `bug:created` (payload: { bugId, rejectedTaskId, reason })
   - Header notification component (unread count badge)
   - Team chat integration (post messages to team Socket.IO room)

4. **Create Manager/QA Interfaces** (2 L)
   - Pending approval queue (for tasks in QA state)
   - QA review modal with approval/rejection buttons
   - Bug creation form (auto-populated from task data)
   - Sprint assignment dropdown (for approved QA items)

5. **Add Sprint Tracking** (1 MD)
   - Create simple Sprint model (name, startDate, endDate, goal, status)
   - Add sprint reference to Task/Bug models
   - Create basic sprint planning interface
   - Implement backlog prioritization (drag-and-drop ordering)

**Acceptance Criteria:**

- [ ] Tasks automatically transition to QA when status changes to 'done'
- [ ] QA rejection creates a separate bug entity with rejection reason
- [ ] Approved QA items can be assigned to a sprint
- [ ] Real-time notifications appear in header and team chat
- [ ] Manager/QA can view pending approval queue
- [ ] Bugs have distinct workflow from tasks (no conversion back)
- [ ] Time in QA is tracked and stored
- [ ] All workflow state transitions are persisted to MongoDB
- [ ] Socket.IO events are emitted correctly for all state changes
- [ ] Notification badge shows unread count accurately
- [ ] Team chat receives appropriate workflow messages

---

### Phase 3: Kanban Board & UI Components (5 story points)

**Goal:** Implement interactive Kanban board with drag-and-drop and missing atomic components.

#### Tasks:

1. **Install and Configure Kanban Library** (1 CH)
   - Install `react-beautiful-dnd` (selected per user preference)
   - Create reusable `KanbanBoard` component
   - Create `KanbanColumn` component
   - Create `KanbanCard` component (for tasks/bugs)

2. **Build Kanban Board View** (1 L)
   - New route: `/kanban/:projectId`
   - Columns: Todo, In Progress, Review, Done, QA
   - Drag-and-drop between columns updates task status
   - Special handling: Done → QA is automatic (user can't drag from Done)
   - Cards show: title, assignee avatar, priority badge, tags
   - Click card opens task detail modal

3. **Implement Missing Atomic Components** (2 MD)
   - **Checkbox**: Custom accessible checkbox with indeterminate state
   - **Radio**: Radio button group component
   - **Badge**: Status/priority badges (matching Figma variants)
   - **Avatar**: User avatar with initials fallback and image support
   - All components follow design system tokens and are accessible

4. **Enhanced Task Detail Modal** (1 MD)
   - Fields: title, description, assignee, priority, tags, dueDate
   - Status workflow controls (based on user permissions)
   - Assignment dropdown (with team filtering)
   - Comment section with real-time updates
   - Attachment upload/download
   - Activity log (who did what and when)
   - For bugs: rejection reason, original task link

**Acceptance Criteria:**

- [ ] Kanban board loads without errors
- [ ] Tasks appear in correct columns based on status
- [ ] Drag-and-drop between Todo/In Progress/Review updates status via API
- [ ] Tasks in Done column automatically move to QA (no drag possible)
- [ ] QA column shows tasks ready for approval
- [ ] Moving task to QA triggers Socket.IO notification
- [ ] All atomic components render correctly and are accessible
- [ ] Task detail modal shows all relevant fields
- [ ] Status transitions work correctly in modal
- [ ] Comments update in real-time via Socket.IO
- [ ] Attachments can be uploaded and downloaded
- [ ] Mobile-responsive layout works correctly

---

### Phase 4: Sprint Tracking & Documentation (3 story points)

**Goal:** Add basic sprint/backlog functionality and create complete documentation.

#### Tasks:

1. **Implement Basic Sprint Functionality** (1 MD)
   - Sprint model: name, startDate, endDate, goal, status ('planning', 'active', 'completed')
   - Simple sprint creation/view interface
   - Backlog view showing unassigned approved tasks/bugs
   - Drag-and-drop prioritization in backlog
   - Ability to assign backlog items to active sprint

2. **Create OpenAPI Documentation** (1 L)
   - Generate OpenAPI 3.0 specification for all APIs
   - Include: Projects, Tasks, Teams, Auth, Sprint endpoints
   - Detailed schemas with examples for request/response
   - Error response schemas
   - Security schemes (JWT bearer token)
   - Save as `docs/openapi.yaml` or `docs/openapi.json`

3. **Create Workflow Flowcharts** (1 CH)
   - Mermaid syntax flowchart for task lifecycle
   - Mermaid syntax flowchart for bug creation flow
   - Mermaid syntax flowchart for notification system
   - Include in documentation folder
   - Add explanatory text for each flowchart

**Acceptance Criteria:**

- [ ] Sprint model stores data correctly in MongoDB
- [ ] Users can create, view, and update sprints
- [ ] Approved QA items appear in backlog prioritization view
- [ ] Drag-and-drop reordering works in backlog
- [ ] Items can be assigned from backlog to active sprint
- [ ] OpenAPI spec validates against OpenAPI 3.0 standard
- [ ] All endpoints are documented with parameters, responses, examples
- [ ] Flowcharts are clear and correctly represent workflows
- [ ] Documentation is human-readable and comprehensive
- [ ] No technical jargon without explanation

---

## 📈 Milestones & Definition of Done

### Milestone 1: API Foundation Complete (End of Phase 1)

**Definition of Done:**

- [ ] Projects API fully functional (CRUD)
- [ ] Tasks API fully functional (CRUD)
- [ ] Frontend shows real data from APIs (no mocks)
- [ ] Dashboard displays real-time statistics
- [ ] All API tests pass (if written)
- [ ] No 500 errors in API endpoints under normal use

### Milestone 2: Workflow Functional (End of Phase 2)

**Definition of Done:**

- [ ] Tasks auto-transition to QA when marked Done
- [ ] QA rejection creates separate bug entity
- [ ] Approved QA items can be sprint-assigned
- [ ] Real-time notifications work (header + team chat)
- [ ] Manager/QA interfaces functional
- [ ] No workflow state can be set incorrectly
- [ ] All data persists correctly to MongoDB

### Milestone 3: UI Complete (End of Phase 3)

**Definition of Done:**

- [ ] Kanban board fully interactive
- [ ] Drag-and-drop works between appropriate columns
- [ ] Missing atomic components implemented and used
- [ ] Task detail modal shows all data and allows edits
- [ ] Real-time updates via Socket.IO in UI
- [ ] Mobile-responsive layout functional
- [ ] Accessibility compliant (WCAG AA baseline)

### Milestone 4: Documentation Complete (End of Phase 4)

**Definition of Done:**

- [ ] OpenAPI specification generated and valid
- [ ] Workflow flowcharts created and accurate
- [ ] Documentation explains system to new developers
- [ ] All APIs, components, and workflows documented
- [ ] No undocumented public interfaces

### FINAL MVP: Shippable Product

**Definition of Done:**

- [ ] All 4 milestones completed
- [ ] User can: register/login/logout
- [ ] User can: create/manage teams
- [ ] User can: create projects and add tasks
- [ ] User can: move tasks through workflow via Kanban
- [ ] System auto-transitions Done → QA
- [ ] QA can approve/reject tasks (creating bugs if rejected)
- [ ] Approved items go to sprint backlog
- [ ] Real-time notifications work
- [ ] Documentation allows new developer to understand system
- [ ] No blocking bugs in core workflow
- [ ] Performance acceptable (<2s page loads, <100ms API responses)

---

## ⏱️ Estimated Timeline

| Phase                      | Story Points | Estimated Days | Notes                                      |
| -------------------------- | ------------ | -------------- | ------------------------------------------ |
| **Phase 1: Core APIs**     | 8            | 2-3 days       | Parallel work possible on frontend/backend |
| **Phase 2: Workflow**      | 13           | 3-4 days       | Most complex phase, may require iteration  |
| **Phase 3: Kanban & UI**   | 5            | 1-2 days       | Depends on Phase 1 completion              |
| **Phase 4: Sprint & Docs** | 3            | 1 day          | Can overlap with Phase 3                   |
| **Buffer / Integration**   | -            | 1-2 days       | For unexpected issues, polishing           |
| **TOTAL**                  | **29**       | **7-10 days**  | Assuming 4-6 hours/day productive work     |

**Velocity Reference:** Based on Sprint 0 completion (3 days for setup+scaffold) and team velocity documented.

---

## 📋 Risks & Mitigations (Informational Only)

While not required per user request, noting briefly for awareness:

1. **Scope Creep Mitigation:** Strict adherence to INCLUDE/EXCLUDE lists in this plan
2. **Technical Debt:** Existing code quality is good; follow same patterns
3. **Integration Risk:** Phase 1 must be solid before Phase 2 workflow logic
4. **UI/UX Consistency:** Follow existing design system and component patterns
5. **Testing Gap:** No existing tests; focus on manual verification per criteria

---

## 📁 File Creation Summary

### New Files to Create:

```
server/src/controllers/projectController.ts
server/src/services/projectService.ts
server/src/routes/projects.ts
server/src/controllers/taskController.ts
server/src/services/taskService.ts
server/src/routes/tasks.ts
client/src/hooks/useProjects.ts
client/src/hooks/useTasks.ts
client/src/components/kanban/KanbanBoard.tsx
client/src/components/kanban/KanbanColumn.tsx
client/src/components/kanban/KanbanCard.tsx
client/src/components/ui/Checkbox.tsx
client/src/components/ui/Radio.tsx
client/src/components/ui/Badge.tsx
client/src/components/ui/Avatar.tsx
client/src/components/layout/HeaderNotifications.tsx
client/src/components/modals/QAReviewModal.tsx
client/src/components/modals/BugCreationModal.tsx
client/src/components/modals/TaskDetailModal.tsx
docs/openapi.yaml
docs/workflow-flowcharts.md
```

### Files to Modify:

```
server/src/models/Task.ts (extend with workflow fields)
client/src/components/pages/ProjectsPage.tsx (connect to API)
client/src/components/pages/TasksPage.tsx (connect to API)
client/src/components/pages/DashboardPage.tsx (connect to API)
client/src/contexts/SocketContext.tsx (add workflow events)
client/src/App.tsx (add Kanban route)
```

### Files That Can Remain Unchanged (Good Foundation):

```
server/src/routes/auth.ts (complete)
server/src/routes/team.ts (90% complete)
server/src/models/User.ts (complete)
server/src/models/Team.ts (90% complete)
client/src/contexts/AuthContext.tsx (complete)
client/src/hooks/useAuth.ts (complete)
client/src/components/pages/LoginPage.tsx (complete)
client/src/components/pages/RegisterPage.tsx (complete)
client/src/styles/globals.css (design tokens complete)
```

---

## 🚀 Next Steps

1. **Begin Execution:** Start with Phase 1 tasks (Projects API)
2. **Daily Check-ins:** Use the todo list in this plan to track progress
3. **Verification:** Verify each acceptance criterion before moving on
4. **Documentation:** Update this plan as learnings emerge during development
5. **Final Review:** Run through Definition of Done for MVP before considering complete

**To start work:** Use `/start-work mini-clickup-mvp` command when ready to begin implementation.

---

_Plan generated by Prometheus (AI Planner) for Mini ClickUp MVP Development_
_Based on confirmed requirements and technical assessment_
