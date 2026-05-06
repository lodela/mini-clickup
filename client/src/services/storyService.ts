import { api } from './api';
import type { Story, CreateStoryDTO, UpdateStoryDTO } from '@/types';

export async function createStory(data: CreateStoryDTO): Promise<Story> {
  const { data: story } = await api.post<Story>('/stories', data);
  return story;
}

export async function getStories(params: { epicId?: string; projectId?: string } = {}): Promise<Story[]> {
  const query = new URLSearchParams();
  if (params.epicId) query.append('epicId', params.epicId);
  if (params.projectId) query.append('projectId', params.projectId);
  const url = query.toString() ? `/stories?${query.toString()}` : '/stories';
  const { data: stories } = await api.get<Story[]>(url);
  return stories;
}

export async function getStoryById(id: string): Promise<Story> {
  const { data: story } = await api.get<Story>(`/stories/${id}`);
  return story;
}

export async function updateStory(id: string, data: UpdateStoryDTO): Promise<Story> {
  const { data: story } = await api.put<Story>(`/stories/${id}`, data);
  return story;
}

export async function deleteStory(id: string): Promise<void> {
  await api.delete<void>(`/stories/${id}`);
}

export async function reorderStories(epicId: string, orderedIds: string[]): Promise<void> {
  await api.put<void>(`/stories/${epicId}/reorder`, { orderedIds });
}
