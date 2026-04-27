import { Response, NextFunction } from "express";
import { z } from "zod";
import * as teamService from "../services/teamService.js";
import { TeamAuthRequest } from "../middleware/team.js";
import { AppError } from "../middleware/errorHandler.js";
import { TeamMemberRole } from "../types/team.js";
import ActionLog from "../models/ActionLog.js";

/**
 * Zod validation schemas for team operations
 */

/**
 * Schema for creating a new team
 */
const createTeamSchema = z.object({
  name: z
    .string()
    .min(2, "Team name must be at least 2 characters")
    .max(100, "Team name cannot exceed 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .nullable(),
  avatar: z.string().max(255, "Avatar is too long").optional().nullable(),
  companyId: z.string().min(24, "Invalid Company ID"),
  departmentId: z.string().min(24, "Invalid Department ID"),
});

/**
 * Schema for updating a team
 */
const updateTeamSchema = z.object({
  name: z
    .string()
    .min(2, "Team name must be at least 2 characters")
    .max(100, "Team name cannot exceed 100 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .nullable(),
  avatar: z.string().url("Avatar must be a valid URL").optional().nullable(),
});

/**
 * Schema for adding a member to a team
 */
const addMemberSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email too long")
    .transform((val) => val.toLowerCase().trim()),
  role: z.enum(["admin", "member", "guest"], {
    errorMap: () => ({
      message: "Role must be one of: admin, member, or guest",
    }),
  }),
});

/**
 * Schema for updating a member's role
 */
const updateMemberRoleSchema = z.object({
  role: z.enum(["admin", "member", "guest"], {
    errorMap: () => ({
      message: "Role must be one of: admin, member, or guest",
    }),
  }),
});

/**
 * Team Controller
 * Handles HTTP requests and responses for team operations
 * Delegates business logic to teamService
 */

/**
 * Create a new team
 * POST /api/teams
 *
 * @param req - Express request with team data in body
 * @param res - Express response
 * @param next - Express next function
 *
 * @returns 201 with created team data
 */
export async function createTeam(
  req: TeamAuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
        message: "Please login to create a team",
      });
      return;
    }

    // Validate request body
    const validatedData = createTeamSchema.parse(req.body);

    // Create team using service
    const team = await teamService.createTeamService(req.user.userId, {
      name: validatedData.name,
      description: validatedData.description || undefined,
      avatar: validatedData.avatar || undefined,
      companyId: validatedData.companyId,
      departmentId: validatedData.departmentId,
    });

    // Log the action
    await ActionLog.create({
      userId: req.user.userId,
      action: "CREATE",
      entity: "Team",
      entityId: team._id,
      details: `Created team ${validatedData.name}`,
      companyId: validatedData.companyId
    });

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: team,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: "Validation error",
        message: "Invalid team data",
        details: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }

    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.code,
        message: error.message,
      });
      return;
    }

    next(error);
  }
}

/**
 * Get all teams for current user
 * GET /api/teams
 *
 * @param req - Express request with authenticated user
 * @param res - Express response
 * @param next - Express next function
 *
 * @returns 200 with array of teams
 */
export async function getTeams(
  req: TeamAuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
        message: "Please login to view teams",
      });
      return;
    }

    // Get user's teams
    const teams = await teamService.getUserTeamsService(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Teams retrieved successfully",
      data: teams,
      count: teams.length,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.code,
        message: error.message,
      });
      return;
    }

    next(error);
  }
}

/**
 * Get single team by ID
 * GET /api/teams/:id
 *
 * @param req - Express request with team ID in params
 * @param res - Express response
 * @param next - Express next function
 *
 * @returns 200 with team data
 */
export async function getTeamById(
  req: TeamAuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
        message: "Please login to view team details",
      });
      return;
    }

    const teamId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    // Get team by ID (service checks membership)
    const team = await teamService.getTeamByIdService(teamId, req.user.userId);

    res.status(200).json({
      success: true,
      message: "Team retrieved successfully",
      data: team,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.code,
        message: error.message,
      });
      return;
    }

    next(error);
  }
}

/**
 * Update team details
 * PUT /api/teams/:id
 *
 * @param req - Express request with team data in body
 * @param res - Express response
 * @param next - Express next function
 *
 * @returns 200 with updated team data
 */
