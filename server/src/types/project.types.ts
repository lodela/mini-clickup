/**
 * Project Domain Types
 * Type definitions for project-related operations
 * 
 * @module types/project.types
 */

import { ProjectStatus } from "../models/Project.js";

/**
 * Project Status Type
 */
export type { ProjectStatus };

/**
 * Create Project DTO
 * Data required to create a new project
 */
export interface CreateProjectDTO {
  name: string;                     // required, 1-150 chars
  description?: string;             // optional, max 1000 chars
  teamId: string;                   // required, ObjectId
  ownerId: string;                  // required, ObjectId
  memberIds?: string[];             // optional, ObjectId[]
  status?: ProjectStatus;           // default: "planning"
  color?: string;                   // optional, hex color
  startDate?: string | Date;        // optional
  endDate?: string | Date;          // optional
}

/**
 * Update Project DTO
 * Partial data for updating an existing project
 */
export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  color?: string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
}

/**
 * Project Member DTO
 * Data for adding/removing project members
 */
export interface ProjectMemberDTO {
  userId: string;                   // required, ObjectId
}

/**
 * Project Query Parameters
 * Query parameters for listing projects
 */
export interface ProjectQueryParams {
  page?: number;                    // default: 1
  limit?: number;                   // default: 10, max: 100
  teamId?: string;
  ownerId?: string;
  memberId?: string;
  status?: ProjectStatus;
  search?: string;                  // search by name
  sortBy?: string;                  // default: "createdAt"
  sortOrder?: "asc" | "desc";       // default: "desc"
}

/**
 * Project Response DTO
 * Standardized project response format
 */
export interface ProjectResponse {
  _id: string;
  name: string;
  description?: string;
  team: {
    _id: string;
    name: string;
    avatar?: string;
  };
  owner: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  members: Array<{
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
  status: ProjectStatus;
  color?: string;
  startDate?: string;               // ISO 8601
  endDate?: string;                 // ISO 8601
  memberCount: number;
  taskCount?: number;               // optional, populated
  completedTaskCount?: number;      // optional, populated
  progress?: number;                // optional, percentage 0-100
  createdAt: string;                // ISO 8601
  updatedAt: string;                // ISO 8601
}

/**
 * Project List Response
 * Paginated list of projects
 */
export interface ProjectListResponse {
  projects: ProjectResponse[];
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
 * Project Statistics
 * Aggregated project data for dashboards
 */
export interface ProjectStatistics {
  total: number;
  byStatus: Record<ProjectStatus, number>;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
  averageDuration: number;          // days
  tasksCompleted: number;
  tasksPending: number;
}

/**
 * Project Timeline Item
 * Project with timeline information
 */
export interface ProjectTimelineItem {
  _id: string;
  name: string;
  status: ProjectStatus;
  startDate?: string;               // ISO 8601
  endDate?: string;                 // ISO 8601
  color?: string;
  progress: number;                 // 0-100
}

/**
 * Project Member Role
 * User's role within a project
 */
export type ProjectMemberRole = "owner" | "admin" | "member" | "viewer";

/**
 * Project Membership Response
 * User's membership information in a project
 */
export interface ProjectMembershipResponse {
  projectId: string;
  projectName: string;
  role: ProjectMemberRole;
  joinedAt: string;                 // ISO 8601
}
