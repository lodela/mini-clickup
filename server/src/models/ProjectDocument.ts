import mongoose, { Document, Schema, Model, Types } from "mongoose";

/**
 * Project Document Interface
 */
export interface IProjectDocument extends Document {
  title: string;
  content: string;
  project: Types.ObjectId;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project Document Schema Definition
 */
const projectDocumentSchema = new Schema<IProjectDocument>(
  {
    title: {
      type: String,
      required: [true, "Document title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Document content is required"],
      maxlength: [50000, "Content cannot exceed 50000 characters"],
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
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
projectDocumentSchema.index({ project: 1, createdAt: -1 });
projectDocumentSchema.index({ author: 1 });

/**
 * Create and export Project Document model
 */
const ProjectDocument: Model<IProjectDocument> =
  (mongoose.models.ProjectDocument as Model<IProjectDocument>) ||
  mongoose.model<IProjectDocument>("ProjectDocument", projectDocumentSchema);

export default ProjectDocument;
