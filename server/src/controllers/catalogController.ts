import { Request, Response, NextFunction } from "express";
import { catalogService } from "@/services/catalogService.js";

/**
 * CatalogController
 *
 * Handles catalog retrieval for the frontend.
 * Catalogs are static reference data (project statuses, priorities, etc.)
 */
export const catalogController = {
  /**
   * GET /api/catalogs
   * Returns all active catalogs grouped by type
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const catalogs = await catalogService.getAllGrouped();
      res.status(200).json({ success: true, data: catalogs });
    } catch (error) {
      next(error);
    }
  },
};
