import { Types } from "mongoose";
import Employee from "../models/Employee.js";
import { IEmployee, EmployeeLevel, EmployeeType, PerformanceScore } from "../models/Employee.js";
import { AppError } from "../utils/errors.js";
import type {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  UpdateTaskAssignmentsDTO,
  EmployeeQueryParams,
  EmployeeResponse,
  EmployeeListResponse,
  EmployeeStatistics,
  EmployeeActivitySummary,
  WorkloadDistribution,
} from "../types/employee.types.js";

/**
 * Employee Service
 * Business logic layer for employee operations
 */

/**
 * Calculate age from date of birth
 * @param dob - Date of birth
 * @returns Age in years
 */
function calculateAge(dob: Date): number {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Calculate workload percentage
 * @param taskAssignments - Task assignment data
 * @returns Workload percentage (0-100)
 */
function calculateWorkloadPercentage(taskAssignments?: {
  backlogTasks?: number;
  tasksInProgress?: number;
  tasksInReview?: number;
  completedTasks?: number;
  totalTasks?: number;
}): number {
  if (!taskAssignments || taskAssignments.totalTasks === 0) {
    return 0;
  }
  
  const activeTasks = 
    (taskAssignments.backlogTasks || 0) +
    (taskAssignments.tasksInProgress || 0) +
    (taskAssignments.tasksInReview || 0);
  
  // Consider tasks in progress and review as active workload
  const workload = (taskAssignments.tasksInProgress || 0) + (taskAssignments.tasksInReview || 0);
  
  return Math.min(100, Math.round((workload / Math.max(activeTasks, 1)) * 100));
}

/**
 * Determine workload level
 * @param totalTasks - Total number of tasks
 * @returns Workload level
 */
function getWorkloadLevel(totalTasks: number): "Low" | "Medium" | "High" | "Critical" {
  if (totalTasks <= 5) return "Low";
  if (totalTasks <= 15) return "Medium";
  if (totalTasks <= 25) return "High";
  return "Critical";
}

/**
 * Format employee document to response DTO
 * @param employee - Employee document
 * @returns Formatted employee response
 */
function formatEmployeeResponse(employee: IEmployee): EmployeeResponse {
  const json = employee.toJSON() as any;
  // Convert _id to string
  json._id = employee._id.toString();
  return json as EmployeeResponse;
}

/**
 * Create a new employee
 * @param employeeData - Employee creation data
 * @returns Created employee
 * @throws {AppError} If employee already exists
 */
export async function createEmployeeService(
  employeeData: CreateEmployeeDTO
): Promise<EmployeeResponse> {
  try {
    // Check if employee ID already exists
    const existingEmployee = await Employee.findOne({
      $or: [
        { employeeId: employeeData.employeeId },
        { email: employeeData.email.toLowerCase().trim() },
      ],
    });

    if (existingEmployee) {
      throw AppError.conflict(
        existingEmployee.employeeId === employeeData.employeeId
          ? "Employee ID already exists"
          : "Email already exists"
      );
    }

    // Create employee
    const employee = await Employee.create({
      ...employeeData,
      email: employeeData.email.toLowerCase().trim(),
      taskAssignments: employeeData.taskAssignments
        ? {
            backlogTasks: employeeData.taskAssignments.backlogTasks || 0,
            tasksInProgress: employeeData.taskAssignments.tasksInProgress || 0,
            tasksInReview: employeeData.taskAssignments.tasksInReview || 0,
            completedTasks: employeeData.taskAssignments.completedTasks || 0,
            totalTasks:
              (employeeData.taskAssignments.backlogTasks || 0) +
              (employeeData.taskAssignments.tasksInProgress || 0) +
              (employeeData.taskAssignments.tasksInReview || 0) +
              (employeeData.taskAssignments.completedTasks || 0),
            lastUpdated: new Date(),
          }
        : undefined,
    });

    return formatEmployeeResponse(employee);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        throw AppError.badRequest("Invalid employee data");
      }
      throw AppError.internal(`Failed to create employee: ${error.message}`);
    }

    throw AppError.internal("Failed to create employee");
  }
}

