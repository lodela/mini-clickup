import { Types } from "mongoose";
import Task from "../models/Task.js";
import { ITask } from "../models/Task.js";

export class TaskService {
  static async createTask(taskData: Partial<ITask>): Promise<ITask> {
    const task = new Task(taskData);
    return await task.save();
  }

  static async getTasks(
    filters: Record<string, unknown> = {},
  ): Promise<ITask[]> {
    return await Task.find(filters)
      .populate("assignee", "name email avatar")
      .populate("reporter", "name email avatar")
      .populate("project", "name color")
      .populate("team", "name avatar");
  }

  static async getTaskById(id: string): Promise<ITask | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Task.findById(id)
      .populate("assignee", "name email avatar")
      .populate("reporter", "name email avatar")
      .populate("project", "name color")
      .populate("team", "name avatar");
  }

  static async updateTask(
    id: string,
    updateData: Partial<ITask>,
  ): Promise<ITask | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    )
      .populate("assignee", "name email avatar")
      .populate("reporter", "name email avatar")
      .populate("project", "name color")
      .populate("team", "name avatar");

    return task;
  }

  static async deleteTask(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await Task.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  /**
   * Convert a task to a bug (when QA rejects)
   * @param taskId - ID of the task to convert
   * @param reason - Reason for rejection
   * @returns The converted bug task
   */
  static async convertToBug(taskId: string, reason: string): Promise<ITask> {
    if (!Types.ObjectId.isValid(taskId)) {
      throw new Error("Invalid task ID");
    }
    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    // Use the instance method (cast to ITask to access instance methods)
    return await (task as ITask & { convertToBug: (reason: string) => Promise<ITask> }).convertToBug(reason);
  }

  /**
   * Approve a task for a sprint (when QA approves)
   * @param taskId - ID of the task to approve
   * @param sprintId - ID of the sprint to assign to
   * @returns The updated task
   */
  static async approveForSprint(
    taskId: string,
    sprintId: Types.ObjectId,
  ): Promise<ITask> {
    if (!Types.ObjectId.isValid(taskId)) {
      throw new Error("Invalid task ID");
    }
    if (!Types.ObjectId.isValid(sprintId)) {
      throw new Error("Invalid sprint ID");
    }
    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    // Use the instance method (cast to ITask to access instance methods)
    return await (task as ITask & { approveForSprint: (sprintId: Types.ObjectId) => Promise<ITask> }).approveForSprint(sprintId);
  }
}

export default TaskService;
