import { useState, useEffect, useCallback } from "react";
import axios from "axios";

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
      const response = await axios.get("/api/sprints");
      setSprints(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch sprints");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new sprint
  const createSprint = useCallback(async (sprintData: Partial<ISprint>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/sprints", sprintData);
      setSprints((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create sprint");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a sprint
  const updateSprint = useCallback(
    async (id: string, updateData: Partial<ISprint>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.put(`/api/sprints/${id}`, updateData);
        setSprints((prev) =>
          prev.map((sprint) => (sprint._id === id ? response.data : sprint)),
        );
        return response.data;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to update sprint");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Delete a sprint
  const deleteSprint = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/sprints/${id}`);
      setSprints((prev) => prev.filter((sprint) => sprint._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete sprint");
      throw err;
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