/**
 * Get all employees with pagination and filtering
 * @param queryParams - Query parameters
 * @returns Paginated list of employees
 */
export async function getEmployeesService(
  queryParams: EmployeeQueryParams
): Promise<EmployeeListResponse> {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      employeeType,
      department,
      division,
      level,
      performanceScore,
      minRating,
      search,
      sortBy = "lastName",
      sortOrder = "asc",
      isActive,
      hasHighWorkload,
      minTasks,
    } = queryParams;

    // Build query
    const query: Record<string, unknown> = {};

    if (status) query.status = status;
    if (employeeType) query.employeeType = employeeType;
    if (department) query.department = department;
    if (division) query.division = division;
    if (level) query.level = level;
    if (performanceScore) query.performanceScore = performanceScore;
    if (minRating) query.employeeRating = { $gte: minRating };

    // Filter by active status
    if (isActive !== undefined) {
      if (isActive) {
        query.status = { $in: ["Active", "Future Start"] };
      } else {
        query.status = { $nin: ["Active", "Future Start"] };
      }
    }

    // Filter by high workload
    if (hasHighWorkload) {
      query["taskAssignments.totalTasks"] = { $gte: minTasks || 10 };
    }

    // Search by name or email
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ];
    }

    // Get total count
    const total = await Employee.countDocuments(query);

    // Get employees with pagination
    const employees = await Employee.find(query)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Format response
    const formattedEmployees = employees.map(formatEmployeeResponse);

    return {
      employees: formattedEmployees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error) {
      throw AppError.internal(`Failed to fetch employees: ${error.message}`);
    }

    throw AppError.internal("Failed to fetch employees");
  }
}

/**
 * Get employee by ID
 * @param employeeId - Employee ID or MongoDB _id
 * @returns Employee details
 * @throws {AppError} If employee not found
 */
export async function getEmployeeByIdService(
  employeeId: string
): Promise<EmployeeResponse> {
  try {
    // Check if valid ObjectId
    const isObjectId = Types.ObjectId.isValid(employeeId);
    
    const query = isObjectId
      ? { $or: [{ _id: employeeId }, { employeeId }] }
      : { employeeId };

    const employee = await Employee.findOne(query);

    if (!employee) {
      throw AppError.notFound("Employee not found");
    }

    return formatEmployeeResponse(employee);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error && error.name === "CastError") {
      throw AppError.badRequest("Invalid employee ID format");
    }

    if (error instanceof Error) {
      throw AppError.internal(`Failed to fetch employee: ${error.message}`);
    }

    throw AppError.internal("Failed to fetch employee");
  }
}

/**
 * Get employee activity summary (for activity view)
 * @param employeeId - Employee ID or MongoDB _id
 * @returns Employee activity summary
 * @throws {AppError} If employee not found
 */
export async function getEmployeeActivityService(
  employeeId: string
): Promise<EmployeeActivitySummary> {
  try {
    const isObjectId = Types.ObjectId.isValid(employeeId);
    
    const query = isObjectId
      ? { $or: [{ _id: employeeId }, { employeeId }] }
      : { employeeId };

    const employee = await Employee.findOne(query);

    if (!employee) {
      throw AppError.notFound("Employee not found");
    }

    const taskAssignments = employee.taskAssignments || {
      backlogTasks: 0,
      tasksInProgress: 0,
      tasksInReview: 0,
      completedTasks: 0,
      totalTasks: 0,
      lastUpdated: new Date(),
    };

    return {
      _id: employee._id.toString(),
      employeeId: employee.employeeId,
      fullName: employee.getFullName(),
      avatar: employee.avatar || undefined,
      title: employee.title,
      level: employee.level || undefined,
      taskAssignments: {
        backlogTasks: taskAssignments.backlogTasks,
        tasksInProgress: taskAssignments.tasksInProgress,
        tasksInReview: taskAssignments.tasksInReview,
        completedTasks: taskAssignments.completedTasks,
        totalTasks: taskAssignments.totalTasks,
        lastUpdated: taskAssignments.lastUpdated.toISOString(),
      },
      workloadPercentage: calculateWorkloadPercentage(taskAssignments),
      status: employee.status,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error && error.name === "CastError") {
      throw AppError.badRequest("Invalid employee ID format");
    }

    if (error instanceof Error) {
      throw AppError.internal(`Failed to fetch employee activity: ${error.message}`);
    }

    throw AppError.internal("Failed to fetch employee activity");
  }
}

