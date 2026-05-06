import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api, ApiRequestError } from './api';
import { createEpic, getEpics, getEpicById, updateEpic, deleteEpic } from './epicService';
import type { Epic, CreateEpicDTO, UpdateEpicDTO } from '@/types';

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

describe('epicService', () => {
  const mockEpic: Epic = {
    _id: 'epic1',
    epicNumber: 'EPIC-0001',
    name: 'Epic One',
    description: 'Desc',
    project: 'proj1',
    status: 'open',
    priority: 'medium',
    owner: 'user1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createEpic', () => {
    it('should create an epic and return it', async () => {
      const dto: CreateEpicDTO = { name: 'Epic One', project: 'proj1' };
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockEpic });

      const result = await createEpic(dto);
      expect(api.post).toHaveBeenCalledWith('/epics', dto);
      expect(result).toEqual(mockEpic);
    });

    it('should throw ApiRequestError on 401', async () => {
      const dto: CreateEpicDTO = { name: 'Epic One', project: 'proj1' };
      const err = new ApiRequestError(401, { success: false, error: 'Unauthorized', message: 'Unauthorized' });
      vi.mocked(api.post).mockRejectedValueOnce(err);

      await expect(createEpic(dto)).rejects.toBeInstanceOf(ApiRequestError);
    });
  });

  describe('getEpics', () => {
    it('should fetch epics by projectId', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: [mockEpic] });

      const result = await getEpics('proj1');
      expect(api.get).toHaveBeenCalledWith('/epics?projectId=proj1');
      expect(result).toEqual([mockEpic]);
    });

    it('should fetch all epics when no projectId', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: [mockEpic] });

      const result = await getEpics();
      expect(api.get).toHaveBeenCalledWith('/epics');
      expect(result).toEqual([mockEpic]);
    });
  });

  describe('getEpicById', () => {
    it('should fetch a single epic', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: mockEpic });

      const result = await getEpicById('epic1');
      expect(api.get).toHaveBeenCalledWith('/epics/epic1');
      expect(result).toEqual(mockEpic);
    });
  });

  describe('updateEpic', () => {
    it('should update an epic', async () => {
      const dto: UpdateEpicDTO = { name: 'Updated Epic' };
      vi.mocked(api.put).mockResolvedValueOnce({ data: { ...mockEpic, ...dto } });

      const result = await updateEpic('epic1', dto);
      expect(api.put).toHaveBeenCalledWith('/epics/epic1', dto);
      expect(result.name).toBe('Updated Epic');
    });
  });

  describe('deleteEpic', () => {
    it('should delete an epic', async () => {
      vi.mocked(api.delete).mockResolvedValueOnce({ data: undefined });

      await deleteEpic('epic1');
      expect(api.delete).toHaveBeenCalledWith('/epics/epic1');
    });
  });
});
