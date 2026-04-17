import mongoose, { Document, Schema, Model, Types } from "mongoose";

/**
 * Project Status Enum
 */
export type ProjectStatus = "planning" | "active" | "on-hold" | "completed" | "cancelled";

/**
 * Project Priority Enum
 */
export type ProjectPriority = "low" | "medium" | "high" | "urgent";

/**
 * Project Document Interface
 */
export interface IProject extends Document {
  projectNumber: string;        // Formato: 202603201350001 (15 dígitos)
  name: string;
  description?: string;
  team: Types.ObjectId;
  owner: Types.ObjectId;        // Reporter/Responsable
  members: Types.ObjectId[];
  status: ProjectStatus;
  priority: ProjectPriority;
  color?: string;
  startDate?: Date;
  endDate?: Date;               // Dead line
  createdAt: Date;
  updatedAt: Date;
  tags: string[];               // Tags hasheados para búsqueda
  attachments?: string[];       // URLs de archivos adjuntos
  links?: string[];             // Links relacionados
  updateStatus(newStatus: ProjectStatus): Promise<void>;
  addMember(userId: Types.ObjectId): Promise<void>;
  removeMember(userId: Types.ObjectId): Promise<void>;
  isMember(userId: Types.ObjectId): boolean;
  toJSON(): {
    _id: Types.ObjectId;
    projectNumber: string;
    name: string;
    description?: string;
    team: Types.ObjectId;
    owner: Types.ObjectId;
    members: Types.ObjectId[];
    status: ProjectStatus;
    priority: ProjectPriority;
    color?: string;
    startDate?: string;
    endDate?: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    attachments?: string[];
    links?: string[];
    __v?: number;
  };
}

/**
 * Project Schema Definition
 */
const projectSchema = new Schema<IProject>(
  {
    projectNumber: {
      type: String,
      required: [true, "Project number is required"],
      unique: true,
      trim: true,
      maxlength: [15, "Project number cannot exceed 15 digits"],
    },
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [150, "Project name cannot exceed 150 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
      default: null,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team is required"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Project owner (reporter) is required"],
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    status: {
      type: String,
      enum: ["planning", "active", "on-hold", "completed", "cancelled"],
      default: "planning",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    color: {
      type: String,
      default: "#3B82F6", // Default blue
      match: [/^#[0-9A-Fa-f]{6}$/, "Please provide a valid hex color"],
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
      index: true, // Índice para búsqueda rápida
    },
    attachments: {
      type: [String],
      default: [],
    },
    links: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: true },
    toObject: { virtuals: true, transform: true },
  },
);

/**
 * Indexes for performance optimization
 */
projectSchema.index({ projectNumber: 1 });
projectSchema.index({ team: 1, status: 1 });
projectSchema.index({ owner: 1 });
projectSchema.index({ members: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ priority: 1 });
projectSchema.index({ name: "text" });
projectSchema.index({ tags: 1 }); // Índice para búsqueda por tags

/**
 * Instance method: Update project status
 */
projectSchema.methods.updateStatus = async function (
  newStatus: ProjectStatus,
): Promise<void> {
  this.status = newStatus;

  // Auto-set dates based on status
  if (newStatus === "active" && !this.startDate) {
    this.startDate = new Date();
  } else if (newStatus === "completed" && !this.endDate) {
    this.endDate = new Date();
  }

  await this.save();
};

/**
 * Instance method: Add member to project
 */
projectSchema.methods.addMember = async function (
  userId: Types.ObjectId,
): Promise<void> {
  // Check if user is already a member
  const existingMember = this.members.find(
    (member: Types.ObjectId) => member.toString() === userId.toString(),
  );

  if (existingMember) {
    throw new Error("User is already a member of this project");
  }

  this.members.push(userId);
  await this.save();
};

/**
 * Instance method: Remove member from project
 */
projectSchema.methods.removeMember = async function (
  userId: Types.ObjectId,
): Promise<void> {
  const memberIndex = this.members.findIndex(
    (member: Types.ObjectId) => member.toString() === userId.toString(),
  );

  if (memberIndex === -1) {
    throw new Error("User is not a member of this project");
  }

  // Prevent removing the owner
  if (this.owner.toString() === userId.toString()) {
    throw new Error("Cannot remove the project owner");
  }

  this.members.splice(memberIndex, 1);
  await this.save();
};

/**
 * Instance method: Check if user is a member
 */
projectSchema.methods.isMember = function (userId: Types.ObjectId): boolean {
  // Owner is always considered a member
  if (this.owner.toString() === userId.toString()) {
    return true;
  }

  return this.members.some(
    (member: Types.ObjectId) => member.toString() === userId.toString(),
  );
};

/**
 * Static method: Generate project number
 * Formato: [YYYY][MM][DD][HH][mm][###]
 * Ejemplo: 202603201350001
 */
projectSchema.statics.generateProjectNumber = async function (): Promise<string> {
  const now = new Date();
  const year = now.getFullYear(); // 4 dígitos
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 2 dígitos
  const day = String(now.getDate()).padStart(2, "0"); // 2 dígitos
  const hours = String(now.getHours()).padStart(2, "0"); // 2 dígitos
  const minutes = String(now.getMinutes()).padStart(2, "0"); // 2 dígitos
  
  // Get consecutive for this minute (3 dígitos)
  const startOfMinute = new Date(now);
  startOfMinute.setSeconds(0, 0);
  
  const count = await this.countDocuments({
    projectNumber: {
      $regex: `^${year}${month}${day}${hours}${minutes}`,
    },
  });
  
  const consecutive = String(count + 1).padStart(3, "0"); // 3 dígitos (001-999)
  
  return `${year}${month}${day}${hours}${minutes}${consecutive}`;
};

/**
 * Static method: Find projects by team and status
 */
projectSchema.statics.findByTeamAndStatus = async function (
  teamId: Types.ObjectId,
  status?: ProjectStatus,
): Promise<IProject[]> {
  const query: Record<string, unknown> = { team: teamId };

  if (status) {
    query.status = status;
  }

  return this.find(query)
    .populate("owner", "name email avatar")
    .populate("members", "name email avatar");
};

/**
 * Static method: Find projects by tags
 */
projectSchema.statics.findByTags = async function (
  tags: string[],
): Promise<IProject[]> {
  return this.find({
    tags: { $in: tags },
  })
    .populate("owner", "name email avatar")
    .populate("members", "name email avatar");
};

/**
 * Create and export Project model
 */
const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);

export default Project;
