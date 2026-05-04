import { useState, useEffect, useCallback } from 'react';
import { Project as IProject } from '../types/index';
import { api, ApiRequestError } from '@/services/api';

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
      const response = await api.get<IProject[]>('/projects');
      setProjects(response.data);
    } catch (err: any) {
      const errorMessage =
        err instanceof ApiRequestError
          ? err.data?.message
          : err?.message || 'Failed to fetch projects';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new project
  const createProject = useCallback(async (projectData: Partial<IProject>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<IProject>('/projects', projectData);
      setProjects((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err instanceof ApiRequestError
          ? err.data?.message
          : err?.message || 'Failed to create project';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a project
  const updateProject = useCallback(async (id: string, updateData: Partial<IProject>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put<IProject>(`/projects/${id}`, updateData);
      setProjects((prev) => prev.map((project) => (project._id === id ? response.data : project)));
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err instanceof ApiRequestError
          ? err.data?.message
          : err?.message || 'Failed to update project';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a project
  const deleteProject = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete<{ message: string }>(`/projects/${id}`);
      setProjects((prev) => prev.filter((project) => project._id !== id));
    } catch (err: any) {
      const errorMessage =
        err instanceof ApiRequestError
          ? err.data?.message
          : err?.message || 'Failed to delete project';
      setError(errorMessage);
      throw new Error(errorMessage);
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
