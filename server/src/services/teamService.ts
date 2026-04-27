import { Types } from "mongoose";
import Team, { ITeam, ITeamMember } from "../models/Team.js";
import User, { IUser } from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";
import {
  CreateTeamDTO,
  UpdateTeamDTO,
  AddMemberDTO,
  TeamMemberRole,
  TeamResponse,
  TeamListResponse,
  TeamMemberResponse,
} from "../types/team.js";

/**
 * Team Service
 * Business logic layer for team operations
 * All methods are transactional and handle edge cases
 */

/**
 * Create a new team with the user as owner
 *
 * @param userId - ID of the user creating the team (becomes owner)
 * @param teamData - Team creation data
 * @returns Created team with populated owner and members
 *
 * @throws {AppError} If user not found or team creation fails
 */
export async function createTeamService(
  userId: string,
  teamData: CreateTeamDTO,
): Promise<TeamResponse> {
  // For standalone MongoDB instances, we cannot use transactions
  // Instead we'll handle potential inconsistencies with error checking

  try {
    // Verify user exists
    const user = await User.findById(userId);

    if (!user) {
      throw AppError.notFound("User not found");
    }

    // Create team with owner as first member
    const team = new Team({
      ...teamData,
      companyId: new Types.ObjectId(teamData.companyId),
      departmentId: new Types.ObjectId(teamData.departmentId),
      owner: new Types.ObjectId(userId),
      members: [
        {
          user: new Types.ObjectId(userId),
          role: "admin" as TeamMemberRole,
          joinedAt: new Date(),
        },
      ],
    });

    const createdTeam = await team.save();

    // Add team to user's teams array
    user.teams.push(createdTeam._id);
    await user.save();

    // Return the created team
    return {
      _id: createdTeam._id.toString(),
      name: createdTeam.name,
      description: createdTeam.description || undefined,
      owner: {
        _id: userId,
        name: user.name,
        email: user.email,
      },
      members: [
        {
          _id: userId,
          name: user.name,
          email: user.email,
          role: "admin" as TeamMemberRole,
          joinedAt: createdTeam.createdAt,
        },
      ],
      memberCount: 1,
      projectCount: 0,
      avatar: createdTeam.avatar || undefined,
      createdAt: createdTeam.createdAt,
      updatedAt: createdTeam.updatedAt,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error) {
      throw AppError.internal(`Failed to create team: ${error.message}`);
    }

    throw AppError.internal("Failed to create team");
  }
}

/**
 * Get all teams for a specific user
 *
 * @param userId - ID of the user
 * @returns Array of teams with basic info and user's role
 *
 * @throws {AppError} If database query fails
 */