/**
 * Update employee details
 * @param employeeId - Employee ID or MongoDB _id
 * @param updateData - Update data
 * @returns Updated employee
 * @throws {AppError} If employee not found or email already exists
 */
export async function updateEmployeeService(
  employeeId: string,
  updateData: UpdateEmployeeDTO
): Promise<EmployeeResponse> {
  try {
    const isObjectId = Types.ObjectId.isValid(employeeId);
    
    const query = isObjectId
      ? { $or: [{ _id: employeeId }, { employeeId }] }
      : { employeeId };

    // Check if email is being updated and if it already exists
    if (updateData.email) {
      const existingEmployee = await Employee.findOne({
        email: updateData.email.toLowerCase().trim(),
        ...query,
      });

      if (existingEmployee && existingEmployee.employeeId !== employeeId) {
        throw AppError.conflict("Email already exists");
      }
    }

    const employee = await Employee.findOne(query);

    if (!employee) {
      throw AppError.notFound("Employee not found");
    }

    // Update allowed fields
    const updateFields: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (updateData.firstName !== undefined) updateFields.firstName = updateData.firstName;
    if (updateData.lastName !== undefined) updateFields.lastName = updateData.lastName;
    if (updateData.email !== undefined) updateFields.email = updateData.email.toLowerCase().trim();
    if (updateData.startDate !== undefined) updateFields.startDate = updateData.startDate;
    if (updateData.exitDate !== undefined) updateFields.exitDate = updateData.exitDate;
    if (updateData.title !== undefined) updateFields.title = updateData.title;
    if (updateData.supervisorId !== undefined) updateFields.supervisor = updateData.supervisorId;
    if (updateData.department !== undefined) updateFields.department = updateData.department;
    if (updateData.division !== undefined) updateFields.division = updateData.division;
    if (updateData.status !== undefined) updateFields.status = updateData.status;
    if (updateData.employeeType !== undefined) updateFields.employeeType = updateData.employeeType;
    if (updateData.dob !== undefined) updateFields.dob = updateData.dob;
    if (updateData.gender !== undefined) updateFields.gender = updateData.gender;
    if (updateData.performanceScore !== undefined) updateFields.performanceScore = updateData.performanceScore;
    if (updateData.employeeRating !== undefined) updateFields.employeeRating = updateData.employeeRating;
    if (updateData.avatar !== undefined) updateFields.avatar = updateData.avatar;
    if (updateData.level !== undefined) updateFields.level = updateData.level;

    // Update task assignments if provided
    if (updateData.taskAssignments) {
      const currentAssignments = employee.taskAssignments || {
        backlogTasks: 0,
        tasksInProgress: 0,
        tasksInReview: 0,
        completedTasks: 0,
        totalTasks: 0,
        lastUpdated: new Date(),
      };

      const newAssignments = {
        backlogTasks: updateData.taskAssignments.backlogTasks ?? currentAssignments.backlogTasks,
        tasksInProgress: updateData.taskAssignments.tasksInProgress ?? currentAssignments.tasksInProgress,
        tasksInReview: updateData.taskAssignments.tasksInReview ?? currentAssignments.tasksInReview,
        completedTasks: updateData.taskAssignments.completedTasks ?? currentAssignments.completedTasks,
        totalTasks: 0,
        lastUpdated: new Date(),
      };

      newAssignments.totalTasks =
        newAssignments.backlogTasks +
        newAssignments.tasksInProgress +
        newAssignments.tasksInReview +
        newAssignments.completedTasks;

      updateFields.taskAssignments = newAssignments;
    }

    // Find and update
    const updatedEmployee = await Employee.findOneAndUpdate(
      query,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      throw AppError.notFound("Employee not found");
    }

    return formatEmployeeResponse(updatedEmployee);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error && error.name === "CastError") {
      throw AppError.badRequest("Invalid employee ID format");
    }

    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        throw AppError.badRequest("Invalid employee data");
      }
      throw AppError.internal(`Failed to update employee: ${error.message}`);
    }

    throw AppError.internal("Failed to update employee");
  }
}

