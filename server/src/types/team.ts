/**
 * Team Member Role Type
 * Defines the possible roles a user can have within a team
 */
export type TeamMemberRole = "admin" | "member" | "guest";

/**
 * Team Member Interface
 * Represents a member embedded within a team document
 */
export interface TeamMember {
  userId: string;
  role: TeamMemberRole;
  joinedAt: Date;
}

/**
 * Create Team DTO
 * Data required to create a new team
 */
export interface CreateTeamDTO {
  /** Team name (required, 2-100 characters) */
  name: string;
  /** Optional team description (max 500 characters) */
  description?: string;
  /** Optional team avatar URL */
  avatar?: string;
  /** ID of the company this team belongs to */
  companyId: string;
  /** ID of the department this team belongs to */
  departmentId: string;
}

/**
 * Update Team DTO
 * Partial data for updating an existing team
 */
export interface UpdateTeamDTO {
  /** Team name (optional, 2-100 characters) */
  name?: string;
  /** Team description (optional, max 500 characters) */
  description?: string;
  /** Team avatar URL (optional) */
  avatar?: string;
}

/**
 * Add Member DTO
 * Data required to add a new member to a team
 */
export interface AddMemberDTO {
  /** Email address of the user to add */
  email: string;
  /** Role to assign to the new member */
  role: TeamMemberRole;
}

/**
 * Update Member Role DTO
 * Data required to update a member's role
 */
export interface UpdateMemberRoleDTO {
  /** New role to assign to the member */
  role: TeamMemberRole;
}

/**
 * Team Response Interface
 * Standardized team response format for API
 */
export interface TeamResponse {
  _id: string;
  name: string;
  description?: string;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  members: Array<{
    _id: string;
    name: string;
    email: string;
    role: TeamMemberRole;
    joinedAt: Date;
  }>;
  memberCount: number;
  projectCount: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Team Member Response Interface
 * Standardized member response format for API
 */
export interface TeamMemberResponse {
  _id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  joinedAt: Date;
  avatar?: string;
  isActive: boolean;
}

/**
 * Team List Response Interface
 * Response format for listing teams
 */
export interface TeamListResponse {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  memberCount: number;
  projectCount: number;
  avatar?: string;
  userRole: TeamMemberRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Team Service Result Interface
 * Generic result type for service operations
 */
export interface ServiceResult<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Team Query Parameters Interface
 * Query parameters for team list endpoint
 */
export interface TeamQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}
