/**
 * Seed Script for Employee Data
 * Loads 24 Latino employees from mock JSON file into MongoDB
 * 
 * Usage: 
 *   npm run seed:employees
 *   or
 *   tsx src/scripts/seedEmployees.ts
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Employee from "../models/Employee.js";

// Load environment variables
dotenv.config();

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mini-clickup";

/**
 * Load employee data from JSON file
 */
function loadEmployeeData(): any[] {
  const filePath = join(__dirname, "../../MOCKs/employees_latino_sample.json");
  const fileContent = readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}

/**
 * Transform mock data to Employee format
 */
function transformEmployeeData(mockData: any[]): any[] {
  return mockData.map((employee, index) => ({
    employeeId: employee.employeeId || `EMP${String(index + 1).padStart(3, "0")}`,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email.toLowerCase().trim(),
    startDate: new Date(employee.startDate),
    exitDate: employee.exitDate ? new Date(employee.exitDate) : null,
    title: employee.title,
    department: employee.department,
    division: employee.division || null,
    status: employee.status || "Active",
    employeeType: employee.employeeType || "Full-Time",
    dob: new Date(employee.dob),
    gender: employee.gender,
    performanceScore: mapPerformanceScore(employee.performanceScore),
    employeeRating: employee.employeeRating || 3,
    avatar: employee.avatar || generateAvatarUrl(employee.firstName, employee.lastName),
    level: mapEmployeeLevel(employee.employeeRating),
    taskAssignments: generateRandomTaskAssignments(),
  }));
}

/**
 * Map performance score from mock data to enum
 */
function mapPerformanceScore(score: string): "Needs Improvement" | "Fully Meets" | "Exceeds" {
  if (!score) return "Fully Meets";
  
  const normalized = score.toLowerCase();
  if (normalized.includes("needs improvement")) return "Needs Improvement";
  if (normalized.includes("exceeds")) return "Exceeds";
  return "Fully Meets";
}

/**
 * Map employee level based on rating
 */
function mapEmployeeLevel(rating?: number): "Junior" | "Middle" | "Senior" {
  if (!rating) return "Middle";
  if (rating <= 2) return "Junior";
  if (rating >= 4) return "Senior";
  return "Middle";
}

/**
 * Generate avatar URL using pravatar.cc
 */
function generateAvatarUrl(firstName: string, lastName: string): string {
  // Use consistent seed based on name
  const seed = `${firstName}-${lastName}`.toLowerCase().replace(/\s/g, "");
  const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imgNum = (hash % 70) + 1; // pravatar.cc has images 1-70
  return `https://i.pravatar.cc/150?img=${imgNum}`;
}

/**
 * Generate random task assignments for demo purposes
 */
function generateRandomTaskAssignments(): {
  backlogTasks: number;
  tasksInProgress: number;
  tasksInReview: number;
  completedTasks: number;
  totalTasks: number;
  lastUpdated: Date;
} {
  const backlogTasks = Math.floor(Math.random() * 10);
  const tasksInProgress = Math.floor(Math.random() * 15);
  const tasksInReview = Math.floor(Math.random() * 8);
  const completedTasks = Math.floor(Math.random() * 30);
  const totalTasks = backlogTasks + tasksInProgress + tasksInReview + completedTasks;

  return {
    backlogTasks,
    tasksInProgress,
    tasksInReview,
    completedTasks,
    totalTasks,
    lastUpdated: new Date(),
  };
}

/**
 * Main seed function
 */
async function seedEmployees(): Promise<void> {
  try {
    console.log("🌱 Starting employee seed...");

    // Connect to MongoDB
    console.log("📦 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected successfully");

    // Load mock data
    console.log("📄 Loading employee data...");
    const mockData = loadEmployeeData();
    console.log(`📊 Loaded ${mockData.length} employees from mock data`);

    // Transform data
    console.log("🔄 Transforming data...");
    const employees = transformEmployeeData(mockData);

    // Clear existing employees (optional - comment out to keep existing data)
    console.log("🗑️  Clearing existing employees...");
    await Employee.deleteMany({});
    console.log("✅ Existing employees cleared");

    // Insert employees
    console.log("💾 Inserting employees...");
    const inserted = await Employee.insertMany(employees, { ordered: false });
    console.log(`✅ Successfully inserted ${inserted.length} employees`);

    // Display summary
    console.log("\n📊 Seed Summary:");
    console.log("─────────────────────────────────────");
    console.log(`Total Employees: ${inserted.length}`);
    
    const byDepartment = inserted.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log("\nBy Department:");
    Object.entries(byDepartment).forEach(([dept, count]) => {
      console.log(`  ${dept}: ${count}`);
    });

    const byLevel = inserted.reduce((acc, emp) => {
      acc[emp.level || "Unknown"] = (acc[emp.level || "Unknown"] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log("\nBy Level:");
    Object.entries(byLevel).forEach(([level, count]) => {
      console.log(`  ${level}: ${count}`);
    });

    const byStatus = inserted.reduce((acc, emp) => {
      acc[emp.status] = (acc[emp.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log("\nBy Status:");
    Object.entries(byStatus).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });

    const avgTasks = Math.round(
      inserted.reduce((sum, emp) => sum + (emp.taskAssignments?.totalTasks || 0), 0) / inserted.length
    );
    console.log(`\nAverage Tasks per Employee: ${avgTasks}`);

    const highWorkload = inserted.filter(emp => (emp.taskAssignments?.totalTasks || 0) >= 15).length;
    console.log(`Employees with High Workload (15+ tasks): ${highWorkload}`);

    console.log("\n✅ Seed completed successfully!");
    console.log("─────────────────────────────────────\n");

    // Close connection
    await mongoose.connection.close();
    console.log("👋 MongoDB connection closed");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    
    if (error instanceof Error) {
      console.error("\nError details:");
      console.error(`  Name: ${error.name}`);
      console.error(`  Message: ${error.message}`);
      console.error(`  Stack: ${error.stack}`);
    }

    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run seed
seedEmployees();
