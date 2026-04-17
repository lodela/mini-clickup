import { Request, Response, NextFunction } from "express";
import SprintService from "../services/sprintService.js";

export class SprintController {
  static async createSprint(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const sprintData = req.body;
      const sprint = await SprintService.createSprint(sprintData);
      res.status(201).json(sprint);
    } catch (error) {
      next(error);
    }
  }

  static async getSprints(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const filters = req.query;
      const sprints = await SprintService.getSprints(filters);
      res.json(sprints);
    } catch (error) {
      next(error);
    }
  }

  static async getSprintById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const sprint = await SprintService.getSprintById(id as string);
      if (!sprint) {
        res.status(404).json({ message: "Sprint not found" });
        return;
      }
      res.json(sprint);
    } catch (error) {
      next(error);
    }
  }

  static async updateSprint(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const sprint = await SprintService.updateSprint(id as string, updateData);
      if (!sprint) {
        res.status(404).json({ message: "Sprint not found" });
        return;
      }
      res.json(sprint);
    } catch (error) {
      next(error);
    }
  }

  static async deleteSprint(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await SprintService.deleteSprint(id as string);
      if (!deleted) {
        res.status(404).json({ message: "Sprint not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default SprintController;