/**
 * Update employee task assignments
 * @param employeeId - Employee ID or MongoDB _id
 * @param assignments - Task assignment updates
 * @returns Updated employee
 * @throws {AppError} If employee not found
 */
export async function updateTaskAssignmentsService(
  employeeId: string,
  assignments: UpdateTaskAssignmentsDTO
): Promise<EmployeeResponse> {
  try {
    const isObjectId = Types.ObjectId.isValid(employeeId);
    
    const query = isObjectId
      ? { $or: [{ _id: employeeId }, { employeeId }] }
      : { employeeId };

    const employee = await Employee.findOne(query);

    if (!employee) {
      throw AppError.notFound("Employee not found");
    }

    // Update task assignments manually
    const currentAssignments = employee.taskAssignments || {
      backlogTasks: 0,
      tasksInProgress: 0,
      tasksInReview: 0,
      completedTasks: 0,
      totalTasks: 0,
      lastUpdated: new Date(),
    };

    const newAssignments = {
      backlogTasks: assignments.backlogTasks ?? currentAssignments.backlogTasks,
      tasksInProgress: assignments.tasksInProgress ?? currentAssignments.tasksInProgress,
      tasksInReview: assignments.tasksInReview ?? currentAssignments.tasksInReview,
      completedTasks: assignments.completedTasks ?? currentAssignments.completedTasks,
      totalTasks: 0,
      lastUpdated: new Date(),
    };

    newAssignments.totalTasks =
      newAssignments.backlogTasks +
      newAssignments.tasksInProgress +
      newAssignments.tasksInReview +
      newAssignments.completedTasks;

    employee.taskAssignments = newAssignments as any;
    await employee.save();

    return formatEmployeeResponse(employee);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error && error.name === "CastError") {
      throw AppError.badRequest("Invalid employee ID format");
    }

    if (error instanceof Error) {
      throw AppError.internal(`Failed to update task assignments: ${error.message}`);
    }

    throw AppError.internal("Failed to update task assignments");
  }
}

/**
 * Delete employee
 * @param employeeId - Employee ID or MongoDB _id
 * @throws {AppError} If employee not found
 */
export async function deleteEmployeeService(
  employeeId: string
): Promise<void> {
  try {
    const isObjectId = Types.ObjectId.isValid(employeeId);
    
    const query = isObjectId
      ? { $or: [{ _id: employeeId }, { employeeId }] }
      : { employeeId };

    const employee = await Employee.findOneAndDelete(query);

    if (!employee) {
      throw AppError.notFound("Employee not found");
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error && error.name === "CastError") {
      throw AppError.badRequest("Invalid employee ID format");
    }

    if (error instanceof Error) {
      throw AppError.internal(`Failed to delete employee: ${error.message}`);
    }

    throw AppError.internal("Failed to delete employee");
  }
}

/**
 * Get employee statistics
 * @returns Employee statistics
 */
