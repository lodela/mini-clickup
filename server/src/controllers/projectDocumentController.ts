import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import ProjectDocumentService from '../services/projectDocumentService.js';

/**
 * Controller for Project Document operations
 */
export class ProjectDocumentController {
  static async createDocument(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const docData = { ...req.body, author: req.user.userId };
      const doc = await ProjectDocumentService.createDocument(docData);
      res.status(201).json({ success: true, data: doc });
    } catch (error) {
      next(error);
    }
  }

  static async getDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.query;
      const docs = await ProjectDocumentService.getDocuments(projectId as string);
      res.json({ success: true, data: docs });
    } catch (error) {
      next(error);
    }
  }

  static async getDocumentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const doc = await ProjectDocumentService.getDocumentById(id);
      if (!doc) {
        res.status(404).json({ success: false, message: 'Document not found' });
        return;
      }
      res.json({ success: true, data: doc });
    } catch (error) {
      next(error);
    }
  }

  static async updateDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const doc = await ProjectDocumentService.updateDocument(id, req.body);
      if (!doc) {
        res.status(404).json({ success: false, message: 'Document not found' });
        return;
      }
      res.json({ success: true, data: doc });
    } catch (error) {
      next(error);
    }
  }

  static async deleteDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const deleted = await ProjectDocumentService.deleteDocument(id);
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Document not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default ProjectDocumentController;
