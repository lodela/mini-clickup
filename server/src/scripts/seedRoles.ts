/**
 * Seed 10 roles with granular permissions.
 * Run: npm run seed:roles
 * Idempotent: uses upsert so safe to run multiple times.
 */
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Role, { IPermission } from "../models/Role.js";

const ALL_ACTIONS = ["create", "read", "update", "delete", "invite", "assign"] as const;
const READ_ONLY: IPermission["actions"] = ["read"];
const READ_UPDATE: IPermission["actions"] = ["read", "update"];
const FULL: IPermission["actions"] = [...ALL_ACTIONS];

const roles = [
  {
    name: "GOD_MODE",
    displayName: "God Mode",
    description: "Full system access — reserved for nlodela@miniclickup.com",
    permissions: [
      { module: "projects",  actions: FULL },
      { module: "tasks",     actions: FULL },
      { module: "teams",     actions: FULL },
      { module: "sprints",   actions: FULL },
      { module: "employees", actions: FULL },
      { module: "companies", actions: FULL },
      { module: "admin",     actions: FULL },
    ],
  },
  {
    name: "CLIENT_A",
    displayName: "Client — Level A",
    description: "Enterprise client with full company control",
    permissions: [
      { module: "projects",  actions: FULL },
      { module: "tasks",     actions: FULL },
      { module: "teams",     actions: FULL },
      { module: "sprints",   actions: FULL },
      { module: "employees", actions: ["create", "read", "update", "invite", "assign"] },
      { module: "companies", actions: ["read", "update"] },
      { module: "admin",     actions: ["read"] },
    ],
  },
  {
    name: "CLIENT_B",
    displayName: "Client — Level B",
    description: "Standard client with most permissions",
    permissions: [
      { module: "projects",  actions: ["create", "read", "update", "delete"] },
      { module: "tasks",     actions: FULL },
      { module: "teams",     actions: ["create", "read", "update", "assign"] },
      { module: "sprints",   actions: ["create", "read", "update"] },
      { module: "employees", actions: ["read", "invite", "assign"] },
      { module: "companies", actions: ["read"] },
      { module: "admin",     actions: [] },
    ],
  },
  {
    name: "CLIENT_C",
    displayName: "Client — Level C",
    description: "Basic client — read and limited writes",
    permissions: [
      { module: "projects",  actions: ["read", "create"] },
      { module: "tasks",     actions: ["read", "create", "update"] },
      { module: "teams",     actions: ["read"] },
      { module: "sprints",   actions: ["read"] },
      { module: "employees", actions: ["read"] },
      { module: "companies", actions: ["read"] },
      { module: "admin",     actions: [] },
    ],
  },
  {
    name: "DIRECTOR",
    displayName: "Director",
    description: "Company director — high-level management",
    permissions: [
      { module: "projects",  actions: FULL },
      { module: "tasks",     actions: FULL },
      { module: "teams",     actions: FULL },
      { module: "sprints",   actions: FULL },
      { module: "employees", actions: ["read", "invite", "assign"] },
      { module: "companies", actions: ["read"] },
      { module: "admin",     actions: [] },
    ],
  },
  {
    name: "EXECUTIVE",
    displayName: "Executive",
    description: "Company executive — operational control",
    permissions: [
      { module: "projects",  actions: ["create", "read", "update"] },
      { module: "tasks",     actions: FULL },
      { module: "teams",     actions: ["read", "assign"] },
      { module: "sprints",   actions: ["create", "read", "update"] },
      { module: "employees", actions: ["read"] },
      { module: "companies", actions: ["read"] },
      { module: "admin",     actions: [] },
    ],
  },
  {
    name: "MANAGER",
    displayName: "Manager",
    description: "Team / project manager",
    permissions: [
      { module: "projects",  actions: ["read", "update"] },
      { module: "tasks",     actions: ["create", "read", "update", "assign"] },
      { module: "teams",     actions: ["read", "assign"] },
      { module: "sprints",   actions: ["read", "update"] },
      { module: "employees", actions: ["read"] },
      { module: "companies", actions: ["read"] },
      { module: "admin",     actions: [] },
    ],
  },
  {
    name: "USER_A",
    displayName: "User — Level A",
    description: "Power user — can create and manage tasks",
    permissions: [
      { module: "projects",  actions: ["read"] },
      { module: "tasks",     actions: ["create", "read", "update"] },
      { module: "teams",     actions: ["read"] },
      { module: "sprints",   actions: ["read"] },
      { module: "employees", actions: ["read"] },
      { module: "companies", actions: [] },
      { module: "admin",     actions: [] },
    ],
  },
  {
    name: "USER_B",
    displayName: "User — Level B",
    description: "Standard user — can update assigned tasks",
    permissions: [
      { module: "projects",  actions: ["read"] },
      { module: "tasks",     actions: READ_UPDATE },
      { module: "teams",     actions: ["read"] },
      { module: "sprints",   actions: ["read"] },
      { module: "employees", actions: [] },
      { module: "companies", actions: [] },
      { module: "admin",     actions: [] },
    ],
  },
  {
    name: "USER_C",
    displayName: "User — Level C (Basic)",
    description: "Default role for self-registered users — read only until promoted",
    permissions: [
      { module: "projects",  actions: READ_ONLY },
      { module: "tasks",     actions: READ_ONLY },
      { module: "teams",     actions: READ_ONLY },
      { module: "sprints",   actions: READ_ONLY },
      { module: "employees", actions: [] },
      { module: "companies", actions: [] },
      { module: "admin",     actions: [] },
    ],
  },
];

async function seed(): Promise<void> {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("Connected to MongoDB");

  for (const role of roles) {
    await Role.findOneAndUpdate(
      { name: role.name },
      role,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✅  Role seeded: ${role.name}`);
  }

  await mongoose.disconnect();
  console.log("\nDone — 10 roles seeded.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
