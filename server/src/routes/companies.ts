/**
 * Company routes — public search (during onboarding) and admin management.
 */
import { Router, Request, Response, NextFunction } from "express";
import * as companyService from "../services/companyService.js";

const router = Router();

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * GET /api/companies/search?q=name&domain=company.com
 * Public endpoint used during onboarding step 2 (no auth required).
 */
router.get(
  "/search",
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const q      = String(req.query.q      ?? "").trim();
      const domain = String(req.query.domain ?? "").trim();

      if (!q && !domain) {
        res.status(400).json({ success: false, error: "Provide q or domain" });
        return;
      }

      const matches = await companyService.fuzzySearch(q, domain || undefined);

      res.status(200).json({
        success: true,
        data: {
          results: matches.map(({ company, score }) => ({
            _id:    (company as any)._id,
            name:   company.name,
            slug:   company.slug,
            domain: company.emailDomain,
            score:  Math.round(score * 100),
          })),
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
