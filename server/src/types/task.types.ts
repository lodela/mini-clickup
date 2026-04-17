/**
 * Task Domain Types
 * Type definitions for task-related operations
 * 
 * @module types/task.types
 */

import { TaskStatus, TaskPriority, TaskType, WorkflowState } from "../models/Task.js";

/**
 * Task Status Type
 */
export type { TaskStatus };

/**
 * Task Priority Type
 */
export type { TaskPriority };

/**
 * Task Type
 */
export type { TaskType };

/**
 * Workflow State Type (for tasks in QA)
 */
export type { WorkflowState };

/**
 * Create Task DTO
 * Data required to create a new task
 */
export interface CreateTaskDTO {
  title: string;                    // required, 1-200 chars
  description?: string;             // optional, max 5000 chars
  status?: TaskStatus;              // default: "todo"
  priority?: TaskPriority;          // default: "medium"
  type?: TaskType;                  // default: "task"
  assigneeId?: string;              // optional, ObjectId
  reporterId: string;               // required, ObjectId
  projectId: string;                // required, ObjectId
  teamId: string;                   // required, ObjectId
  dueDate?: string | Date;          // optional
  tags?: string[];                  // default: []
  estimatedHours?: number;          // optional, min: 0
}

/**
 * Update Task DTO
 * Partial data for updating an existing task
 */
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  type?: TaskType;
  workflowState?: WorkflowState;
  assigneeId?: string | null;
  dueDate?: string | Date | null;
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
  qaRejectionReason?: string;
}

/**
 * Task Assignment DTO
 * Data for assigning a task to a user
 */
export interface AssignTaskDTO {
  assigneeId: string | null;        // null to unassign
}

/**
 * Task Status Update DTO
 * Data for updating task status
 */
export interface TaskStatusUpdateDTO {
  status: TaskStatus;
  workflowState?: WorkflowState;
}

/**
 * Task QA Decision DTO
 * Data for QA approval/rejection
 */
export interface TaskQADecisionDTO {
  decision: "approve" | "reject";
  reason?: string;                  // required if reject
  sprintId?: string;                // required if approve
}

/**
 * Add Comment DTO
 * Data for adding a comment to a task
 */
export interface AddCommentDTO {
  content: string;                  // required, 1-2000 chars
  authorId: string;                 // required, ObjectId
}

/**
 * Add Attachment DTO
 * Data for adding an attachment to a task
 */
export interface AddAttachmentDTO {
  name: string;                     // required
  url: string;                      // required
  size: number;                     // required, bytes
  mimeType: string;                 // required
  uploadedById: string;             // required, ObjectId
}

/**
 * Task Query Parameters
 * Query parameters for listing tasks
 */
export interface TaskQueryParams {
  page?: number;                    // default: 1
  limit?: number;                   // default: 10, max: 100
  status?: TaskStatus;
  priority?: TaskPriority;
  type?: TaskType;
  assigneeId?: string;
  reporterId?: string;
  projectId?: string;
  teamId?: string;
  sprintId?: string;
  tags?: string;                    // comma-separated
  sortBy?: string;                  // default: "createdAt"
  sortOrder?: "asc" | "desc";       // default: "desc"
}

/**
 * Task Response DTO
 * Standardized task response format
 */
export interface TaskResponse {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  workflowState?: WorkflowState;
  assignee?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null;
  reporter: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  project: {
    _id: string;
    name: string;
    color?: string;
  };
  team: {
    _id: string;
    name: string;
    avatar?: string;
  };
  dueDate?: string;                 // ISO 8601
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
  qaRejectionReason?: string;
  timeInQA?: number;                // hours
  sprintId?: string;
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    mimeType: string;
    uploadedAt: string;             // ISO 8601
    uploadedBy: string;
  }>;
  comments: Array<{
    id: string;
    content: string;
    author: string;
    createdAt: string;              // ISO 8601
    updatedAt?: string;             // ISO 8601
  }>;
  createdAt: string;                // ISO 8601
  updatedAt: string;                // ISO 8601
}

/**
 * Task List Response
 * Paginated list of tasks
 */
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

/**
 * Task Statistics
 * Aggregated task data for dashboards
 */
export interface TaskStatistics {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
  byType: Record<TaskType, number>;
  overdue: number;
  completedThisSprint: number;
  averageTimeInStatus: Record<TaskStatus, number>;  // hours
}

/**
 * Task Board Column
 * Tasks grouped by status for Kanban board
 */
export interface TaskBoardColumn {
  status: TaskStatus;
  tasks: TaskResponse[];
  count: number;
}

/**
 * Task Board Response
 * All columns for Kanban board
 */
export interface TaskBoardResponse {
  columns: TaskBoardColumn[];
  projectId: string;
  teamId: string;
}
