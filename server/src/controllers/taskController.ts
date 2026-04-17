import { Request, Response, NextFunction } from "express";
import TaskService from "../services/taskService.js";
import { AuthRequest } from "../middleware/auth.js";
import { Types } from "mongoose";

/**
 * Controller for Task-related operations
 */
export class TaskController {
  /**
   * Create a new task
   */
  static async createTask(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const taskData = req.body;
      const task = await TaskService.createTask(taskData);
      // Emit Socket.IO event for task creation
      const io = req.app.get("io");
      if (io) {
        io.emit("task-created", {
          taskId: task._id,
          task: {
            _id: task._id,
            title: task.title,
            status: task.status,
            assignee: task.assignee,
            project: task.project,
            team: task.team,
          },
          userId: (req as AuthRequest).user?.userId,
        });
      }
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all tasks (with optional filtering)
   */
  static async getTasks(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const filters = req.query;
      const tasks = await TaskService.getTasks(filters);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get task by ID
   */
  static async getTaskById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const task = await TaskService.getTaskById(id as string);
      if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update task by ID
   */
  static async updateTask(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      // Fetch current task to compare changes
      const currentTask = await TaskService.getTaskById(id as string);
      const task = await TaskService.updateTask(id as string, updateData);
      if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      const io = req.app.get("io");
      if (io) {
        // Emit task:status-changed if status changed
        if (currentTask?.status !== task.status) {
          io.emit("task:status-changed", {
            taskId: task._id,
            oldStatus: currentTask?.status,
            newStatus: task.status,
            userId: (req as AuthRequest).user?.userId,
          });
        }
        // Emit task:assigned if assignee changed
        if (currentTask?.assignee?.toString() !== task.assignee?.toString()) {
          io.emit("task:assigned", {
            taskId: task._id,
            assigneeId: task.assignee?.toString() || null,
            assignerId: (req as AuthRequest).user?.userId,
          });
        }
        // Emit task:qa-ready if status became qa
        if (task.status === "qa" && currentTask?.status !== "qa") {
          io.emit("task:qa-ready", {
            taskId: task._id,
            completedById: (req as AuthRequest).user?.userId,
          });
        }
      }
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete task by ID
   */
  static async deleteTask(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await TaskService.deleteTask(id as string);
      if (!deleted) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      // Emit Socket.IO event for task deletion
      const io = req.app.get("io");
      if (io) {
        io.emit("task-deleted", {
          taskId: id,
          userId: (req as AuthRequest).user?.userId,
        });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Convert a task to a bug (when QA rejects)
   */
  static async convertToBug(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const bug = await TaskService.convertToBug(
        id as string,
        reason as string,
      );
      // Emit Socket.IO event for bug creation
      const io = req.app.get("io");
      if (io) {
        io.emit("bug:created", {
          bugId: bug._id,
          rejectedTaskId: bug._id,
          reason,
          userId: (req as AuthRequest).user?.userId,
        });
      }
      res.json(bug);
    } catch (error: any) {
      if (error.message?.includes("Only tasks can be converted to bugs")) {
        res.status(400).json({ message: error.message });
        return;
      }
      next(error);
    }
  }

  /**
   * Approve a task for a sprint (when QA approves)
   */
  static async approveForSprint(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { sprintId } = req.body;
      const task = await TaskService.approveForSprint(
        id as string,
        new Types.ObjectId(sprintId as string),
      );
      // Emit Socket.IO event for task approval
      const io = req.app.get("io");
      if (io) {
        io.emit("task:approved", {
          taskId: task._id,
          sprintId: task.sprintId?.toString() || null,
          userId: (req as AuthRequest).user?.userId,
        });
      }
      res.json(task);
    } catch (error: any) {
      if (
        error.message?.includes(
          "Only tasks in QA with pending-approval can be approved for sprint",
        )
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      next(error);
    }
  }
}

export default TaskController;
