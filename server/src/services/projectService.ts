import { Types } from 'mongoose';
import Project from '../models/Project.js';
import { IProject } from '../models/Project.js';
import Team from '../models/Team.js';

/**
 * Service layer for Project business logic
 */
export class ProjectService {
  /**
   * Create a new project — validates team belongs to caller's company
   */
  static async createProject(
    projectData: Partial<IProject>,
    companyId?: string,
  ): Promise<IProject> {
    if (companyId && projectData.team) {
      const team = await Team.findOne({
        _id: projectData.team,
        companyId: new Types.ObjectId(companyId),
      }).lean();
      if (!team) {
        throw Object.assign(new Error('Team not found or not in your company'), { status: 403 });
      }
    }
    const project = new Project(projectData);
    return await project.save();
  }

  /**
   * Get projects scoped to the caller's company
   */
  static async getProjects(companyId?: string): Promise<IProject[]> {
    if (companyId) {
      const teams = await Team.find(
        { companyId: new Types.ObjectId(companyId) },
        { _id: 1 },
      ).lean();
      const teamIds = teams.map((t) => t._id);
      return await Project.find({ team: { $in: teamIds } }).populate(
        'owner members',
        'name email avatar',
      );
    }
    // GOD_MODE: no company filter
    return await Project.find().populate('owner members', 'name email avatar');
  }

  /**
   * Get project by ID
   */
  static async getProjectById(id: string): Promise<IProject | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Project.findById(id).populate('owner members', 'name email avatar');
  }

  /**
   * Update project by ID
   */
  static async updateProject(id: string, updateData: Partial<IProject>): Promise<IProject | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).populate('owner members', 'name email avatar');

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
