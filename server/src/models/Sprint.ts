import mongoose, { Document, Schema, Model } from "mongoose";

/**
 * Sprint Status Enum
 */
export type SprintStatus = "planning" | "active" | "completed";

/**
 * Sprint Document Interface
 */
export interface ISprint extends Document {
  name: string;
  goal?: string;
  startDate: Date;
  endDate: Date;
  status: SprintStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Sprint Schema Definition
 */
const sprintSchema = new Schema<ISprint>(
  {
    name: {
      type: String,
      required: [true, "Sprint name is required"],
      trim: true,
      maxlength: [100, "Sprint name cannot exceed 100 characters"],
    },
    goal: {
      type: String,
      trim: true,
      maxlength: [500, "Sprint goal cannot exceed 500 characters"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    status: {
      type: String,
      enum: ["planning", "active", "completed"],
      default: "planning",
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for performance optimization
sprintSchema.index({ status: 1 });
sprintSchema.index({ startDate: 1 });
sprintSchema.index({ endDate: 1 });

// Static method: Find active sprint
sprintSchema.statics.findActive = function () {
  return this.findOne({ status: "active" });
};

// Static method: Find sprints by status
sprintSchema.statics.findByStatus = function (status: SprintStatus) {
  return this.find({ status });
};

/**
 * Create and export Sprint model
 */
const Sprint: Model<ISprint> =
  mongoose.models.Sprint || mongoose.model<ISprint>("Sprint", sprintSchema);

export default Sprint;
