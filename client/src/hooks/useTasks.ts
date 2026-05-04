import { useState, useEffect, useCallback } from 'react';
import { Task as ITask } from '../types/index';
import { api, ApiRequestError } from '@/services/api';

/**
 * Custom hook for managing task data
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ITask[]>('/tasks');
      setTasks(response.data);
    } catch (err: any) {
      const errorMessage =
        err instanceof ApiRequestError
          ? err.data?.message
          : err?.message || 'Failed to fetch tasks';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new task
  const createTask = useCallback(async (taskData: Partial<ITask>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<ITask>('/tasks', taskData);
      setTasks((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err instanceof ApiRequestError
          ? err.data?.message
          : err?.message || 'Failed to create task';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a task
  const updateTask = useCallback(async (id: string, updateData: Partial<ITask>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put<ITask>(`/tasks/${id}`, updateData);
      setTasks((prev) => prev.map((task) => (task._id === id ? response.data : task)));
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err instanceof ApiRequestError
          ? err.data?.message
          : err?.message || 'Failed to update task';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a task
  const deleteTask = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete<{ message: string }>(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err: any) {
      const errorMessage =
        err instanceof ApiRequestError
          ? err.data?.message
          : err?.message || 'Failed to delete task';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
