import { useState, useEffect, useCallback } from 'react';
import * as epicService from '@/services/epicService';
import type { Epic, CreateEpicDTO } from '@/types';

interface UseEpicsReturn {
  epics: Epic[];
  loading: boolean;
  error: string | null;
  create: (data: CreateEpicDTO) => Promise<Epic>;
  update: (id: string, data: Partial<CreateEpicDTO>) => Promise<Epic>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useEpics(projectId: string): UseEpicsReturn {
  const [epics, setEpics] = useState<Epic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await epicService.getEpics(projectId);
      setEpics(data);
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to load epics');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (data: CreateEpicDTO) => {
      const epic = await epicService.createEpic(data);
      setEpics((prev) => [...prev, epic]);
      return epic;
    },
    [],
  );

  const update = useCallback(async (id: string, data: Partial<CreateEpicDTO>) => {
    const epic = await epicService.updateEpic(id, data);
    setEpics((prev) => prev.map((e) => (e._id === id ? epic : e)));
    return epic;
  }, []);

  const remove = useCallback(async (id: string) => {
    await epicService.deleteEpic(id);
    setEpics((prev) => prev.filter((e) => e._id !== id));
  }, []);

  return { epics, loading, error, create, update, remove, refresh: load };
}
