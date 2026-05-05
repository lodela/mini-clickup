import { Types } from 'mongoose';
import ProjectDocument from '../models/ProjectDocument.js';
import { IProjectDocument } from '../models/ProjectDocument.js';

/**
 * Service layer for Project Document business logic
 */
export class ProjectDocumentService {
  /**
   * Create a new project document
   */
  static async createDocument(data: Partial<IProjectDocument>): Promise<IProjectDocument> {
    const doc = new ProjectDocument(data);
    return await doc.save();
  }

  /**
   * Get all documents for a project
   */
  static async getDocuments(projectId: string): Promise<IProjectDocument[]> {
    if (!Types.ObjectId.isValid(projectId)) {
      return [];
    }

    return await ProjectDocument.find({ project: new Types.ObjectId(projectId) })
      .populate('author', 'name email avatar')
      .populate('project', 'name')
      .sort({ createdAt: -1 });
  }

  /**
   * Get document by ID
   */
  static async getDocumentById(id: string): Promise<IProjectDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return await ProjectDocument.findById(id)
      .populate('author', 'name email avatar')
      .populate('project', 'name');
  }

  /**
   * Update document by ID
   */
  static async updateDocument(id: string, updateData: Partial<IProjectDocument>): Promise<IProjectDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return await ProjectDocument.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    )
      .populate('author', 'name email avatar')
      .populate('project', 'name');
  }

  /**
   * Delete document by ID
   */
  static async deleteDocument(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await ProjectDocument.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}

export default ProjectDocumentService;
