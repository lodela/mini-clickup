/**
 * Application-wide TypeScript types and interfaces
 */

/**
 * User Interface
 */
export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
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
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

/**
 * Task Priority
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Task Interface
 */
export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string | User;
  reporter?: string | User;
  project: string | Project;
  team: string | Team;
  dueDate?: string;
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
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
export interface CreateTeamDTO {
  name: string;
  description?: string;
  avatar?: string;
}

export interface UpdateTeamDTO {
  name?: string;
  description?: string;
  avatar?: string;
}

export interface AddMemberDTO {
  email: string;
  role: 'admin' | 'member' | 'guest';
}
