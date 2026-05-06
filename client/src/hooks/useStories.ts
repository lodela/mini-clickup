import { useState, useEffect, useCallback } from 'react';
import * as storyService from '@/services/storyService';
import type { Story, CreateStoryDTO } from '@/types';

interface UseStoriesReturn {
  stories: Story[];
  loading: boolean;
  error: string | null;
  create: (data: CreateStoryDTO) => Promise<Story>;
  update: (id: string, data: Partial<CreateStoryDTO>) => Promise<Story>;
  remove: (id: string) => Promise<void>;
  reorder: (orderedIds: string[]) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useStories(params: { epicId?: string; projectId?: string }): UseStoriesReturn {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await storyService.getStories(params);
      setStories(data);
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to load stories');
    } finally {
      setLoading(false);
    }
  }, [params.epicId, params.projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (data: CreateStoryDTO) => {
      const story = await storyService.createStory(data);
      setStories((prev) => [...prev, story]);
      return story;
    },
    [],
  );

  const update = useCallback(async (id: string, data: Partial<CreateStoryDTO>) => {
    const story = await storyService.updateStory(id, data);
    setStories((prev) => prev.map((s) => (s._id === id ? story : s)));
    return story;
  }, []);

  const remove = useCallback(async (id: string) => {
    await storyService.deleteStory(id);
    setStories((prev) => prev.filter((s) => s._id !== id));
  }, []);

  const reorder = useCallback(
    async (orderedIds: string[]) => {
      if (!params.epicId) return;
      await storyService.reorderStories(params.epicId, orderedIds);
      setStories((prev) => {
        const map = new Map(prev.map((s) => [s._id, s]));
        return orderedIds.map((id, index) => {
          const story = map.get(id);
          return story ? { ...story, order: index + 1 } : undefined;
        }).filter(Boolean) as Story[];
      });
    },
    [params.epicId],
  );

  return { stories, loading, error, create, update, remove, reorder, refresh: load };
}
