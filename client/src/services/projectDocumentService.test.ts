/**
 * ProjectDocument Service Tests (TDD RED)
 * Tests for CRUD operations on project documents.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api, ApiRequestError } from './api';
import {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
} from './projectDocumentService';
import type { ProjectDocument, CreateProjectDocumentDTO, UpdateProjectDocumentDTO } from '@/types';

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

describe('projectDocumentService', () => {
  const mockDoc: ProjectDocument = {
    _id: 'doc1',
    title: 'Project Spec',
    content: '<p>Hello world</p>',
    project: 'proj1',
    author: 'user1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createDocument', () => {
    it('should create a document and return it', async () => {
      const dto: CreateProjectDocumentDTO = { title: 'Project Spec', content: '<p>Hello</p>', project: 'proj1' };
      vi.mocked(api.post).mockResolvedValueOnce({ data: mockDoc });

      const result = await createDocument(dto);
      expect(api.post).toHaveBeenCalledWith('/project-documents', dto);
      expect(result).toEqual(mockDoc);
    });

    it('should throw ApiRequestError on 401', async () => {
      const dto: CreateProjectDocumentDTO = { title: 'X', content: 'Y', project: 'proj1' };
      const err = new ApiRequestError(401, { success: false, error: 'Unauthorized', message: 'Unauthorized' });
      vi.mocked(api.post).mockRejectedValueOnce(err);

      await expect(createDocument(dto)).rejects.toBeInstanceOf(ApiRequestError);
    });
  });

  describe('getDocuments', () => {
    it('should fetch documents by projectId', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: [mockDoc] });

      const result = await getDocuments('proj1');
      expect(api.get).toHaveBeenCalledWith('/project-documents?projectId=proj1');
      expect(result).toEqual([mockDoc]);
    });
  });

  describe('getDocumentById', () => {
    it('should fetch a single document', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: mockDoc });

      const result = await getDocumentById('doc1');
      expect(api.get).toHaveBeenCalledWith('/project-documents/doc1');
      expect(result).toEqual(mockDoc);
    });
  });

  describe('updateDocument', () => {
    it('should update a document', async () => {
      const dto: UpdateProjectDocumentDTO = { title: 'Updated Spec' };
      vi.mocked(api.put).mockResolvedValueOnce({ data: { ...mockDoc, ...dto } });

      const result = await updateDocument('doc1', dto);
      expect(api.put).toHaveBeenCalledWith('/project-documents/doc1', dto);
      expect(result.title).toBe('Updated Spec');
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document', async () => {
      vi.mocked(api.delete).mockResolvedValueOnce({ data: undefined });

      await deleteDocument('doc1');
      expect(api.delete).toHaveBeenCalledWith('/project-documents/doc1');
    });
  });
});
