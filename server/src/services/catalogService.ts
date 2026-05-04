import Catalog, { CatalogsByType } from "@/models/Catalog.js";

/**
 * CatalogService
 *
 * Retrieves active catalogs grouped by type.
 */
export const catalogService = {
  /**
   * Get all active catalogs grouped by type.
   */
  async getAllGrouped(): Promise<CatalogsByType> {
    return Catalog.getAllGrouped();
  },
};
