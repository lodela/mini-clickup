import { api } from "@/services/api";

/**
 * Catalog item from the server
 */
export interface CatalogItem {
  _id: string;
  type: string;
  key: string;
  value: string;
  label: string;
  labelEn: string;
  order: number;
  isActive: boolean;
}

/**
 * Catalogs grouped by type
 */
export type CatalogsByType = Record<string, CatalogItem[]>;

/**
 * API response from GET /api/catalogs
 */
interface CatalogsResponse {
  success: boolean;
  data: CatalogsByType;
}

/**
 * Fetches all active catalogs grouped by type
 */
export async function fetchCatalogs(): Promise<CatalogsByType> {
  const response = await api.get<CatalogsResponse>("/catalogs");
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error("Failed to fetch catalogs");
}
