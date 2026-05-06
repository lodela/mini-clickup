import { api } from './api';
import type { Epic, CreateEpicDTO, UpdateEpicDTO } from '@/types';

export async function createEpic(data: CreateEpicDTO): Promise<Epic> {
  const { data: epic } = await api.post<Epic>('/epics', data);
  return epic;
}

export async function getEpics(projectId?: string): Promise<Epic[]> {
  const url = projectId ? `/epics?projectId=${projectId}` : '/epics';
  const { data: epics } = await api.get<Epic[]>(url);
  return epics;
}

export async function getEpicById(id: string): Promise<Epic> {
  const { data: epic } = await api.get<Epic>(`/epics/${id}`);
  return epic;
}

export async function updateEpic(id: string, data: UpdateEpicDTO): Promise<Epic> {
  const { data: epic } = await api.put<Epic>(`/epics/${id}`, data);
  return epic;
}

export async function deleteEpic(id: string): Promise<void> {
  await api.delete<void>(`/epics/${id}`);
}
