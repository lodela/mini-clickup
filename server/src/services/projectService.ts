import { Types } from "mongoose";
import Project from "../models/Project.js";
import { IProject } from "../models/Project.js";

/**
 * Service layer for Project business logic
 */
export class ProjectService {
  /**
   * Create a new project
   */
  static async createProject(
    projectData: Partial<IProject>,
  ): Promise<IProject> {
    const project = new Project(projectData);
    return await project.save();
  }

  /**
   * Get projects with optional filtering
   */
  static async getProjects(
    filters: Record<string, unknown> = {},
  ): Promise<IProject[]> {
    return await Project.find(filters).populate(
      "owner members",
      "name email avatar",
    );
  }

  /**
   * Get project by ID
   */
  static async getProjectById(id: string): Promise<IProject | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Project.findById(id).populate(
      "owner members",
      "name email avatar",
    );
  }

  /**
   * Update project by ID
   */
  static async updateProject(
    id: string,
    updateData: Partial<IProject>,
  ): Promise<IProject | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).populate("owner members", "name email avatar");

    return project;
  }

  /**
   * Delete project by ID
   */
  static async deleteProject(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await Project.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}

export default ProjectService;
