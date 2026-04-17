import { useState, useEffect, useCallback } from "react";
import { ITask } from "../types/index";
import axios from "axios";

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
      const response = await axios.get("/api/tasks");
      setTasks(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new task
  const createTask = useCallback(async (taskData: Partial<ITask>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/tasks", taskData);
      setTasks((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create task");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a task
  const updateTask = useCallback(
    async (id: string, updateData: Partial<ITask>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.put(`/api/tasks/${id}`, updateData);
        setTasks((prev) =>
          prev.map((task) => (task._id === id ? response.data : task)),
        );
        return response.data;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to update task");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Delete a task
  const deleteTask = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete task");
      throw err;
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
