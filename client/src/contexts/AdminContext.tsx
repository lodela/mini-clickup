import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { api } from '@/services/api';

/**
 * AdminContext
 *
 * SSoT for administrative data (companies, departments, teams).
 * Scoped to /admin/* routes via AdminLayout.
 * Lazy-loads per section — no upfront cost for non-admin users.
 */

// ── Types ──────────────────────────────────────────────────────────────────

export interface AdminCompany {
  _id: string;
  name: string;
  legalName: string;
  domain?: string;
  email?: string;
  phone?: string;
  primaryContact: {
    name: string;
    email: string;
    avatar?: string;
  };
  logo: string | null;
  isActive: boolean;
  status: string;
  rfc?: string;
  stats: {
    projectsCount: number;
    storiesCount: number;
    ticketsCount: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminDepartment {
  _id: string;
  name: string;
  description?: string;
  company: string;
  manager?: string;
  status: string;
}

export interface AdminTeam {
  _id: string;
  name: string;
  description?: string;
  department?: string;
  memberCount?: number;
}

// ── Context value ──────────────────────────────────────────────────────────

interface AdminContextValue {
  // Companies
  companies: AdminCompany[];
  isLoadingCompanies: boolean;
  companiesPagination: { page: number; pages: number; total: number } | null;
  fetchCompanies: (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  setCompanies: (companies: AdminCompany[]) => void;

  // Departments
  departments: AdminDepartment[];
  isLoadingDepartments: boolean;
  fetchDepartments: (companyId: string) => Promise<void>;
  setDepartments: (departments: AdminDepartment[]) => void;

  // Teams
  teams: AdminTeam[];
  isLoadingTeams: boolean;
  fetchTeams: (departmentId: string) => Promise<void>;
  setTeams: (teams: AdminTeam[]) => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────

export function AdminProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [companiesPagination, setCompaniesPagination] = useState<{
    page: number;
    pages: number;
    total: number;
  } | null>(null);

  const [departments, setDepartments] = useState<AdminDepartment[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);

  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);

  const fetchCompanies = useCallback(
    async (params?: { search?: string; page?: number; limit?: number }) => {
      setIsLoadingCompanies(true);
      try {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.set('search', params.search);
        if (params?.page) queryParams.set('page', String(params.page));
        if (params?.limit) queryParams.set('limit', String(params.limit));
        const url = `/admin/companies?${queryParams.toString()}`;
        const response = await api.get<{
          success: boolean;
          data: AdminCompany[];
          pagination: { page: number; pages: number; total: number };
        }>(url);
        if (response.data.success) {
          if (!params?.page || params.page === 1) {
            setCompanies(response.data.data);
          } else {
            setCompanies((prev) => [...prev, ...response.data.data]);
          }
          setCompaniesPagination(response.data.pagination);
        }
      } catch {
        // Error handled by api.ts
      } finally {
        setIsLoadingCompanies(false);
      }
    },
    [],
  );

  const fetchDepartments = useCallback(async (companyId: string) => {
    setIsLoadingDepartments(true);
    try {
      const response = await api.get<{
        success: boolean;
        data: AdminDepartment[];
      }>(`/admin/departments?companyId=${companyId}`);
      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch {
      // Error handled by api.ts
    } finally {
      setIsLoadingDepartments(false);
    }
  }, []);

  const fetchTeams = useCallback(async (departmentId: string) => {
    setIsLoadingTeams(true);
    try {
      const response = await api.get<{
        success: boolean;
        data: AdminTeam[];
      }>(`/teams?departmentId=${departmentId}`);
      if (response.data.success) {
        setTeams(response.data.data);
      }
    } catch {
      // Error handled by api.ts
    } finally {
      setIsLoadingTeams(false);
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{
        companies,
        isLoadingCompanies,
        companiesPagination,
        fetchCompanies,
        setCompanies,
        departments,
        isLoadingDepartments,
        fetchDepartments,
        setDepartments,
        teams,
        isLoadingTeams,
        fetchTeams,
        setTeams,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return ctx;
}
