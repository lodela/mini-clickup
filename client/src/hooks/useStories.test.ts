import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useStories } from './useStories';
import * as storyService from '@/services/storyService';
import type { Story } from '@/types';

vi.mock('@/services/storyService', () => ({
  getStories: vi.fn(),
  createStory: vi.fn(),
  updateStory: vi.fn(),
  deleteStory: vi.fn(),
  reorderStories: vi.fn(),
}));

describe('useStories', () => {
  const mockStories: Story[] = [
    {
      _id: 'story1',
      storyNumber: 'STY-0001',
      title: 'Story One',
      epic: 'epic1',
      project: 'proj1',
      status: 'todo',
      priority: 'medium',
      sizing: 'md',
      order: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      _id: 'story2',
      storyNumber: 'STY-0002',
      title: 'Story Two',
      epic: 'epic1',
      project: 'proj1',
      status: 'doing',
      priority: 'high',
      sizing: 'lg',
      order: 2,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load stories for an epic', async () => {
    vi.mocked(storyService.getStories).mockResolvedValueOnce(mockStories);

    const { result } = renderHook(() => useStories({ epicId: 'epic1' }));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.stories).toEqual(mockStories);
    expect(storyService.getStories).toHaveBeenCalledWith({ epicId: 'epic1' });
  });

  it('should create a story and update state', async () => {
    vi.mocked(storyService.getStories).mockResolvedValueOnce([]);
    vi.mocked(storyService.createStory).mockResolvedValueOnce(mockStories[0]);

    const { result } = renderHook(() => useStories({ epicId: 'epic1' }));
    await waitFor(() => expect(result.current.loading).toBe(false));

    const newStory = await result.current.create({
      title: 'Story One',
      epic: 'epic1',
      project: 'proj1',
    });

    await waitFor(() => expect(result.current.stories).toContainEqual(mockStories[0]));
    expect(storyService.createStory).toHaveBeenCalledWith({
      title: 'Story One',
      epic: 'epic1',
      project: 'proj1',
    });
    expect(newStory).toEqual(mockStories[0]);
  });

  it('should reorder stories locally and call service', async () => {
    vi.mocked(storyService.getStories).mockResolvedValueOnce(mockStories);
    vi.mocked(storyService.reorderStories).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useStories({ epicId: 'epic1' }));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await result.current.reorder(['story2', 'story1']);

    await waitFor(() => {
      expect(result.current.stories[0]._id).toBe('story2');
      expect(result.current.stories[1]._id).toBe('story1');
    });
    expect(storyService.reorderStories).toHaveBeenCalledWith('epic1', ['story2', 'story1']);
  });

  it('should delete a story and remove from state', async () => {
    vi.mocked(storyService.getStories).mockResolvedValueOnce(mockStories);
    vi.mocked(storyService.deleteStory).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useStories({ epicId: 'epic1' }));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await result.current.remove('story1');

    await waitFor(() => {
      expect(result.current.stories).toHaveLength(1);
      expect(result.current.stories[0]._id).toBe('story2');
    });
    expect(storyService.deleteStory).toHaveBeenCalledWith('story1');
  });
});