export async function getUserTeamsService(
  userId: string,
): Promise<TeamListResponse[]> {
  try {
    const userObjectId = new Types.ObjectId(userId);

    // Find teams where user is owner or member
    const teams = await Team.find({
      $or: [{ owner: userObjectId }, { "members.user": userObjectId }],
    })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    // Transform teams to response format
    return teams.map((team) => {
      const isOwner =
        team.owner && (team.owner as any)._id
          ? (team.owner as any)._id.toString() === userId
          : team.owner.toString() === userId;
      const userRole: TeamMemberRole = isOwner
        ? "admin"
        : team.getMemberRole(userObjectId) || "member";

      // Count members: owner + all members in array (excluding owner if duplicated)
      const ownerObjectId =
        team.owner && (team.owner as any)._id
          ? (team.owner as any)._id
          : team.owner;

      const uniqueMembers = team.members.filter(
        (m) => m.user.toString() !== ownerObjectId.toString(),
      );
      const memberCount = 1 + uniqueMembers.length; // owner + other members

      return {
        _id: team._id.toString(),
        name: team.name,
        description: team.description || undefined,
        owner: (team.owner as any)?._id?.toString() || team.owner.toString(),
        memberCount,
        projectCount: team.projects.length,
        avatar: team.avatar || undefined,
        userRole,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
      };
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error) {
      throw AppError.internal(`Failed to fetch teams: ${error.message}`);
    }

    throw AppError.internal("Failed to fetch teams");
  }
}

/**
 * Get a single team by ID with members populated
 *
 * @param teamId - ID of the team
 * @param userId - ID of the requesting user (for membership check)
 * @returns Team with full member details
 *
 * @throws {AppError} If team not found or user is not a member
 */
export async function getTeamByIdService(
  teamId: string,
  userId: string,
): Promise<TeamResponse> {
  try {
    const teamObjectId = new Types.ObjectId(teamId);

    // Find team and populate owner and members
    const team = await Team.findById(teamObjectId)
      .populate("owner", "name email")
      .populate("members.user", "name email avatar isActive");

    if (!team) {
      throw AppError.notFound("Team not found");
    }

    // Check if user is a member or owner
    const isMember = team.isMember(teamObjectId);
    const isOwner =
      team.owner && (team.owner as any)._id
        ? (team.owner as any)._id.toString() === userId
        : team.owner.toString() === userId;

    if (!isMember && !isOwner) {
      throw AppError.forbidden("You are not a member of this team");
    }

    // Build members array with owner included
    const membersWithDetails = team.members
      .filter(
        (member): member is ITeamMember & { user: IUser } =>
          member.user && typeof member.user === "object",
      )
      .map((member) => ({
        _id: (member.user as IUser)._id.toString(),
        name: (member.user as IUser).name,
        email: (member.user as IUser).email,
        role: member.role,
        joinedAt: member.joinedAt,
      }));

    // Add owner to members if not already included
    const ownerData = team.owner as unknown as IUser;
    if (ownerData && ownerData._id) {
      const ownerAlreadyInMembers = team.members.some(
        (m) => m.user != null && m.user.toString() === ownerData._id.toString(),
      );

      if (!ownerAlreadyInMembers) {
        membersWithDetails.unshift({
          _id: ownerData._id.toString(),
          name: ownerData.name,
          email: ownerData.email,
          role: "admin" as TeamMemberRole,
          joinedAt: team.createdAt,
        });
      }
    }

    return {
      _id: team._id.toString(),
      name: team.name,
      description: team.description || undefined,
      owner: ownerData
        ? {
            _id: ownerData._id.toString(),
            name: ownerData.name,
            email: ownerData.email,
          }
        : { _id: team.owner.toString(), name: "Unknown", email: "unknown" },
      members: membersWithDetails,
      memberCount: membersWithDetails.length,
      projectCount: team.projects.length,
      avatar: team.avatar || undefined,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error && error.name === "CastError") {
      throw AppError.badRequest("Invalid team ID format");
    }

    if (error instanceof Error) {
      throw AppError.internal(`Failed to fetch team: ${error.message}`);
    }

    throw AppError.internal("Failed to fetch team");
  }
}

/**
 * Update team details (owner only)
 *
 * @param teamId - ID of the team to update
 * @param updateData - Fields to update
 * @returns Updated team
 *
 * @throws {AppError} If team not found, user not owner, or update fails
 */
export async function updateTeamService(
  teamId: string,
  updateData: UpdateTeamDTO,
): Promise<TeamResponse> {
  // For standalone MongoDB instances, we cannot use transactions
  // Instead we'll handle potential inconsistencies with error checking

  try {
    const teamObjectId = new Types.ObjectId(teamId);

    const team = await Team.findById(teamObjectId)
      .populate("owner", "name email")
      .populate("members.user", "name email");

    if (!team) {
      throw AppError.notFound("Team not found");
    }

    // Update allowed fields
    if (updateData.name !== undefined) {
      team.name = updateData.name;
    }

    if (updateData.description !== undefined) {
      team.description = updateData.description;
    }

    if (updateData.avatar !== undefined) {
      team.avatar = updateData.avatar;
    }

    await team.save();

    // Build response directly
    const ownerData = team.owner as any;
    const membersWithDetails = team.members
      .filter((member: any) => member.user && typeof member.user === "object")
      .map((member: any) => ({
        _id: member.user._id.toString(),
        name: member.user.name,
        email: member.user.email,
        role: member.role,
        joinedAt: member.joinedAt,
      }));

    // Add owner if not already in members
    const ownerInMembers = team.members.some(
      (m: any) => m.user && m.user._id && m.user._id.toString() === ownerData._id.toString(),
    );

    if (!ownerInMembers && ownerData) {
      membersWithDetails.unshift({
        _id: ownerData._id.toString(),
        name: ownerData.name,
        email: ownerData.email,
        role: "admin" as TeamMemberRole,
        joinedAt: team.createdAt,
      });
    }

    return {
      _id: team._id.toString(),
      name: team.name,
      description: team.description || undefined,
      owner: ownerData
        ? {
            _id: ownerData._id.toString(),
            name: ownerData.name,
            email: ownerData.email,
          }
        : { _id: team.owner.toString(), name: "Unknown", email: "unknown" },
      members: membersWithDetails,
      memberCount: membersWithDetails.length,
      projectCount: team.projects.length,
      avatar: team.avatar || undefined,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error && error.name === "CastError") {
      throw AppError.badRequest("Invalid team ID format");
    }

    if (error instanceof Error) {
      throw AppError.internal(`Failed to update team: ${error.message}`);
    }

    throw AppError.internal("Failed to update team");
  }
}

/**
 * Delete a team and clean up references (owner only)
 *
 * @param teamId - ID of the team to delete
 *
 * @throws {AppError} If team not found, user not owner, or deletion fails
 */
export async function deleteTeamService(teamId: string): Promise<void> {
  // For standalone MongoDB instances, we cannot use transactions
  // Instead we'll handle potential inconsistencies with error checking

  try {
    const teamObjectId = new Types.ObjectId(teamId);

    const team = await Team.findById(teamObjectId);

    if (!team) {
      throw AppError.notFound("Team not found");
    }

    // Remove team from all members' teams array
    const memberIds = team.members.map((m) => m.user);

    await User.updateMany(
      { _id: { $in: memberIds } },
      { $pull: { teams: teamObjectId } },
    );

    // Also remove from owner's teams array
    await User.findByIdAndUpdate(team.owner, {
      $pull: { teams: teamObjectId },
    });

    // Delete the team
    await Team.findByIdAndDelete(teamObjectId);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error && error.name === "CastError") {
      throw AppError.badRequest("Invalid team ID format");
    }

    if (error instanceof Error) {
      throw AppError.internal(`Failed to delete team: ${error.message}`);
    }

    throw AppError.internal("Failed to delete team");
  }
}

