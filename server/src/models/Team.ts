import mongoose, { Document, Schema, Model, Types } from "mongoose";

/**
 * Team Member Role Enum
 */
export type TeamMemberRole = "admin" | "member" | "guest";

/**
 * Team Member Interface
 */
interface ITeamMember {
  user: Types.ObjectId;
  role: TeamMemberRole;
  joinedAt: Date;
}

/**
 * Team Document Interface
 */
export interface ITeam extends Document {
  name: string;
  description?: string;
  owner: Types.ObjectId;
  members: ITeamMember[];
  projects: Types.ObjectId[];
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  addMember(userId: Types.ObjectId, role?: TeamMemberRole): Promise<void>;
  removeMember(userId: Types.ObjectId): Promise<void>;
  isMember(userId: Types.ObjectId): boolean;
  getMemberRole(userId: Types.ObjectId): TeamMemberRole | null;
}

/**
 * Team Member Schema (embedded document)
 */
const teamMemberSchema = new Schema<ITeamMember>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "member", "guest"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

/**
 * Team Schema Definition
 */
const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      maxlength: [100, "Team name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: null,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Team owner is required"],
    },
    members: {
      type: [teamMemberSchema],
      default: [],
    },
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
        default: [],
      },
    ],
    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Indexes for performance optimization
 */
teamSchema.index({ owner: 1 });
teamSchema.index({ "members.user": 1 });
teamSchema.index({ name: "text" });

/**
 * Instance method: Add member to team
 * @param userId - User ID to add
 * @param role - Member role (default: "member")
 */
teamSchema.methods.addMember = async function (
  userId: Types.ObjectId,
  role: TeamMemberRole = "member",
): Promise<void> {
  // Check if user is already a member
  const existingMember = this.members.find(
    (member: ITeamMember) => member.user.toString() === userId.toString(),
  );

  if (existingMember) {
    throw new Error("User is already a member of this team");
  }

  this.members.push({
    user: userId,
    role,
    joinedAt: new Date(),
  });

  await this.save();
};

/**
 * Instance method: Remove member from team
 * @param userId - User ID to remove
 */
teamSchema.methods.removeMember = async function (
  userId: Types.ObjectId,
): Promise<void> {
  const memberIndex = this.members.findIndex(
    (member: ITeamMember) => member.user.toString() === userId.toString(),
  );

  if (memberIndex === -1) {
    throw new Error("User is not a member of this team");
  }

  // Prevent removing the owner
  if (this.owner.toString() === userId.toString()) {
    throw new Error("Cannot remove the team owner");
  }

  this.members.splice(memberIndex, 1);
  await this.save();
};

/**
 * Instance method: Check if user is a member
 * @param userId - User ID to check
 * @returns Boolean indicating membership status
 */
teamSchema.methods.isMember = function (userId: Types.ObjectId): boolean {
  // Owner is always considered a member
  if (this.owner.toString() === userId.toString()) {
    return true;
  }

  return this.members.some(
    (member: ITeamMember) => member.user.toString() === userId.toString(),
  );
};

/**
 * Instance method: Get member role
 * @param userId - User ID to check
 * @returns Role string or null if not a member
 */
teamSchema.methods.getMemberRole = function (
  userId: Types.ObjectId,
): TeamMemberRole | null {
  // Owner always has admin role
  if (this.owner.toString() === userId.toString()) {
    return "admin";
  }

  const member = this.members.find(
    (member: ITeamMember) => member.user.toString() === userId.toString(),
  );

  return member ? member.role : null;
};

/**
 * Create and export Team model
 */
const Team: Model<ITeam> =
  mongoose.models.Team || mongoose.model<ITeam>("Team", teamSchema);

export default Team;
