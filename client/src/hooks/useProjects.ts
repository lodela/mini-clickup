import { useState, useEffect, useCallback } from "react";
import { Project as IProject } from "../types/index";
import axios from "axios";

/**
 * Custom hook for managing project data
 */
export const useProjects = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all projects
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/projects");
      setProjects(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new project
  const createProject = useCallback(async (projectData: Partial<IProject>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/projects", projectData);
      setProjects((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create project");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a project
  const updateProject = useCallback(
    async (id: string, updateData: Partial<IProject>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.put(`/api/projects/${id}`, updateData);
        setProjects((prev) =>
          prev.map((project) => (project._id === id ? response.data : project)),
        );
        return response.data;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to update project");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Delete a project
  const deleteProject = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/projects/${id}`);
      setProjects((prev) => prev.filter((project) => project._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete project");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
};
