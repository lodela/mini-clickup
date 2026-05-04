import { Types } from 'mongoose';
import Epic from '../models/Epic.js';
import { IEpic, EpicStatus } from '../models/Epic.js';
import Story from '../models/Story.js';

/**
 * Epic result type with optional story count
 */
export type EpicWithStoryCount = IEpic & { storyCount?: number };

/**
 * Service layer for Epic business logic
 */
export class EpicService {
  /**
   * Create a new epic with auto-generated epicNumber
   */
  static async createEpic(epicData: Partial<IEpic>): Promise<IEpic> {
    const epicNumber = await Epic.generateEpicNumber();
    const epic = new Epic({ ...epicData, epicNumber });
    return await epic.save();
  }

  /**
   * Get all epics with populated owner
   */
  static async getEpics(projectId?: string): Promise<IEpic[]> {
    const query: Record<string, unknown> = {};
    if (projectId && Types.ObjectId.isValid(projectId)) {
      query.project = new Types.ObjectId(projectId);
    }
    return await Epic.find(query)
      .populate('owner', 'name email avatar')
      .populate('project', 'name color')
      .sort({ createdAt: -1 });
  }

  /**
   * Get epic by ID with populated owner and story count
   */
  static async getEpicById(id: string): Promise<(EpicWithStoryCount) | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const epic = await Epic.findById(id)
      .populate('owner', 'name email avatar')
      .populate('project', 'name color')
      .lean();

    if (!epic) {
      return null;
    }

    const storyCount = await Story.countDocuments({ epic: epic._id });

    return {
      ...epic,
      storyCount,
    } as unknown as EpicWithStoryCount;
  }

  /**
   * Update epic by ID
   */
  static async updateEpic(id: string, updateData: Partial<IEpic>): Promise<IEpic | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const epic = await Epic.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    )
      .populate('owner', 'name email avatar')
      .populate('project', 'name color');

    return epic;
  }

  /**
   * Delete epic by ID
   */
  static async deleteEpic(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await Epic.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  /**
   * Get epics by project with optional status filter
   */
  static async getEpicsByProject(
    projectId: string,
    status?: EpicStatus,
  ): Promise<IEpic[]> {
    if (!Types.ObjectId.isValid(projectId)) {
      return [];
    }

    const query: Record<string, unknown> = { project: new Types.ObjectId(projectId) };
    if (status) {
      query.status = status;
    }

    return await Epic.find(query)
      .populate('owner', 'name email avatar')
      .sort({ priority: -1, createdAt: -1 });
  }
}

export default EpicService;
