import mongoose, { Document, Schema, Model, Types } from "mongoose";

/**
 * Epic Status Enum
 */
export type EpicStatus = "open" | "in-progress" | "completed" | "cancelled";

/**
 * Epic Priority Enum
 */
export type EpicPriority = "low" | "medium" | "high" | "urgent";

/**
 * Epic Document Interface
 */
export interface IEpic extends Document {
  epicNumber: string;          // Formato: EPIC-0001
  name: string;
  description?: string;
  project: Types.ObjectId;
  status: EpicStatus;
  priority: EpicPriority;
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Epic Schema Definition
 */
const epicSchema = new Schema<IEpic>(
  {
    epicNumber: {
      type: String,
      required: [true, "Epic number is required"],
      unique: true,
      trim: true,
      maxlength: [20, "Epic number cannot exceed 20 characters"],
    },
    name: {
      type: String,
      required: [true, "Epic name is required"],
      trim: true,
      maxlength: [200, "Epic name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
      default: null,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "cancelled"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Epic owner is required"],
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
epicSchema.index({ project: 1, status: 1 });
epicSchema.index({ project: 1, priority: -1 });
epicSchema.index({ owner: 1 });

/**
 * Static method: Generate epic number
 * Formato: EPIC + consecutivo de 4 dígitos
 * Ejemplo: EPIC-0001
 */
epicSchema.statics.generateEpicNumber = async function (): Promise<string> {
  const count = await this.countDocuments();
  const consecutive = String(count + 1).padStart(4, "0");
  return `EPIC-${consecutive}`;
};

/**
 * Epic Model type with static methods
 */
export interface IEpicModel extends Model<IEpic> {
  generateEpicNumber(): Promise<string>;
}

/**
 * Create and export Epic model
 */
const Epic: IEpicModel =
  (mongoose.models.Epic as IEpicModel) || mongoose.model<IEpic, IEpicModel>("Epic", epicSchema);

export default Epic;
