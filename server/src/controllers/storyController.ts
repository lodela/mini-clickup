import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import StoryService from '../services/storyService.js';

/**
 * Controller for Story-related operations
 */
export class StoryController {
  static async createStory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const storyData = req.body;
      const story = await StoryService.createStory(storyData);
      res.status(201).json({ success: true, data: story });
    } catch (error) {
      next(error);
    }
  }

  static async getStories(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { epicId, projectId } = req.query;
      const stories = await StoryService.getStories(
        epicId as string | undefined,
        projectId as string | undefined,
      );
      res.json({ success: true, data: stories });
    } catch (error) {
      next(error);
    }
  }

  static async getStoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const story = await StoryService.getStoryById(id as string);
      if (!story) {
        res.status(404).json({ success: false, message: 'Story not found' });
        return;
      }
      res.json({ success: true, data: story });
    } catch (error) {
      next(error);
    }
  }

  static async updateStory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const story = await StoryService.updateStory(id as string, updateData);
      if (!story) {
        res.status(404).json({ success: false, message: 'Story not found' });
        return;
      }
      res.json({ success: true, data: story });
    } catch (error) {
      next(error);
    }
  }

  static async deleteStory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await StoryService.deleteStory(id as string);
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Story not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async reorderStories(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { orderedIds } = req.body;

      if (!orderedIds || !Array.isArray(orderedIds)) {
        res.status(400).json({ success: false, message: 'orderedIds array is required' });
        return;
      }

      const result = await StoryService.reorderStories(id as string, orderedIds as string[]);
      if (!result) {
        res.status(404).json({ success: false, message: 'Epic not found or invalid IDs' });
        return;
      }

      res.json({ success: true, message: 'Stories reordered successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export default StoryController;
