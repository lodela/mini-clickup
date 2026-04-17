import { Router } from "express";
import { z } from "zod";
import * as teamController from "../controllers/teamController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import {
  checkTeamMembership,
  checkTeamOwnership,
  checkTeamAdmin,
  validateTeamId,
  validateMemberId,
} from "../middleware/team.js";

/**
 * Create router
 */
const router = Router();

/**
 * Zod validation schemas for route parameters
 */

/**
 * Schema for validating team ID in route params
 */
const teamIdParamsSchema = z.object({
  id: z
    .string()
    .min(1, "Team ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid team ID format"),
});

/**
 * Schema for validating member user ID in route params
 */
const memberIdParamsSchema = z.object({
  userId: z
    .string()
    .min(1, "User ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
});

/**
 * Combined schema for member operations
 */
const memberOperationParamsSchema = teamIdParamsSchema.merge(memberIdParamsSchema);

/**
 * Routes
 */

/**
 * POST /api/teams
 * Create a new team
 * @access Private (authenticated users only)
 */
router.post(
  "/",
  authenticate(),
  teamController.createTeam
);

/**
 * GET /api/teams
 * Get all teams for current user
 * @access Private (authenticated users only)
 */
router.get(
  "/",
  authenticate(),
  teamController.getTeams
);

/**
 * GET /api/teams/:id
 * Get single team by ID (with membership check)
 * @access Private (team members only)
 */
router.get(
  "/:id",
  authenticate(),
  validate(teamIdParamsSchema, { location: "params" }),
  checkTeamMembership(),
  teamController.getTeamById
);

/**
 * PUT /api/teams/:id
 * Update team details (owner only)
 * @access Private (team owner only)
 */
router.put(
  "/:id",
  authenticate(),
  validate(teamIdParamsSchema, { location: "params" }),
  checkTeamOwnership(),
  teamController.updateTeam
);

/**
 * DELETE /api/teams/:id
 * Delete team (owner only)
 * @access Private (team owner only)
 */
router.delete(
  "/:id",
  authenticate(),
  validate(teamIdParamsSchema, { location: "params" }),
  checkTeamOwnership(),
  teamController.deleteTeam
);

/**
 * POST /api/teams/:id/members
 * Add member to team (admin only)
 * @access Private (team admins only)
 */
router.post(
  "/:id/members",
  authenticate(),
  validate(teamIdParamsSchema, { location: "params" }),
  checkTeamAdmin(),
  teamController.addMember
);

/**
 * DELETE /api/teams/:id/members/:userId
 * Remove member from team (admin only)
 * @access Private (team admins only)
 */
router.delete(
  "/:id/members/:userId",
  authenticate(),
  validate(memberOperationParamsSchema, { location: "params" }),
  checkTeamAdmin(),
  teamController.removeMember
);

/**
 * PUT /api/teams/:id/members/:userId/role
 * Update member role in team (admin only)
 * @access Private (team admins only)
 */
router.put(
  "/:id/members/:userId/role",
  authenticate(),
  validate(memberOperationParamsSchema, { location: "params" }),
  checkTeamAdmin(),
  teamController.updateMemberRole
);

/**
 * GET /api/teams/:id/members
 * Get team members list (members only)
 * @access Private (team members only)
 */
router.get(
  "/:id/members",
  authenticate(),
  validate(teamIdParamsSchema, { location: "params" }),
  checkTeamMembership(),
  teamController.getTeamMembers
);

export default router;