export async function updateTeam(
  req: TeamAuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
        message: "Please login to update team",
      });
      return;
    }

    const teamId = req.params.id as string;

    // Validate request body (partial update)
    const validatedData = updateTeamSchema.parse(req.body);

    // Check if there's anything to update
    if (Object.keys(validatedData).length === 0) {
      res.status(400).json({
        success: false,
        error: "Validation error",
        message: "No valid fields provided for update",
      });
      return;
    }

    // Update team using service (ownership checked in middleware)
    const team = await teamService.updateTeamService(teamId, {
      name: validatedData.name,
      description: validatedData.description || undefined,
      avatar: validatedData.avatar || undefined,
    });

    res.status(200).json({
      success: true,
      message: "Team updated successfully",
      data: team,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: "Validation error",
        message: "Invalid team data",
        details: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }

    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.code,
        message: error.message,
      });
      return;
    }

    next(error);
  }
}

/**
 * Delete team
 * DELETE /api/teams/:id
 *
 * @param req - Express request with team ID in params
 * @param res - Express response
 * @param next - Express next function
 *
 * @returns 200 with success message
 */
export async function deleteTeam(
  req: TeamAuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
        message: "Please login to delete team",
      });
      return;
    }

    const teamId = req.params.id as string;

    // Delete team using service (ownership checked in middleware)
    await teamService.deleteTeamService(teamId);

    res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.code,
        message: error.message,
      });
      return;
    }

    next(error);
  }
}

/**
 * Add member to team
 * POST /api/teams/:id/members
 *
 * @param req - Express request with member data in body
 * @param res - Express response
 * @param next - Express next function
 *
 * @returns 201 with updated team data
 */
export async function addMember(
  req: TeamAuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
        message: "Please login to add members",
      });
      return;
    }

    const teamId = req.params.id as string;

    // Validate request body
    const validatedData = addMemberSchema.parse(req.body);

    // Add member using service (admin check done in service)
    const team = await teamService.addMemberService(
      teamId,
      {
        email: validatedData.email,
        role: validatedData.role,
      },
      req.user.userId,
    );

    res.status(201).json({
      success: true,
      message: "Member added successfully",
      data: team,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: "Validation error",
        message: "Invalid member data",
        details: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }

    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.code,
        message: error.message,
      });
      return;
    }

    next(error);
  }
}

/**
 * Remove member from team
 * DELETE /api/teams/:id/members/:userId
 *
 * @param req - Express request with team ID and user ID in params
 * @param res - Express response
 * @param next - Express next function
 *
 * @returns 200 with updated team data
 */
export async function removeMember(
  req: TeamAuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
        message: "Please login to remove members",
      });
      return;
    }

    const teamId = req.params.id as string;
    const userIdToRemove = req.params.userId as string;

    // Remove member using service (admin check done in service)
    const team = await teamService.removeMemberService(
      teamId,
      userIdToRemove,
      req.user.userId,
    );

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
      data: team,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.code,
        message: error.message,
      });
      return;
    }

    next(error);
  }
}

/**
 * Update member role in team
 * PUT /api/teams/:id/members/:userId/role
 *
 * @param req - Express request with role data in body
 * @param res - Express response
 * @param next - Express next function
 *
 * @returns 200 with updated team data
 */
export async function updateMemberRole(
  req: TeamAuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
        message: "Please login to update member roles",
      });
      return;
    }

    const teamId = req.params.id as string;
    const userId = req.params.userId as string;

    // Validate request body
    const validatedData = updateMemberRoleSchema.parse(req.body);

    // Update member role using service (admin check done in service)
    const team = await teamService.updateMemberRoleService(
      teamId,
      userId,
      validatedData.role as TeamMemberRole,
      req.user.userId,
    );

    res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      data: team,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: "Validation error",
        message: "Invalid role data",
        details: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }

    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.code,
        message: error.message,
      });
      return;
    }

    next(error);
  }
}

/**
 * Get team members
 * GET /api/teams/:id/members
 *
 * @param req - Express request with team ID in params
 * @param res - Express response
 * @param next - Express next function
 *
 * @returns 200 with array of team members
 */
export async function getTeamMembers(
  req: TeamAuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
        message: "Please login to view team members",
      });
      return;
    }

    const teamId = req.params.id as string;

    // Get team members (service checks membership)
    const members = await teamService.getTeamMembersService(
      teamId,
      req.user.userId,
    );

    res.status(200).json({
      success: true,
      message: "Team members retrieved successfully",
      data: members,
      count: members.length,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.code,
        message: error.message,
      });
      return;
    }

    next(error);
  }
}
