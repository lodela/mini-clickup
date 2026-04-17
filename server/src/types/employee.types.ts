/**
 * Employee Domain Types
 * Type definitions for employee-related operations
 * 
 * @module types/employee.types
 */

import { EmployeeStatus, EmployeeType, PerformanceScore, EmployeeLevel } from "../models/Employee.js";

/**
 * Re-export enums from model
 */
export type { EmployeeStatus, EmployeeType, PerformanceScore, EmployeeLevel };

/**
 * Task Assignment Interface
 */
export interface TaskAssignment {
  backlogTasks: number;
  tasksInProgress: number;
  tasksInReview: number;
  completedTasks: number;
  totalTasks: number;
  lastUpdated: string; // ISO 8601
}

/**
 * Create Employee DTO
 * Data required to create a new employee
 */
export interface CreateEmployeeDTO {
  employeeId: string;           // required, unique
  firstName: string;            // required, 1-50 chars
  lastName: string;             // required, 1-50 chars
  email: string;                // required, valid email, unique
  startDate: string | Date;     // required, ISO 8601
  exitDate?: string | Date;     // optional, ISO 8601
  title: string;                // required, 1-100 chars
  supervisorId?: string;        // optional, ObjectId
  department: string;           // required, 1-100 chars
  division?: string;            // optional, 1-100 chars
  status?: EmployeeStatus;      // default: "Active"
  employeeType?: EmployeeType;  // default: "Full-Time"
  dob: string | Date;           // required, ISO 8601
  gender: string;               // required
  performanceScore?: PerformanceScore; // default: "Fully Meets"
  employeeRating?: number;      // 1-5, default: 3
  avatar?: string;              // optional, URL
  level?: EmployeeLevel;        // default: "Middle"
  taskAssignments?: {
    backlogTasks?: number;
    tasksInProgress?: number;
    tasksInReview?: number;
    completedTasks?: number;
  };
}

/**
 * Update Employee DTO
 * Partial data for updating an existing employee
 */
export interface UpdateEmployeeDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  startDate?: string | Date;
  exitDate?: string | Date | null;
  title?: string;
  supervisorId?: string | null;
  department?: string;
  division?: string | null;
  status?: EmployeeStatus;
  employeeType?: EmployeeType;
  dob?: string | Date;
  gender?: string;
  performanceScore?: PerformanceScore;
  employeeRating?: number;
  avatar?: string | null;
  level?: EmployeeLevel;
  taskAssignments?: {
    backlogTasks?: number;
    tasksInProgress?: number;
    tasksInReview?: number;
    completedTasks?: number;
  };
}

/**
 * Update Task Assignments DTO
 * Data for updating employee task assignments
 */
export interface UpdateTaskAssignmentsDTO {
  backlogTasks?: number;
  tasksInProgress?: number;
  tasksInReview?: number;
  completedTasks?: number;
}

/**
 * Employee Query Parameters
 * Query parameters for listing employees
 */
export interface EmployeeQueryParams {
  page?: number;                    // default: 1
  limit?: number;                   // default: 10, max: 100
  status?: EmployeeStatus;
  employeeType?: EmployeeType;
  department?: string;
  division?: string;
  level?: EmployeeLevel;
  performanceScore?: PerformanceScore;
  minRating?: number;               // minimum employee rating
  search?: string;                  // search by name or email
  sortBy?: string;                  // default: "lastName"
  sortOrder?: "asc" | "desc";       // default: "asc"
  isActive?: boolean;               // filter by active status
  hasHighWorkload?: boolean;        // filter employees with high workload
  minTasks?: number;                // minimum tasks for workload filter
}

/**
 * Employee Response DTO
 * Standardized employee response format
 */
export interface EmployeeResponse {
  _id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  startDate: string;                // ISO 8601
  exitDate?: string | null;         // ISO 8601
  title: string;
  supervisor?: string;              // ObjectId
  department: string;
  division?: string;
  status: EmployeeStatus;
  employeeType: EmployeeType;
  dob: string;                      // ISO 8601
  gender: string;
  performanceScore: PerformanceScore;
  employeeRating: number;           // 1-5
  avatar?: string;
  level?: EmployeeLevel;
  taskAssignments?: TaskAssignment;
  createdAt: string;                // ISO 8601
  updatedAt: string;                // ISO 8601
  fullName: string;                 // Virtual
  age: number;                      // Virtual
  isActive: boolean;                // Virtual
}

/**
 * Employee List Response
 * Paginated list of employees
 */
export interface EmployeeListResponse {
  employees: EmployeeResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Employee Statistics
 * Aggregated employee data for dashboards
 */
export interface EmployeeStatistics {
  total: number;
  active: number;
  inactive: number;
  byDepartment: Record<string, number>;
  byLevel: Record<EmployeeLevel, number>;
  byType: Record<EmployeeType, number>;
  byPerformanceScore: Record<PerformanceScore, number>;
  averageRating: number;
  averageAge: number;
  withHighWorkload: number;
}

/**
 * Employee Activity Summary
 * For activity view cards
 */
export interface EmployeeActivitySummary {
  _id: string;
  employeeId: string;
  fullName: string;
  avatar?: string;
  title: string;
  level?: EmployeeLevel;
  taskAssignments: TaskAssignment;
  workloadPercentage: number;       // Calculated from task assignments
  status: EmployeeStatus;
}

/**
 * Workload Distribution
 * For workload analysis
 */
export interface WorkloadDistribution {
  employeeId: string;
  fullName: string;
  avatar?: string;
  backlogTasks: number;
  tasksInProgress: number;
  tasksInReview: number;
  completedTasks: number;
  totalTasks: number;
  workloadLevel: "Low" | "Medium" | "High" | "Critical";
}
