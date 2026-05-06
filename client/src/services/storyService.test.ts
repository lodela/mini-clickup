import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api, ApiRequestError } from './api';
import {
  createStory,
  getStories,
  getStoryById,
  updateStory,
  deleteStory,
  reorderStories,
} from './storyService';
import type { Story, CreateStoryDTO, UpdateStoryDTO } from '@/types';

vi.mock('./api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  ApiRequestError: class ApiRequestError extends Error {
    status: number;
    data: any;
    constructor(status: number, data: any) {
      super(data?.message || 'Request failed');
      this.status = status;
      this.data = data;
    }
  },
}));

describe('storyService', () => {
  const mockStory: Story = {
    _id: 'story1',
    storyNumber: 'STY-0001',
    title: 'Story One',
    description: 'Desc',
    epic: 'epic1',
    project: 'proj1',
    assignee: 'user1',
    status: 'todo',
    priority: 'medium',
    sizing: 'md',
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createStory', () => {
    it('should create a story and return it', async () => {
      const dto: CreateStoryDTO = { title: 'Story One', epic: 'epic1', project: 'proj1' };
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockStory });

      const result = await createStory(dto);
      expect(api.post).toHaveBeenCalledWith('/stories', dto);
      expect(result).toEqual(mockStory);
    });

    it('should throw ApiRequestError on 404 epic not found', async () => {
      const dto: CreateStoryDTO = { title: 'Story One', epic: 'epic1', project: 'proj1' };
      const err = new ApiRequestError(404, { success: false, error: 'Not found', message: 'Epic not found' });
      vi.mocked(api.post).mockRejectedValueOnce(err);

      await expect(createStory(dto)).rejects.toBeInstanceOf(ApiRequestError);
    });
  });

  describe('getStories', () => {
    it('should fetch stories by epicId', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: [mockStory] });

      const result = await getStories({ epicId: 'epic1' });
      expect(api.get).toHaveBeenCalledWith('/stories?epicId=epic1');
      expect(result).toEqual([mockStory]);
    });

    it('should fetch stories by projectId', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: [mockStory] });

      const result = await getStories({ projectId: 'proj1' });
      expect(api.get).toHaveBeenCalledWith('/stories?projectId=proj1');
      expect(result).toEqual([mockStory]);
    });
  });

  describe('getStoryById', () => {
    it('should fetch a single story', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: mockStory });

      const result = await getStoryById('story1');
      expect(api.get).toHaveBeenCalledWith('/stories/story1');
      expect(result).toEqual(mockStory);
    });
  });

  describe('updateStory', () => {
    it('should update a story', async () => {
      const dto: UpdateStoryDTO = { title: 'Updated Story' };
      vi.mocked(api.put).mockResolvedValueOnce({ data: { ...mockStory, ...dto } });

      const result = await updateStory('story1', dto);
      expect(api.put).toHaveBeenCalledWith('/stories/story1', dto);
      expect(result.title).toBe('Updated Story');
    });
  });

  describe('deleteStory', () => {
    it('should delete a story', async () => {
      vi.mocked(api.delete).mockResolvedValueOnce({ data: undefined });

      await deleteStory('story1');
      expect(api.delete).toHaveBeenCalledWith('/stories/story1');
    });
  });

  describe('reorderStories', () => {
    it('should reorder stories within an epic', async () => {
      vi.mocked(api.put).mockResolvedValueOnce({ data: { success: true, message: 'Reordered' } });

      await reorderStories('epic1', ['story2', 'story1', 'story3']);
      expect(api.put).toHaveBeenCalledWith('/stories/epic1/reorder', {
        orderedIds: ['story2', 'story1', 'story3'],
      });
    });
  });
});
