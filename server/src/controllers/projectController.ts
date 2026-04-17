import { Request, Response, NextFunction } from "express";
import ProjectService from "../services/projectService.js";

/**
 * Controller for Project-related operations
 */
export class ProjectController {
  static async createProject(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const projectData = req.body;
      const project = await ProjectService.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  }

  static async getProjects(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const filters = req.query;
      const projects = await ProjectService.getProjects(filters);
      res.json(projects);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const project = await ProjectService.getProjectById(id as string);
      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  static async updateProject(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const project = await ProjectService.updateProject(
        id as string,
        updateData,
      );
      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProject(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await ProjectService.deleteProject(id as string);
      if (!deleted) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default ProjectController;
