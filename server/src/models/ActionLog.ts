import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IActionLog extends Document {
  userId: Types.ObjectId;
  companyId?: Types.ObjectId; // Optional for God Mode actions
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "UPLOAD";
  entity: string; // e.g., 'Company', 'User', 'Task'
  entityId: Types.ObjectId;
  details: string; // Human readable summary
  changes?: Record<string, any>; // { old: {}, new: {} }
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const actionLogSchema = new Schema<IActionLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", default: null },
    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "UPLOAD"],
      required: true,
    },
    entity: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    details: { type: String, required: true },
    changes: { type: Schema.Types.Mixed, default: null },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const ActionLog: Model<IActionLog> = mongoose.models.ActionLog || mongoose.model<IActionLog>("ActionLog", actionLogSchema);
export default ActionLog;
