import { useState, useCallback } from "react";
import { api, ApiRequestError } from "@/services/api";

/**
 * Team Member Interface
 */
export interface TeamMember {
  user: string | User;
  role: "admin" | "member" | "guest";
  joinedAt: string;
}

/**
 * Team Interface
 */
export interface Team {
  _id: string;
  name: string;
  description?: string;
  owner: string | User;
  members: TeamMember[];
  projects?: string[];
  avatar?: string;
  memberCount?: number;
  projectCount?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * User Interface (referenced)
 */
export interface User {
  _id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  avatar?: string;
}

/**
 * Create Team DTO
 */
export interface CreateTeamDTO {
  name: string;
  description?: string;
  avatar?: string;
}

/**
 * Update Team DTO
 */
export interface UpdateTeamDTO {
  name?: string;
  description?: string;
  avatar?: string;
}

/**
 * Add Member DTO
 */
export interface AddMemberDTO {
  email: string;
  role: "admin" | "member" | "guest";
}

/**
 * Use Teams Hook Return Type
 */
interface UseTeamsReturn {
  teams: Team[];
  isLoading: boolean;
  error: string | null;
  createTeam: (data: CreateTeamDTO) => Promise<Team>;
  updateTeam: (id: string, data: UpdateTeamDTO) => Promise<Team>;
  deleteTeam: (id: string) => Promise<void>;
  addMember: (id: string, data: AddMemberDTO) => Promise<void>;
  inviteMembers: (
    id: string,
    emails: string[],
    role: "admin" | "member" | "guest",
  ) => Promise<void>;
  removeMember: (id: string, userId: string) => Promise<void>;
  updateMemberRole: (
    id: string,
    userId: string,
    role: "admin" | "member" | "guest",
  ) => Promise<void>;
  refreshTeams: () => Promise<void>;
}

/**
 * Custom hook for team operations
 *
 * Provides team state management and API integration
 */
export function useTeams(): UseTeamsReturn {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all teams
   */
  const refreshTeams = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get<{ success: boolean; data: Team[] }>(
        "/teams",
      );

      if (response.data.success) {
        setTeams(response.data.data);
      }
    } catch (err: any) {
      const errorMessage =
        err instanceof ApiRequestError
          ? err.data?.message
          : err?.message || "Failed to fetch teams";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new team
   */
  const createTeam = useCallback(async (data: CreateTeamDTO): Promise<Team> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post<{ success: boolean; data: Team }>(
        "/teams",
        data,
      );

      if (response.data.success && response.data.data) {
        const newTeam = response.data.data;
        setTeams((prev) => [...prev, newTeam]);
        return newTeam;
      }

      throw new Error("Failed to create team");
    } catch (err: any) {
      const errorMessage =
        err instanceof ApiRequestError
          ? err.data?.message
          : err?.message || "Failed to create team";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update an existing team
   */
  const updateTeam = useCallback(
    async (id: string, data: UpdateTeamDTO): Promise<Team> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.put<{ success: boolean; data: Team }>(
          `/teams/${id}`,
          data,
        );

        if (response.data.success && response.data.data) {
          const updatedTeam = response.data.data;
          setTeams((prev) =>
            prev.map((team) => (team._id === id ? updatedTeam : team)),
          );
          return updatedTeam;
        }

        throw new Error("Failed to update team");
      } catch (err: any) {
        const errorMessage =
          err instanceof ApiRequestError
            ? err.data?.message
            : err?.message || "Failed to update team";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Delete a team
   */
  const deleteTeam = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      await api.delete<{ success: boolean }>(`/teams/${id}`);

      setTeams((prev) => prev.filter((team) => team._id !== id));
    } catch (err: any) {
      const errorMessage =
        err instanceof ApiRequestError
          ? err.data?.message
          : err?.message || "Failed to delete team";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Add a member to a team
   */
  const addMember = useCallback(
    async (id: string, data: AddMemberDTO): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        await api.post<{ success: boolean }>(`/teams/${id}/members`, data);

        // Refresh teams to get updated member list
        await refreshTeams();
      } catch (err: any) {
        const errorMessage =
          err instanceof ApiRequestError
            ? err.data?.message
            : err?.message || "Failed to add member";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [refreshTeams],
  );

  /**
   * Invite multiple members to a team
   */
  const inviteMembers = useCallback(
    async (
      id: string,
      emails: string[],
      role: "admin" | "member" | "guest",
    ): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        // Send invites in parallel
        const promises = emails.map((email) =>
          api.post(`/teams/${id}/members`, { email, role }),
        );

        await Promise.all(promises);

        // Refresh teams to get updated member list
        await refreshTeams();
      } catch (err: any) {
        const errorMessage =
          err instanceof ApiRequestError
            ? err.data?.message
            : err?.message || "Failed to invite members";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [refreshTeams],
  );

  /**
   * Remove a member from a team
   */
  const removeMember = useCallback(
    async (id: string, userId: string): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        await api.delete<{ success: boolean }>(
          `/teams/${id}/members/${userId}`,
        );

        // Refresh teams to get updated member list
        await refreshTeams();
      } catch (err: any) {
        const errorMessage =
          err instanceof ApiRequestError
            ? err.data?.message
            : err?.message || "Failed to remove member";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [refreshTeams],
  );

  /**
   * Update a member's role in a team
   */
  const updateMemberRole = useCallback(
    async (
      id: string,
      userId: string,
      role: "admin" | "member" | "guest",
    ): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        await api.put<{ success: boolean }>(
          `/teams/${id}/members/${userId}/role`,
          { role },
        );

        // Refresh teams to get updated member list
        await refreshTeams();
      } catch (err: any) {
        const errorMessage =
          err instanceof ApiRequestError
            ? err.data?.message
            : err?.message || "Failed to update member role";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [refreshTeams],
  );

  return {
    teams,
    isLoading,
    error,
    createTeam,
    updateTeam,
    deleteTeam,
    addMember,
    inviteMembers,
    removeMember,
    updateMemberRole,
    refreshTeams,
  };
}

export default useTeams;
