import { Router } from "express";
import { catalogController } from "@/controllers/catalogController.js";
import { authenticate } from "@/middleware/auth.js";

const router = Router();

/**
 * GET /api/catalogs
 * Returns all active catalogs grouped by type.
 * Requires authentication — catalogs are only useful post-login.
 */
router.get("/", authenticate, catalogController.getAll);

export default router;
