import { Request, Response, NextFunction } from "express";
import { can } from "../services/permissionService.js";
import { RoleAction, RoleModule } from "../models/Role.js";

/**
 * Factory middleware — requirePermission("projects", "create")
 * Requires authenticate() middleware to run first (sets req.user).
 */
export function requirePermission(module: RoleModule, action: RoleAction) {
  return async (req: Request & { user?: { userId: string } }, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: "Not authenticated" });
      return;
    }

    const allowed = await can(userId, module, action);
    if (!allowed) {
      res.status(403).json({
        success: false,
        error: "Forbidden",
        message: `You don't have permission to ${action} ${module}`,
      });
      return;
    }

    next();
  };
}
