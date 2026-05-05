/**
 * Application-wide TypeScript types and interfaces
 */

export type UserRole =
  | 'GOD_USER'
  | 'TENANT_ADMIN'
  | 'DEPT_LEAD'
  | 'TEAM_MEMBER';

/**
 * User Interface
 */
export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  teams?: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Team Member
 */
export interface TeamMember {
  user: string | User;
  role: 'admin' | 'member' | 'guest';
  joinedAt: string;
}

/**
 * Team Interface
 */
export interface Team {
  _id: string;
  name: string;
  description?: string;
  owner: string | User;
  members: TeamMember[];
  projects?: string[];
  avatar?: string;
  memberCount?: number;
  projectCount?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Project Status
 */
export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed';

/**
 * Project Interface
 */
export interface Project {
  _id: string;
  name: string;
  description?: string;
  team: string | Team;
  owner: string | User;
  members: (string | User)[];
  status: ProjectStatus;
  color?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Task Status
 */
export type TaskStatus = 'planning' | 'backlog' | 'todo' | 'doing' | 'qa' | 'done';

/**
 * Task Type (Tarea/Bug)
 */
export type TaskType = 'task' | 'bug';

/**
 * Task Priority
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Embedded Task Comment (backend ITaskComment)
 */
export interface TaskComment {
  id: string;
  content: string;
  author: string | User;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Task Interface (matches backend ITask / TaskResponse)
 */
export interface Task {
  _id: string;
  taskNumber: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string | User;
  reporter?: string | User;
  project: string | Project | { _id: string; name: string; color?: string };
  team: string | Team | { _id: string; name: string; avatar?: string };
  dueDate?: string;
  tags: string[];
  estimatedTime?: number;
  spentTime?: number;
  comments?: TaskComment[];
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Attachment Interface
 */
export interface Attachment {
  _id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedBy: string | User;
  uploadedAt: string;
}

/**
 * Comment Interface
 */
export interface Comment {
  _id: string;
  content: string;
  author: string | User;
  taskId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Chat Message
 */
export interface ChatMessage {
  _id: string;
  content: string;
  sender: string | User;
  teamId: string;
  timestamp: string;
  edited?: boolean;
  attachments?: Attachment[];
}

/**
 * Notification Type
 */
export type NotificationType = 
  | 'task-assigned'
  | 'task-updated'
  | 'mention'
  | 'comment'
  | 'team-invite'
  | 'system';

/**
 * Notification Interface
 */
export interface Notification {
  _id: string;
  user: string | User;
  type: NotificationType;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

/**
 * Time Off Request Status
 */
export type TimeOffStatus = 'pending' | 'approved' | 'rejected';

/**
 * Time Off Request Type
 */
export type TimeOffType = 'vacation' | 'sick' | 'personal' | 'remote';

/**
 * Time Off Request
 */
export interface TimeOffRequest {
  _id: string;
  user: string | User;
  team: string | Team;
  startDate: string;
  endDate: string;
  type: TimeOffType;
  status: TimeOffStatus;
  reason?: string;
  reviewedBy?: string | User;
  reviewedAt?: string;
  createdAt: string;
}

/**
 * Dashboard Stats
 */
export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  totalProjects: number;
  activeProjects: number;
  teamMembers: number;
}

/**
 * Pagination Params
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Project Document
 */
export interface ProjectDocument {
  _id: string;
  title: string;
  content: string;
  project: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDocumentDTO {
  title: string;
  content: string;
  project: string;
}

export interface UpdateProjectDocumentDTO {
  title?: string;
  content?: string;
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode?: number;
  details?: any;
}

/**
 * Team DTOs for API operations
 */
export interface AddMemberDTO {
  email: string;
  role: 'admin' | 'member' | 'guest';
}

/**
 * Epic Status
 */
export type EpicStatus = 'open' | 'in-progress' | 'completed' | 'cancelled';

/**
 * Epic Priority
 */
export type EpicPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Epic Interface
 */
export interface Epic {
  _id: string;
  epicNumber: string;
  name: string;
  description?: string;
  project: string | Project;
  status: EpicStatus;
  priority: EpicPriority;
  owner: string | User;
  createdAt: string;
  updatedAt: string;
}

/**
 * Story Status
 */
export type StoryStatus = 'planning' | 'backlog' | 'todo' | 'doing' | 'qa' | 'done';

/**
 * Story Priority
 */
export type StoryPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Story Sizing (T-shirt)
 */
export type StorySizing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Story Interface
 */
export interface Story {
  _id: string;
  storyNumber: string;
  title: string;
  description?: string;
  epic: string | Epic;
  project: string | Project;
  assignee?: string | User;
  status: StoryStatus;
  priority: StoryPriority;
  sizing: StorySizing;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Epic DTOs
 */
export interface CreateEpicDTO {
  name: string;
  description?: string;
  project: string;
  status?: EpicStatus;
  priority?: EpicPriority;
}

export interface UpdateEpicDTO {
  name?: string;
  description?: string;
  status?: EpicStatus;
  priority?: EpicPriority;
}

/**
 * Story DTOs
 */
export interface CreateStoryDTO {
  title: string;
  description?: string;
  epic: string;
  project: string;
  assignee?: string;
  status?: StoryStatus;
  priority?: StoryPriority;
  sizing?: StorySizing;
}

export interface UpdateStoryDTO {
  title?: string;
  description?: string;
  epic?: string;
  assignee?: string;
  status?: StoryStatus;
  priority?: StoryPriority;
  sizing?: StorySizing;
}
