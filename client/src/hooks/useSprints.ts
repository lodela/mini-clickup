import { useState, useEffect, useCallback } from 'react';
import { api, ApiRequestError } from '@/services/api';

interface ISprint {
  _id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Custom hook for managing sprint data
 */
export const useSprints = () => {
  const [sprints, setSprints] = useState<ISprint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all sprints
  const fetchSprints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ISprint[]>('/sprints');
      setSprints(response.data);
    } catch (err: any) {
      const errorMessage =
        err instanceof ApiRequestError
          ? err.data?.message
          : err?.message || 'Failed to fetch sprints';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new sprint
  const createSprint = useCallback(async (sprintData: Partial<ISprint>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<ISprint>('/sprints', sprintData);
      setSprints((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err instanceof ApiRequestError
          ? err.data?.message
          : err?.message || 'Failed to create sprint';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a sprint
  const updateSprint = useCallback(async (id: string, updateData: Partial<ISprint>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put<ISprint>(`/sprints/${id}`, updateData);
      setSprints((prev) => prev.map((sprint) => (sprint._id === id ? response.data : sprint)));
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err instanceof ApiRequestError
          ? err.data?.message
          : err?.message || 'Failed to update sprint';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a sprint
  const deleteSprint = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete<{ message: string }>(`/sprints/${id}`);
      setSprints((prev) => prev.filter((sprint) => sprint._id !== id));
    } catch (err: any) {
      const errorMessage =
        err instanceof ApiRequestError
          ? err.data?.message
          : err?.message || 'Failed to delete sprint';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch sprints on mount
  useEffect(() => {
    fetchSprints();
  }, [fetchSprints]);

  return {
    sprints,
    loading,
    error,
    fetchSprints,
    createSprint,
    updateSprint,
    deleteSprint,
  };
};

export default useSprints;
