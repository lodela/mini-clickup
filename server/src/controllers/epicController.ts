import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { AuthRequest } from '../middleware/auth.js';
import EpicService from '../services/epicService.js';

/**
 * Controller for Epic-related operations
 */
export class EpicController {
  static async createEpic(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const epicData = req.body;
      const epic = await EpicService.createEpic(epicData);
      res.status(201).json({ success: true, data: epic });
    } catch (error) {
      next(error);
    }
  }

  static async getEpics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.query;
      const epics = await EpicService.getEpics(projectId as string | undefined);
      res.json({ success: true, data: epics });
    } catch (error) {
      next(error);
    }
  }

  static async getEpicById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const epic = await EpicService.getEpicById(id as string);
      if (!epic) {
        res.status(404).json({ success: false, message: 'Epic not found' });
        return;
      }
      res.json({ success: true, data: epic });
    } catch (error) {
      next(error);
    }
  }

  static async updateEpic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const epic = await EpicService.updateEpic(id as string, updateData);
      if (!epic) {
        res.status(404).json({ success: false, message: 'Epic not found' });
        return;
      }
      res.json({ success: true, data: epic });
    } catch (error) {
      next(error);
    }
  }

  static async deleteEpic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await EpicService.deleteEpic(id as string);
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Epic not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default EpicController;