/**
 * Add a member to a team (admin only)
 *
 * @param teamId - ID of the team
 * @param memberData - Member data (email and role)
 * @param actorUserId - ID of the user performing the action
 * @returns Updated team with new member
 *
 * @throws {AppError} If team not found, user not found, already member, or insufficient permissions
 */
export async function addMemberService(
  teamId: string,
  memberData: AddMemberDTO,
  actorUserId: string,
): Promise<TeamResponse> {
  // For standalone MongoDB instances, we cannot use transactions
  // Instead we'll handle potential inconsistencies with error checking

  try {
    const teamObjectId = new Types.ObjectId(teamId);

    const team = await Team.findById(teamObjectId);

    if (!team) {
      throw AppError.notFound("Team not found");
    }

    // Find user by email
    const userToAdd = await User.findOne({
      email: memberData.email.toLowerCase().trim(),
    });

    if (!userToAdd) {
      throw AppError.notFound(
        `User with email '${memberData.email}' not found`,
      );
    }

    // Check if user is already a member
    const isAlreadyMember = team.members.some(
      (m) => m.user.toString() === userToAdd._id.toString(),
    );

    if (isAlreadyMember) {
      throw AppError.conflict("User is already a member of this team");
    }

    // Add member to team
    team.members.push({
      user: userToAdd._id,
      role: memberData.role,
      joinedAt: new Date(),
    });

    await team.save();

    // Add team to user's teams array
    if (!userToAdd.teams.includes(teamObjectId)) {
      userToAdd.teams.push(teamObjectId);
      await userToAdd.save();
    }

    // Fetch updated team
    return await getTeamByIdService(teamId, actorUserId);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error && error.name === "CastError") {
      throw AppError.badRequest("Invalid team ID format");
    }

    if (error instanceof Error) {
      throw AppError.internal(`Failed to add member: ${error.message}`);
    }

    throw AppError.internal("Failed to add member");
  }
}

/**
 * Remove a member from a team (admin only)
 *
 * @param teamId - ID of the team
 * @param userIdToRemove - ID of the user to remove
 * @param actorUserId - ID of the user performing the action
 * @returns Updated team
 *
 * @throws {AppError} If team not found, user not member, or trying to remove owner
 */
export async function removeMemberService(
  teamId: string,
  userIdToRemove: string,
  actorUserId: string,
): Promise<TeamResponse> {
  // For standalone MongoDB instances, we cannot use transactions
  // Instead we'll handle potential inconsistencies with error checking

  try {
    const teamObjectId = new Types.ObjectId(teamId);
    const userToRemoveObjectId = new Types.ObjectId(userIdToRemove);

    const team = await Team.findById(teamObjectId);

    if (!team) {
      throw AppError.notFound("Team not found");
    }

    // Prevent removing the owner
    const isOwner =
      team.owner && (team.owner as any)._id
        ? (team.owner as any)._id.toString() === userIdToRemove
        : team.owner.toString() === userIdToRemove;

    if (isOwner) {
      throw AppError.forbidden(
        "Cannot remove the team owner. Transfer ownership first or delete the team.",
      );
    }

    // Check if user is a member
    const isMember = team.members.some(
      (m) => m.user.toString() === userIdToRemove,
    );

    if (!isMember) {
      throw AppError.notFound("User is not a member of this team");
    }

    // Remove member from team
    team.members = team.members.filter(
      (m) => m.user.toString() !== userIdToRemove,
    );

    await team.save();

    // Remove team from user's teams array
    await User.findByIdAndUpdate(
      userToRemoveObjectId,
      { $pull: { teams: teamObjectId } },
    );

    // Fetch updated team
    return await getTeamByIdService(teamId, actorUserId);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error && error.name === "CastError") {
      throw AppError.badRequest("Invalid user or team ID format");
    }

    if (error instanceof Error) {
      throw AppError.internal(`Failed to remove member: ${error.message}`);
    }

    throw AppError.internal("Failed to remove member");
  }
}

