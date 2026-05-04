import mongoose, { Document, Schema, Model, Types } from "mongoose";

/**
 * Story Status Enum
 */
export type StoryStatus = "backlog" | "todo" | "in-progress" | "review" | "done";

/**
 * Story Priority Enum
 */
export type StoryPriority = "low" | "medium" | "high" | "urgent";

/**
 * Story Document Interface
 */
export interface IStory extends Document {
  storyNumber: string;          // Formato: STY-0001
  title: string;
  description?: string;
  epic: Types.ObjectId;
  project: Types.ObjectId;
  assignee?: Types.ObjectId;
  status: StoryStatus;
  priority: StoryPriority;
  storyPoints?: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Story Schema Definition
 */
const storySchema = new Schema<IStory>(
  {
    storyNumber: {
      type: String,
      required: [true, "Story number is required"],
      unique: true,
      trim: true,
      maxlength: [20, "Story number cannot exceed 20 characters"],
    },
    title: {
      type: String,
      required: [true, "Story title is required"],
      trim: true,
      maxlength: [200, "Story title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
      default: null,
    },
    epic: {
      type: Schema.Types.ObjectId,
      ref: "Epic",
      required: [true, "Epic is required"],
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["backlog", "todo", "in-progress", "review", "done"],
      default: "backlog",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    storyPoints: {
      type: Number,
      min: [0, "Story points cannot be negative"],
      default: null,
    },
    order: {
      type: Number,
      default: 0,
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
storySchema.index({ epic: 1, order: 1 });
storySchema.index({ project: 1, status: 1 });
storySchema.index({ assignee: 1 });

/**
 * Static method: Generate story number
 * Formato: STY + consecutivo de 4 dígitos
 * Ejemplo: STY-0001
 */
storySchema.statics.generateStoryNumber = async function (): Promise<string> {
  const count = await this.countDocuments();
  const consecutive = String(count + 1).padStart(4, "0");
  return `STY-${consecutive}`;
};

/**
 * Story Model type with static methods
 */
export interface IStoryModel extends Model<IStory> {
  generateStoryNumber(): Promise<string>;
}

/**
 * Create and export Story model
 */
const Story: IStoryModel =
  (mongoose.models.Story as IStoryModel) || mongoose.model<IStory, IStoryModel>("Story", storySchema);

export default Story;
