import mongoose, { Document, Schema, Model } from "mongoose";

export type RoleModule =
  | "projects"
  | "tasks"
  | "teams"
  | "sprints"
  | "employees"
  | "companies"
  | "admin";

export type RoleAction = "create" | "read" | "update" | "delete" | "invite" | "assign";

export interface IPermission {
  module: RoleModule;
  actions: RoleAction[];
}

export interface IRole extends Document {
  name: string;        // e.g. GOD_MODE, USER_C
  displayName: string; // e.g. "God Mode", "User (Basic)"
  description?: string;
  permissions: IPermission[];
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true, uppercase: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    permissions: [
      {
        module: {
          type: String,
          enum: ["projects", "tasks", "teams", "sprints", "employees", "companies", "admin"],
          required: true,
        },
        actions: [
          {
            type: String,
            enum: ["create", "read", "update", "delete", "invite", "assign"],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Role: Model<IRole> =
  mongoose.models.Role || mongoose.model<IRole>("Role", roleSchema);

export default Role;
