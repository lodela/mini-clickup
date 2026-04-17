import mongoose, { Document, Schema, Model, Types } from "mongoose";

/**
 * Task Status Enum
 */
export type TaskStatus = "backlog" | "todo" | "in-progress" | "review" | "done" | "qa" | "approved";

/**
 * Task Type Enum (Tarea/Bug)
 */
export type TaskType = "task" | "bug";

/**
 * Task Priority Enum
 */
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type WorkflowState = "pending-approval" | "approved";

/**
 * Task Document Interface
 */
export interface ITask extends Document {
  taskNumber: string;           // Consecutivo corto
  title: string;
  description?: string;
  type: TaskType;               // "task" | "bug" (switch visual)
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: Types.ObjectId;
  reporter: Types.ObjectId;
  project: Types.ObjectId;
  team: Types.ObjectId;
  dueDate?: Date;
  tags: string[];               // Tags hasheados
  estimatedTime?: number;       // En horas (ej: 2.5 = 2d 4h)
  spentTime?: number;           // Tiempo invertido en horas
  sprintId?: Types.ObjectId;
  attachments?: string[];
  comments?: ITaskComment[];
  createdAt: Date;
  updatedAt: Date;
  updateStatus(newStatus: TaskStatus): Promise<void>;
  addComment(content: string, author: Types.ObjectId): Promise<ITaskComment>;
  toJSON(): {
    _id: Types.ObjectId;
    taskNumber: string;
    title: string;
    description?: string;
    type: TaskType;
    status: TaskStatus;
    priority: TaskPriority;
    assignee?: Types.ObjectId;
    reporter: Types.ObjectId;
    project: Types.ObjectId;
    team: Types.ObjectId;
    dueDate?: string;
    tags: string[];
    estimatedTime?: number;
    spentTime?: number;
    attachments?: string[];
    comments?: ITaskComment[];
    createdAt: string;
    updatedAt: string;
    __v?: number;
  };
}

export interface ITaskComment {
  id: string;
  content: string;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Task Comment Schema (embedded document)
 */
const taskCommentSchema = new Schema<ITaskComment>(
  {
    id: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: [2000, "Comment cannot exceed 2000 characters"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    updatedAt: {
      type: Date,
    },
  },
  { _id: false },
);

/**
 * Task Schema Definition
 */
const taskSchema = new Schema<ITask>(
  {
    taskNumber: {
      type: String,
      required: [true, "Task number is required"],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
      default: null,
    },
    type: {
      type: String,
      enum: ["task", "bug"],
      default: "task",
    },
    status: {
      type: String,
      enum: ["backlog", "todo", "in-progress", "review", "done", "qa", "approved"],
      default: "backlog",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reporter is required"],
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team is required"],
    },
    dueDate: {
      type: Date,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    estimatedTime: {
      type: Number,
      min: [0, "Estimated time cannot be negative"],
      default: null,
    },
    spentTime: {
      type: Number,
      min: [0, "Spent time cannot be negative"],
      default: null,
    },
    attachments: {
      type: [String],
      default: [],
    },
    comments: {
      type: [taskCommentSchema],
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
taskSchema.index({ assignee: 1, status: 1 });
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ team: 1, status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ status: 1, dueDate: 1 });
taskSchema.index({ reporter: 1 });
taskSchema.index({ tags: 1 });
taskSchema.index({ type: 1 }); // Índice para filtrar por Tarea/Bug

/**
 * Instance method: Update task status
 */
taskSchema.methods.updateStatus = async function (
  newStatus: TaskStatus,
): Promise<void> {
  this.status = newStatus;

  // Auto-update spent time when moving to done
  if (newStatus === "done" && this.estimatedTime && !this.spentTime) {
    // Calculate actual time based on time spent (simplified)
    const createdDate = new Date(this.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
    this.spentTime = Math.min(hoursDiff, this.estimatedTime * 1.5);
  }

  await this.save();
};

/**
 * Instance method: Add comment to task
 */
taskSchema.methods.addComment = async function (
  content: string,
  author: Types.ObjectId,
): Promise<ITaskComment> {
  const comment: ITaskComment = {
    id: new Types.ObjectId().toString(),
    content,
    author,
    createdAt: new Date(),
  };

  this.comments.push(comment);
  await this.save();

  return comment;
};

/**
 * Static method: Generate task number
 * Formato: TSK + consecutivo de 6 dígitos
 * Ejemplo: TSK000001
 */
taskSchema.statics.generateTaskNumber = async function (): Promise<string> {
  const count = await this.countDocuments();
  const consecutive = String(count + 1).padStart(6, "0");
  return `TSK${consecutive}`;
};

/**
 * Static method: Find tasks by project and status
 */
taskSchema.statics.findByProjectAndStatus = async function (
  projectId: Types.ObjectId,
  status?: TaskStatus,
): Promise<ITask[]> {
  const query: Record<string, unknown> = { project: projectId };

  if (status) {
    query.status = status;
  }

  return this.find(query)
    .populate("assignee", "name email avatar")
    .populate("reporter", "name email avatar")
    .sort({ priority: -1, dueDate: 1 });
};

/**
 * Static method: Find tasks by type (task/bug)
 */
taskSchema.statics.findByType = async function (
  projectId: Types.ObjectId,
  type: TaskType,
): Promise<ITask[]> {
  return this.find({ project: projectId, type })
    .populate("assignee", "name email avatar")
    .populate("reporter", "name email avatar")
    .sort({ priority: -1, dueDate: 1 });
};

/**
 * Static method: Find tasks by tags
 */
taskSchema.statics.findByTags = async function (
  tags: string[],
): Promise<ITask[]> {
  return this.find({
    tags: { $in: tags },
  })
    .populate("assignee", "name email avatar")
    .populate("reporter", "name email avatar");
};

/**
 * Create and export Task model
 */
const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);

export default Task;
