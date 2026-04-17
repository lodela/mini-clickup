import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as employeeController from "../controllers/employeeController.js";

/**
 * Create router
 */
const router = Router();

/**
 * All routes require authentication
 */
router.use(authenticate());

/**
 * POST /api/employees
 * Create a new employee
 * @access Private (authenticated users only)
 */
router.post("/", employeeController.createEmployee);

/**
 * GET /api/employees/statistics
 * Get employee statistics
 * @access Private (authenticated users only)
 */
router.get("/statistics", employeeController.getEmployeeStatistics);

/**
 * GET /api/employees/workload-distribution
 * Get workload distribution for all active employees
 * @access Private (authenticated users only)
 */
router.get("/workload-distribution", employeeController.getWorkloadDistribution);

/**
 * GET /api/employees
 * Get all employees with pagination and filtering
 * @access Private (authenticated users only)
 */
router.get("/", employeeController.getEmployees);

/**
 * GET /api/employees/:id/activity
 * Get employee activity summary (for activity view)
 * @access Private (authenticated users only)
 */
router.get("/:id/activity", employeeController.getEmployeeActivity);

/**
 * GET /api/employees/:id
 * Get single employee by ID
 * @access Private (authenticated users only)
 */
router.get("/:id", employeeController.getEmployeeById);

/**
 * PUT /api/employees/:id
 * Update employee details
 * @access Private (authenticated users only)
 */
router.put("/:id", employeeController.updateEmployee);

/**
 * PATCH /api/employees/:id/tasks
 * Update employee task assignments
 * @access Private (authenticated users only)
 */
router.patch("/:id/tasks", employeeController.updateTaskAssignments);

/**
 * DELETE /api/employees/:id
 * Delete employee
 * @access Private (authenticated users only)
 */
router.delete("/:id", employeeController.deleteEmployee);

export default router;
