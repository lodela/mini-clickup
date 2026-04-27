import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import Team from "../models/Team.js";
import { AppError } from "./errorHandler.js";
import { AuthRequest } from "./auth.js";

/**
 * Extended Auth Request interface for team operations
 */
export interface TeamAuthRequest extends AuthRequest {
  team?: {
    _id: string;
    name: string;
    owner: string;
    members: Array<{
      user: string;
      role: string;
    }>;
  };
}

/**
 * Check if user is a member of the team
 * Middleware to verify team membership before allowing access
 * 
 * @returns Express middleware function
 * 
 * @throws {AppError} 404 if team not found, 403 if not a member
 */
export function checkTeamMembership() {
  return async (
    req: TeamAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Ensure authentication middleware ran first
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
          message: "Please login to access this resource",
        });
        return;
      }

      const teamId = req.params.id as string;

      if (!teamId) {
        throw AppError.badRequest("Team ID is required");
      }

      // Validate team ID format
      if (!Types.ObjectId.isValid(teamId)) {
        throw AppError.badRequest("Invalid team ID format");
      }

      // Find team
      const team = await Team.findById(teamId);

      if (!team) {
        throw AppError.notFound("Team not found");
      }

      // Check if user is owner
      const isOwner = team.owner.toString() === req.user.userId;

      // Check if user is a member
      const isMember = team.members.some(
        (member) => member.user.toString() === req.user!.userId
      );

      if (!isOwner && !isMember) {
        throw AppError.forbidden("You are not a member of this team");
      }

      // Attach team to request for later use
      req.team = {
        _id: team._id.toString(),
        name: team.name,
        owner: team.owner.toString(),
        members: team.members.map((m) => ({
          user: m.user.toString(),
          role: m.role,
        })),
      };

      next();
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
  };
}

/**
 * Check if user is the owner of the team
 * Middleware to verify team ownership before allowing sensitive operations
 * 
 * @returns Express middleware function
 * 
 * @throws {AppError} 404 if team not found, 403 if not owner
 */
export function checkTeamOwnership() {
  return async (
    req: TeamAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Ensure authentication middleware ran first
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
          message: "Please login to access this resource",
        });
        return;
      }

      const teamId = req.params.id as string;

      if (!teamId) {
        throw AppError.badRequest("Team ID is required");
      }

      // Validate team ID format
      if (!Types.ObjectId.isValid(teamId)) {
        throw AppError.badRequest("Invalid team ID format");
      }

      // Find team
      const team = await Team.findById(teamId);

      if (!team) {
        throw AppError.notFound("Team not found");
      }

      // Check if user is the owner
      const isOwner = team.owner.toString() === req.user.userId;

      if (!isOwner) {
        throw AppError.forbidden("Only the team owner can perform this action");
      }

      // Attach team to request for later use
      req.team = {
        _id: team._id.toString(),
        name: team.name,
        owner: team.owner.toString(),
        members: team.members.map((m) => ({
          user: m.user.toString(),
          role: m.role,
        })),
      };

      next();
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
  };
}

/**
 * Check if user is an admin of the team (owner or admin role)
 * Middleware to verify admin privileges before allowing member management
 * 
 * @returns Express middleware function
 * 
 * @throws {AppError} 404 if team not found, 403 if not admin
 */
export function checkTeamAdmin() {
  return async (
    req: TeamAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Ensure authentication middleware ran first
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
          message: "Please login to access this resource",
        });
        return;
      }

      const teamId = req.params.id as string;

      if (!teamId) {
        throw AppError.badRequest("Team ID is required");
      }

      // Validate team ID format
      if (!Types.ObjectId.isValid(teamId)) {
        throw AppError.badRequest("Invalid team ID format");
      }

      // Find team
      const team = await Team.findById(teamId);

      if (!team) {
        throw AppError.notFound("Team not found");
      }

      // Check if user is owner (always has admin privileges)
      const isOwner = team.owner.toString() === req.user.userId;

      if (isOwner) {
        // Attach team to request
        req.team = {
          _id: team._id.toString(),
          name: team.name,
          owner: team.owner.toString(),
          members: team.members.map((m) => ({
            user: m.user.toString(),
            role: m.role,
          })),
        };
        next();
        return;
      }

      // Check if user is an admin member
      const member = team.members.find(
        (m) => m.user.toString() === req.user!.userId
      );

      if (!member || member.role !== "admin") {
        throw AppError.forbidden("Admin privileges required for this action");
      }

      // Attach team to request
      req.team = {
        _id: team._id.toString(),
        name: team.name,
        owner: team.owner.toString(),
        members: team.members.map((m) => ({
          user: m.user.toString(),
          role: m.role,
        })),
      };

      next();
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
  };
}

/**
 * Validate team ID parameter
 * Middleware to validate team ID format in request params
 * 
 * @returns Express middleware function
 * 
 * @throws {AppError} 400 if team ID is invalid
 */
export function validateTeamId() {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const teamId = req.params.id as string;

      if (!teamId) {
        throw AppError.badRequest("Team ID is required");
      }

      // Validate team ID format
      if (!Types.ObjectId.isValid(teamId)) {
        throw AppError.badRequest("Invalid team ID format");
      }

      next();
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
  };
}

/**
 * Validate member ID parameter
 * Middleware to validate member user ID format in request params
 * 
 * @returns Express middleware function
 * 
 * @throws {AppError} 400 if member ID is invalid
 */
export function validateMemberId() {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.params.userId as string;

      if (!userId) {
        throw AppError.badRequest("User ID is required");
      }

      // Validate user ID format
      if (!Types.ObjectId.isValid(userId)) {
        throw AppError.badRequest("Invalid user ID format");
      }

      next();
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
  };
}
