import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  description?: string;
  companyId: Types.ObjectId; // Aislamiento multi-tenant
  manager: Types.ObjectId; // Referencia a User (Director/Gerente)
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    manager: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const Department: Model<IDepartment> = mongoose.models.Department || mongoose.model<IDepartment>("Department", departmentSchema);
export default Department;
