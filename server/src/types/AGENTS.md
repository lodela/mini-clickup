# Server Types Guidelines

## Overview

TypeScript type definitions, interfaces, and DTOs for all domain entities.

## Structure

```
server/src/types/
├── team.types.ts       # Team domain types (existing)
├── task.types.ts       # Task domain types
├── project.types.ts    # Project domain types
├── user.types.ts       # User domain types
├── auth.types.ts       # Authentication domain types
└── AGENTS.md           # This file
```

## Where to Look

| Domain        | File              | Key DTOs                          |
| ------------- | ----------------- | --------------------------------- |
| Teams         | `team.types.ts`   | CreateTeamDTO, TeamResponse       |
| Tasks         | `task.types.ts`   | CreateTaskDTO, TaskResponse       |
| Projects      | `project.types.ts`| CreateProjectDTO, ProjectResponse |
| Users         | `user.types.ts`   | RegisterUserDTO, UserResponse     |
| Authentication| `auth.types.ts`   | AuthResponseDTO, JWTPayload       |

## Type Categories

### 1. DTOs (Data Transfer Objects)
```typescript
// Create DTO - Required fields for creation
export interface CreateTaskDTO {
  title: string;
  reporterId: string;
  projectId: string;
  // ...
}

// Update DTO - All fields optional (partial update)
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  // ...
}

// Response DTO - Standardized API response
export interface TaskResponse {
  _id: string;
  title: string;
  // ...
}
```

### 2. Query Parameters
```typescript
export interface TaskQueryParams {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
```

### 3. Type Aliases from Models
```typescript
// Re-export types from models for consistency
export type { TaskStatus } from "../models/Task.js";
export type { ProjectStatus } from "../models/Project.js";
export type { UserRole } from "../models/User.js";
```

## Usage Examples

### In Controllers
```typescript
import { Request, Response, NextFunction } from "express";
import { CreateTaskDTO, TaskResponse } from "../types/task.types.js";

export async function createTask(
  req: Request<unknown, TaskResponse, CreateTaskDTO>,
  res: Response<TaskResponse>,
  next: NextFunction,
): Promise<void> {
  const taskData: CreateTaskDTO = req.body;
  const task = await taskService.create(taskData);
  res.status(201).json(task);
}
```

### In Services
```typescript
import { CreateTaskDTO, TaskResponse } from "../types/task.types.js";
import Task from "../models/Task.js";

export async function createTaskService(data: CreateTaskDTO): Promise<TaskResponse> {
  const task = await Task.create(data);
  return formatTaskResponse(task);
}

function formatTaskResponse(task: InstanceType<typeof Task>): TaskResponse {
  return {
    _id: task._id.toString(),
    title: task.title,
    // ...
  };
}
```

### In Routes
```typescript
import { validate } from "../middleware/validation.js";
import { createTaskSchema } from "../schemas/task.schema.js";
import { CreateTaskDTO } from "../types/task.types.js";

router.post(
  "/",
  validate<CreateTaskDTO>(createTaskSchema),
  taskController.createTask
);
```

## Naming Conventions

```typescript
// ✅ Suffix with DTO for data transfer objects
CreateTaskDTO
UpdateTaskDTO
TaskResponse

// ✅ Suffix with Params for query parameters
TaskQueryParams
PaginationParams

// ✅ Suffix with Response for API responses
TaskResponse
TaskListResponse
AuthResponseDTO

// ✅ Use exact names for type aliases from models
TaskStatus
ProjectStatus
UserRole

// ❌ Avoid vague names
TaskData      // Too generic
TaskInfo      // Too generic
TaskObject    // Redundant
```

## Best Practices

### 1. Always Use DTOs in Service Layer
```typescript
// ✅ CORRECT
export async function createTeamService(
  userId: string,
  teamData: CreateTeamDTO,
): Promise<TeamResponse> {
  // Implementation
}

// ❌ INCORRECT - Using Mongoose document directly
export async function createTeamService(
  userId: string,
  teamData: Partial<ITeam>,
): Promise<ITeam> {
  // Implementation
}
```

### 2. Separate Create and Update DTOs
```typescript
// ✅ Create DTO - All required fields
export interface CreateTaskDTO {
  title: string;           // required
  reporterId: string;      // required
  projectId: string;       // required
}

// ✅ Update DTO - All optional (partial)
export interface UpdateTaskDTO {
  title?: string;
  reporterId?: string;
  projectId?: string;
}
```

### 3. Use Response DTOs for API Consistency
```typescript
// ✅ Response DTO - Consistent format
export interface TaskResponse {
  _id: string;            // Always string (not ObjectId)
  createdAt: string;      // ISO 8601 (not Date)
  updatedAt: string;      // ISO 8601
  assignee?: {
    _id: string;
    name: string;
    email: string;
  } | null;
}

// ❌ Raw Mongoose document
{
  _id: Types.ObjectId;
  createdAt: Date;
  __v: number;
  assignee: Types.ObjectId;
}
```

### 4. Include Pagination Metadata
```typescript
// ✅ List response with pagination
export interface TaskListResponse {
  tasks: TaskResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ❌ Bare array
TaskResponse[];
```

## Common Patterns

### Paginated Query
```typescript
export interface PaginatedQuery {
  page?: number;        // default: 1
  limit?: number;       // default: 10, max: 100
  sortBy?: string;      // default: "createdAt"
  sortOrder?: "asc" | "desc";
}
```

### Standard Response
```typescript
export interface StandardResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: Array<{ field: string; message: string }>;
}
```

### List Response
```typescript
export interface ListResponse<T> {
  success: true;
  data: T[];
  count: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## Anti-Patterns

```typescript
// ❌ Using `any` type
export interface BadExample {
  data: any;            // Loses type safety
}

// ✅ Use generics or specific types
export interface GoodExample {
  data: unknown;        // Or specific type
}

// ❌ Mixing ObjectId and string
export interface Inconsistent {
  _id: Types.ObjectId;  // Mongoose type
  userId: string;       // String type
}

// ✅ Consistent string types for API
export interface Consistent {
  _id: string;
  userId: string;
}

// ❌ Optional response fields without reason
export interface BadResponse {
  _id: string;
  name?: string;        // Why optional?
}

// ✅ Required fields with clear optionals
export interface GoodResponse {
  _id: string;
  name: string;
  description?: string; // Clearly optional field
}
```

## Integration with Zod

Types should align with Zod schemas:

```typescript
// Zod schema
export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
});

// TypeScript type (should match)
export interface CreateTaskDTO {
  title: string;                    // min 1, max 200
  description?: string;             // max 5000
  priority?: "low" | "medium" | "high" | "urgent";
}

// ✅ Extract type from Zod (DRY approach)
export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
```

## TODO: Enhancements

- [ ] Add `sprint.types.ts` for sprint domain
- [ ] Add `dashboard.types.ts` for dashboard widgets
- [ ] Add `notification.types.ts` for notifications
- [ ] Create shared `common.types.ts` for reusable types
- [ ] Add `api.types.ts` for generic API responses
- [ ] Implement Zod type inference for all DTOs

## Notes

- All ObjectId references should be `string` in DTOs (not `Types.ObjectId`)
- All dates should be ISO 8601 strings in responses (not `Date` objects)
- Use `?` for optional fields, `| null` for nullable fields
- Re-export enum types from models for consistency
- Keep DTOs in sync with Zod validation schemas
- Use descriptive names (avoid generic names like `Data`, `Info`)
