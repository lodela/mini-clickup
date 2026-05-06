import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEpics } from './useEpics';
import * as epicService from '@/services/epicService';
import type { Epic } from '@/types';

vi.mock('@/services/epicService', () => ({
  getEpics: vi.fn(),
  createEpic: vi.fn(),
  updateEpic: vi.fn(),
  deleteEpic: vi.fn(),
}));

describe('useEpics', () => {
  const mockEpics: Epic[] = [
    {
      _id: 'epic1',
      epicNumber: 'EPIC-0001',
      name: 'Epic One',
      project: 'proj1',
      status: 'open',
      priority: 'medium',
      owner: 'user1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load epics for a project', async () => {
    vi.mocked(epicService.getEpics).mockResolvedValueOnce(mockEpics);

    const { result } = renderHook(() => useEpics('proj1'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.epics).toEqual(mockEpics);
    expect(epicService.getEpics).toHaveBeenCalledWith('proj1');
  });

  it('should create an epic and update state', async () => {
    vi.mocked(epicService.getEpics).mockResolvedValueOnce([]);
    vi.mocked(epicService.createEpic).mockResolvedValueOnce(mockEpics[0]);

    const { result } = renderHook(() => useEpics('proj1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    const newEpic = await result.current.create({ name: 'Epic One', project: 'proj1' });

    await waitFor(() => expect(result.current.epics).toContainEqual(mockEpics[0]));
    expect(epicService.createEpic).toHaveBeenCalledWith({ name: 'Epic One', project: 'proj1' });
    expect(newEpic).toEqual(mockEpics[0]);
  });

  it('should delete an epic and remove from state', async () => {
    vi.mocked(epicService.getEpics).mockResolvedValueOnce(mockEpics);
    vi.mocked(epicService.deleteEpic).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useEpics('proj1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await result.current.remove('epic1');

    await waitFor(() => expect(result.current.epics).toHaveLength(0));
    expect(epicService.deleteEpic).toHaveBeenCalledWith('epic1');
  });
});
