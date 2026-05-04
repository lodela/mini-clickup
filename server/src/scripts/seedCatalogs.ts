/**
 * Seed Catalogs Script
 * Run: npx tsx src/scripts/seedCatalogs.ts
 *
 * Populates the Catalog collection with default reference data:
 * - project_status
 * - task_priority
 * - task_status
 * - task_type
 */
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mini-clickup";

const CATALOGS = [
  // ── Project Statuses ──────────────────────────────────────────
  { type: "project_status", key: "planning", value: "planning", label: "Planificación", labelEn: "Planning", order: 10 },
  { type: "project_status", key: "active", value: "active", label: "Activo", labelEn: "Active", order: 20 },
  { type: "project_status", key: "on-hold", value: "on-hold", label: "En Pausa", labelEn: "On Hold", order: 30 },
  { type: "project_status", key: "completed", value: "completed", label: "Completado", labelEn: "Completed", order: 40 },

  // ── Task Priorities ───────────────────────────────────────────
  { type: "task_priority", key: "low", value: "low", label: "Baja", labelEn: "Low", order: 10 },
  { type: "task_priority", key: "medium", value: "medium", label: "Media", labelEn: "Medium", order: 20 },
  { type: "task_priority", key: "high", value: "high", label: "Alta", labelEn: "High", order: 30 },
  { type: "task_priority", key: "urgent", value: "urgent", label: "Urgente", labelEn: "Urgent", order: 40 },

  // ── Task Statuses ─────────────────────────────────────────────
  { type: "task_status", key: "backlog", value: "backlog", label: "Backlog", labelEn: "Backlog", order: 10 },
  { type: "task_status", key: "todo", value: "todo", label: "Por Hacer", labelEn: "To Do", order: 20 },
  { type: "task_status", key: "in-progress", value: "in-progress", label: "En Progreso", labelEn: "In Progress", order: 30 },
  { type: "task_status", key: "review", value: "review", label: "Revisión", labelEn: "Review", order: 40 },
  { type: "task_status", key: "done", value: "done", label: "Terminado", labelEn: "Done", order: 50 },

  // ── Task Types ────────────────────────────────────────────────
  { type: "task_type", key: "task", value: "task", label: "Tarea", labelEn: "Task", order: 10 },
  { type: "task_type", key: "bug", value: "bug", label: "Bug", labelEn: "Bug", order: 20 },
  { type: "task_type", key: "improvement", value: "improvement", label: "Mejora", labelEn: "Improvement", order: 30 },
  { type: "task_type", key: "epic", value: "epic", label: "Épica", labelEn: "Epic", order: 40 },
];

async function seedCatalogs() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB:", MONGODB_URI);

  const { default: Catalog } = await import("../models/Catalog.js");

  // Clear existing catalogs
  await Catalog.deleteMany({});
  console.log("🗑️  Existing catalogs cleared");

  // Insert seed data
  await Catalog.insertMany(CATALOGS);
  console.log(`📦 ${CATALOGS.length} catalog entries created`);

  await mongoose.disconnect();
  console.log("🎉 Catalogs seeded successfully!");
}

seedCatalogs().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
