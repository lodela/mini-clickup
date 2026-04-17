import { Request, Response, NextFunction } from "express";
import * as employeeService from "../services/employeeService.js";
import { z } from "zod";
import type { EmployeeStatus, EmployeeType, PerformanceScore, EmployeeLevel } from "../types/employee.types.js";

/**
 * Zod validation schemas for employee operations
 */

/**
 * Schema for creating a new employee
 */
const createEmployeeSchema = z.object({
  employeeId: z
    .string()
    .min(1, "Employee ID is required")
    .max(20, "Employee ID cannot exceed 20 characters"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name cannot exceed 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email too long")
    .transform((val) => val.toLowerCase().trim()),
  startDate: z.string().or(z.date()),
  exitDate: z.string().or(z.date()).optional().nullable(),
  title: z
    .string()
    .min(1, "Job title is required")
    .max(100, "Job title cannot exceed 100 characters"),
  supervisorId: z.string().optional().nullable(),
  department: z
    .string()
    .min(1, "Department is required")
    .max(100, "Department cannot exceed 100 characters"),
  division: z.string().max(100, "Division cannot exceed 100 characters").optional().nullable(),
  status: z.enum(["Active", "Future Start", "Inactive", "Terminated"]).optional(),
  employeeType: z.enum(["Full-Time", "Part-Time", "Contract", "Temporary"]).optional(),
  dob: z.string().or(z.date()),
  gender: z.string().min(1, "Gender is required").max(20, "Gender cannot exceed 20 characters"),
  performanceScore: z.enum(["Needs Improvement", "Fully Meets", "Exceeds"]).optional(),
  employeeRating: z.number().min(1).max(5).optional(),
  avatar: z.string().url("Avatar must be a valid URL").optional().nullable(),
  level: z.enum(["Junior", "Middle", "Senior"]).optional(),
  taskAssignments: z.object({
    backlogTasks: z.number().min(0).optional(),
    tasksInProgress: z.number().min(0).optional(),
    tasksInReview: z.number().min(0).optional(),
    completedTasks: z.number().min(0).optional(),
  }).optional(),
});

/**
 * Schema for updating an employee
 */
const updateEmployeeSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  email: z.string().email().max(255).transform((val) => val.toLowerCase().trim()).optional(),
  startDate: z.string().or(z.date()).optional(),
  exitDate: z.string().or(z.date()).nullable().optional(),
  title: z.string().min(1).max(100).optional(),
  supervisorId: z.string().nullable().optional(),
  department: z.string().min(1).max(100).optional(),
  division: z.string().max(100).nullable().optional(),
  status: z.enum(["Active", "Future Start", "Inactive", "Terminated"]).optional(),
  employeeType: z.enum(["Full-Time", "Part-Time", "Contract", "Temporary"]).optional(),
  dob: z.string().or(z.date()).optional(),
  gender: z.string().min(1).max(20).optional(),
  performanceScore: z.enum(["Needs Improvement", "Fully Meets", "Exceeds"]).optional(),
  employeeRating: z.number().min(1).max(5).optional(),
  avatar: z.string().url().nullable().optional(),
  level: z.enum(["Junior", "Middle", "Senior"]).optional(),
  taskAssignments: z.object({
    backlogTasks: z.number().min(0).optional(),
    tasksInProgress: z.number().min(0).optional(),
    tasksInReview: z.number().min(0).optional(),
    completedTasks: z.number().min(0).optional(),
  }).optional(),
});

/**
 * Schema for updating task assignments
 */
const updateTaskAssignmentsSchema = z.object({
  backlogTasks: z.number().min(0).optional(),
  tasksInProgress: z.number().min(0).optional(),
  tasksInReview: z.number().min(0).optional(),
  completedTasks: z.number().min(0).optional(),
});

/**
 * Employee Controller
 * Handles HTTP requests and responses for employee operations
 */

/**
 * Create a new employee
 * POST /api/employees
 */
export async function createEmployee(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Validate request body
    const validatedData = createEmployeeSchema.parse(req.body);

    // Remove exitDate if null (not allowed in create)
    const createData = { ...validatedData };
    if (createData.exitDate === null) {
      delete createData.exitDate;
    }

    // Create employee
    const employee = await employeeService.createEmployeeService(createData as any);

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: "Validation error",
        message: "Invalid employee data",
        details: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }

    next(error);
  }
}

/**
 * Get all employees with pagination and filtering
 * GET /api/employees
 */
export async function getEmployees(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Parse query parameters
    const queryParams = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      status: req.query.status as EmployeeStatus | undefined,
      employeeType: req.query.employeeType as EmployeeType | undefined,
      department: req.query.department as string | undefined,
      division: req.query.division as string | undefined,
      level: req.query.level as EmployeeLevel | undefined,
      performanceScore: req.query.performanceScore as PerformanceScore | undefined,
      minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
      search: req.query.search as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
      isActive: req.query.isActive ? req.query.isActive === "true" : undefined,
      hasHighWorkload: req.query.hasHighWorkload ? req.query.hasHighWorkload === "true" : undefined,
      minTasks: req.query.minTasks ? parseInt(req.query.minTasks as string, 10) : undefined,
    };

    // Get employees
    const result = await employeeService.getEmployeesService(queryParams);

    res.status(200).json({
      success: true,
      message: "Employees retrieved successfully",
      data: result.employees,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get employee by ID
 * GET /api/employees/:id
 */
export async function getEmployeeById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;

    // Get employee
    const employee = await employeeService.getEmployeeByIdService(id as string);

    res.status(200).json({
      success: true,
      message: "Employee retrieved successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get employee activity summary
 * GET /api/employees/:id/activity
 */
export async function getEmployeeActivity(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;

    // Get employee activity
    const activity = await employeeService.getEmployeeActivityService(id as string);

    res.status(200).json({
      success: true,
      message: "Employee activity retrieved successfully",
      data: activity,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update employee details
 * PUT /api/employees/:id
 */
export async function updateEmployee(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;

    // Validate request body
    const validatedData = updateEmployeeSchema.parse(req.body);

    // Update employee
    const employee = await employeeService.updateEmployeeService(id as string, validatedData);

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: "Validation error",
        message: "Invalid employee data",
        details: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }

    next(error);
  }
}

/**
 * Update employee task assignments
 * PATCH /api/employees/:id/tasks
 */
export async function updateTaskAssignments(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;

    // Validate request body
    const validatedData = updateTaskAssignmentsSchema.parse(req.body);

    // Update task assignments
    const employee = await employeeService.updateTaskAssignmentsService(id as string, validatedData);

    res.status(200).json({
      success: true,
      message: "Task assignments updated successfully",
      data: employee,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: "Validation error",
        message: "Invalid task assignment data",
        details: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }

    next(error);
  }
}

/**
 * Delete employee
 * DELETE /api/employees/:id
 */
export async function deleteEmployee(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;

    // Delete employee
    await employeeService.deleteEmployeeService(id as string);

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get employee statistics
 * GET /api/employees/statistics
 */
export async function getEmployeeStatistics(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Get statistics
    const statistics = await employeeService.getEmployeeStatisticsService();

    res.status(200).json({
      success: true,
      message: "Employee statistics retrieved successfully",
      data: statistics,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get workload distribution
 * GET /api/employees/workload-distribution
 */
export async function getWorkloadDistribution(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Get workload distribution
    const distribution = await employeeService.getWorkloadDistributionService();

    res.status(200).json({
      success: true,
      message: "Workload distribution retrieved successfully",
      data: distribution,
    });
  } catch (error) {
    next(error);
  }
}