/**
 * Update a member's role in a team (admin only)
 *
 * @param teamId - ID of the team
 * @param userId - ID of the user whose role to update
 * @param newRole - New role to assign
 * @param actorUserId - ID of the user performing the action
 * @returns Updated team
 *
 * @throws {AppError} If team not found, user not member, or insufficient permissions
 */
export async function updateMemberRoleService(
  teamId: string,
  userId: string,
  newRole: TeamMemberRole,
  actorUserId: string,
): Promise<TeamResponse> {
  // For standalone MongoDB instances, we cannot use transactions
  // Instead we'll handle potential inconsistencies with error checking

  try {
    const teamObjectId = new Types.ObjectId(teamId);
    const userObjectId = new Types.ObjectId(userId);

    const team = await Team.findById(teamObjectId);

    if (!team) {
      throw AppError.notFound("Team not found");
    }

    // Prevent changing owner's role
    const isOwner =
      team.owner && (team.owner as any)._id
        ? (team.owner as any)._id.toString() === userId
        : team.owner.toString() === userId;

    if (isOwner) {
      throw AppError.forbidden("Cannot change the team owner's role");
    }

    // Find member in team
    const memberIndex = team.members.findIndex(
      (m) => m.user.toString() === userId,
    );

    if (memberIndex === -1) {
      throw AppError.notFound("User is not a member of this team");
    }

    // Update member role
    team.members[memberIndex].role = newRole;

    await team.save();

    // Fetch updated team
    return await getTeamByIdService(teamId, actorUserId);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error && error.name === "CastError") {
      throw AppError.badRequest("Invalid user or team ID format");
    }

    if (error instanceof Error) {
      throw AppError.internal(`Failed to update member role: ${error.message}`);
    }

    throw AppError.internal("Failed to update member role");
  }
}

/**
 * Get team members list
 *
 * @param teamId - ID of the team
 * @param userId - ID of the requesting user
 * @returns Array of team members with details
 *
 * @throws {AppError} If team not found or user is not a member
 */
export async function getTeamMembersService(
  teamId: string,
  userId: string,
): Promise<TeamMemberResponse[]> {
  try {
    const teamObjectId = new Types.ObjectId(teamId);

    const team = await Team.findById(teamObjectId)
      .populate("owner", "name email avatar isActive")
      .populate("members.user", "name email avatar isActive");

    if (!team) {
      throw AppError.notFound("Team not found");
    }

    // Check if user is a member or owner
    const isMember = team.isMember(teamObjectId);
    const isOwner =
      team.owner && (team.owner as any)._id
        ? (team.owner as any)._id.toString() === userId
        : team.owner.toString() === userId;

    if (!isMember && !isOwner) {
      throw AppError.forbidden("You are not a member of this team");
    }

    // Build members array
    const members: TeamMemberResponse[] = [];

    // Add owner first
    const ownerData = team.owner as unknown as IUser;
    const ownerObjectId =
      team.owner && (team.owner as any)._id
        ? (team.owner as any)._id
        : team.owner;

    if (ownerData && ownerData._id) {
      members.push({
        _id: ownerData._id.toString(),
        name: ownerData.name,
        email: ownerData.email,
        role: "admin" as TeamMemberRole,
        joinedAt: team.createdAt,
        avatar: ownerData.avatar || undefined,
        isActive: ownerData.isActive,
      });
    }

    // Add other members (excluding owner if they're in the members array)
    team.members
      .filter(
        (member): member is ITeamMember & { user: IUser } =>
          member.user && typeof member.user === "object",
      )
      .filter((member) => {
        // Exclude owner from members array to avoid duplicates
        const isOwner =
          (member.user as IUser)._id.toString() === ownerObjectId.toString();
        return !isOwner;
      })
      .forEach((member) => {
        const userData = member.user as IUser;
        members.push({
          _id: userData._id.toString(),
          name: userData.name,
          email: userData.email,
          role: member.role,
          joinedAt: member.joinedAt,
          avatar: userData.avatar || undefined,
          isActive: userData.isActive,
        });
      });

    return members;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error && error.name === "CastError") {
      throw AppError.badRequest("Invalid team ID format");
    }

    if (error instanceof Error) {
      throw AppError.internal(`Failed to fetch team members: ${error.message}`);
    }

    throw AppError.internal("Failed to fetch team members");
  }
}
