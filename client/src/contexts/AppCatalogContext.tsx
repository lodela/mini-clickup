import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { fetchCatalogs, type CatalogItem, type CatalogsByType } from "@/services/catalogService";
import { useAuth } from "@/contexts/AuthContext";

/**
 * AppCatalogContext
 *
 * Global SSoT for reference catalogs (project_status, task_priority, etc.).
 * Loads once after authentication and caches the data for the entire session.
 */

interface AppCatalogContextValue {
  catalogs: CatalogsByType;
  isLoading: boolean;
  error: string | null;
  /** Returns catalog items for a given type (e.g. "project_status") */
  byType: (type: string) => CatalogItem[];
  /** Returns a catalog item by type and key */
  getKey: (type: string, key: string) => CatalogItem | undefined;
}

const AppCatalogContext = createContext<AppCatalogContextValue | null>(null);

export function AppCatalogProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [catalogs, setCatalogs] = useState<CatalogsByType>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadCatalogs = useCallback(async () => {
    if (hasLoaded) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCatalogs();
      setCatalogs(data);
      setHasLoaded(true);
    } catch (err: any) {
      setError(err?.message || "Failed to load catalogs");
    } finally {
      setIsLoading(false);
    }
  }, [hasLoaded]);

  // Load catalogs once the user is authenticated
  useEffect(() => {
    if (isAuthenticated && !hasLoaded) {
      loadCatalogs();
    }
  }, [isAuthenticated, hasLoaded, loadCatalogs]);

  const byType = useCallback(
    (type: string): CatalogItem[] => catalogs[type] ?? [],
    [catalogs],
  );

  const getKey = useCallback(
    (type: string, key: string): CatalogItem | undefined =>
      catalogs[type]?.find((item) => item.key === key),
    [catalogs],
  );

  return (
    <AppCatalogContext.Provider
      value={{ catalogs, isLoading, error, byType, getKey }}
    >
      {children}
    </AppCatalogContext.Provider>
  );
}

export function useAppCatalog(): AppCatalogContextValue {
  const ctx = useContext(AppCatalogContext);
  if (!ctx) {
    throw new Error("useAppCatalog must be used within AppCatalogProvider");
  }
  return ctx;
}