export async function getEmployeeStatisticsService(): Promise<EmployeeStatistics> {
  try {
    // Get total counts
    const total = await Employee.countDocuments();
    const active = await Employee.countDocuments({ status: { $in: ["Active", "Future Start"] } });
    const inactive = total - active;

    // Get counts by department
    const byDepartmentAgg = await Employee.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);
    const byDepartment = byDepartmentAgg.reduce(
      (acc, curr) => ({ ...acc, [curr._id]: curr.count }),
      {} as Record<string, number>
    );

    // Get counts by level
    const byLevelAgg = await Employee.aggregate([
      { $group: { _id: "$level", count: { $sum: 1 } } },
    ]);
    const byLevel: Record<string, number> = {
      Junior: 0,
      Middle: 0,
      Senior: 0,
    };
    byLevelAgg.forEach((item) => {
      if (item._id) byLevel[item._id] = item.count;
    });

    // Get counts by type
    const byTypeAgg = await Employee.aggregate([
      { $group: { _id: "$employeeType", count: { $sum: 1 } } },
    ]);
    const byType: Record<string, number> = {
      "Full-Time": 0,
      "Part-Time": 0,
      Contract: 0,
      Temporary: 0,
    };
    byTypeAgg.forEach((item) => {
      if (item._id) byType[item._id] = item.count;
    });

    // Get counts by performance score
    const byPerformanceAgg = await Employee.aggregate([
      { $group: { _id: "$performanceScore", count: { $sum: 1 } } },
    ]);
    const byPerformanceScore: Record<string, number> = {
      "Needs Improvement": 0,
      "Fully Meets": 0,
      Exceeds: 0,
    };
    byPerformanceAgg.forEach((item) => {
      if (item._id) byPerformanceScore[item._id] = item.count;
    });

    // Get average rating
    const avgRatingAgg = await Employee.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$employeeRating" } } },
    ]);
    const averageRating = avgRatingAgg.length > 0 ? avgRatingAgg[0].avgRating : 0;

    // Get average age
    const employees = await Employee.find().select("dob");
    const ages = employees.map((e) => calculateAge(e.dob));
    const averageAge = ages.length > 0
      ? Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length)
      : 0;

    // Get employees with high workload
    const withHighWorkload = await Employee.countDocuments({
      "taskAssignments.totalTasks": { $gte: 10 },
      status: { $in: ["Active", "Future Start"] },
    });

    return {
      total,
      active,
      inactive,
      byDepartment,
      byLevel,
      byType,
      byPerformanceScore,
      averageRating: Math.round(averageRating * 10) / 10,
      averageAge,
      withHighWorkload,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error) {
      throw AppError.internal(`Failed to fetch statistics: ${error.message}`);
    }

    throw AppError.internal("Failed to fetch statistics");
  }
}

/**
 * Get workload distribution
 * @returns Workload distribution for all active employees
 */
export async function getWorkloadDistributionService(): Promise<WorkloadDistribution[]> {
  try {
    const employees = await Employee.find({
      status: { $in: ["Active", "Future Start"] },
    }).select("employeeId firstName lastName avatar taskAssignments");

    return employees.map((employee) => {
      const taskAssignments = employee.taskAssignments || {
        backlogTasks: 0,
        tasksInProgress: 0,
        tasksInReview: 0,
        completedTasks: 0,
        totalTasks: 0,
      };

      return {
        employeeId: employee.employeeId,
        fullName: employee.getFullName(),
        avatar: employee.avatar || undefined,
        backlogTasks: taskAssignments.backlogTasks,
        tasksInProgress: taskAssignments.tasksInProgress,
        tasksInReview: taskAssignments.tasksInReview,
        completedTasks: taskAssignments.completedTasks,
        totalTasks: taskAssignments.totalTasks,
        workloadLevel: getWorkloadLevel(taskAssignments.totalTasks),
      };
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error) {
      throw AppError.internal(`Failed to fetch workload distribution: ${error.message}`);
    }

    throw AppError.internal("Failed to fetch workload distribution");
  }
}
