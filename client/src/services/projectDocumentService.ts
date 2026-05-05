import { api } from './api.js';
import type { ProjectDocument, CreateProjectDocumentDTO, UpdateProjectDocumentDTO } from '@/types';

export async function createDocument(dto: CreateProjectDocumentDTO): Promise<ProjectDocument> {
  const { data } = await api.post<ProjectDocument>('/project-documents', dto);
  return data;
}

export async function getDocuments(projectId: string): Promise<ProjectDocument[]> {
  const { data } = await api.get<ProjectDocument[]>(`/project-documents?projectId=${projectId}`);
  return data;
}

export async function getDocumentById(id: string): Promise<ProjectDocument> {
  const { data } = await api.get<ProjectDocument>(`/project-documents/${id}`);
  return data;
}

export async function updateDocument(id: string, dto: UpdateProjectDocumentDTO): Promise<ProjectDocument> {
  const { data } = await api.put<ProjectDocument>(`/project-documents/${id}`, dto);
  return data;
}

export async function deleteDocument(id: string): Promise<void> {
  await api.delete(`/project-documents/${id}`);
}
