import { Types } from 'mongoose';
import Story from '../models/Story.js';
import { IStory } from '../models/Story.js';

/**
 * Service layer for Story business logic
 */
export class StoryService {
  /**
   * Create a new story with auto-generated storyNumber
   */
  static async createStory(storyData: Partial<IStory>): Promise<IStory> {
    const storyNumber = await Story.generateStoryNumber();

    // Auto-assign order if not provided
    if (storyData.order === undefined && storyData.epic) {
      const maxOrder = await Story.findOne({ epic: storyData.epic })
        .sort({ order: -1 })
        .select('order')
        .lean();
      storyData.order = (maxOrder?.order ?? -1) + 1;
    }

    const story = new Story({ ...storyData, storyNumber });
    return await story.save();
  }

  /**
   * Get stories optionally filtered by epic
   */
  static async getStories(epicId?: string, projectId?: string): Promise<IStory[]> {
    const query: Record<string, unknown> = {};

    if (epicId && Types.ObjectId.isValid(epicId)) {
      query.epic = new Types.ObjectId(epicId);
    }

    if (projectId && Types.ObjectId.isValid(projectId)) {
      query.project = new Types.ObjectId(projectId);
    }

    return await Story.find(query)
      .populate('assignee', 'name email avatar')
      .populate('epic', 'name epicNumber')
      .populate('project', 'name color')
      .sort({ order: 1, createdAt: -1 });
  }

  /**
   * Get story by ID
   */
  static async getStoryById(id: string): Promise<IStory | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Story.findById(id)
      .populate('assignee', 'name email avatar')
      .populate('epic', 'name epicNumber')
      .populate('project', 'name color');
  }

  /**
   * Update story by ID
   */
  static async updateStory(id: string, updateData: Partial<IStory>): Promise<IStory | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const story = await Story.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    )
      .populate('assignee', 'name email avatar')
      .populate('epic', 'name epicNumber')
      .populate('project', 'name color');

    return story;
  }

  /**
   * Delete story by ID
   */
  static async deleteStory(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await Story.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  /**
   * Reorder stories within an epic for drag-and-drop
   * @param epicId - The epic containing the stories
   * @param orderedIds - Array of story IDs in their new order
   */
  static async reorderStories(epicId: string, orderedIds: string[]): Promise<boolean> {
    if (!Types.ObjectId.isValid(epicId)) {
      return false;
    }

    if (!orderedIds || orderedIds.length === 0) {
      return false;
    }

    const bulkOps = orderedIds.map((storyId, index) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(storyId), epic: new Types.ObjectId(epicId) },
        update: { $set: { order: index } },
      },
    }));

    await Story.bulkWrite(bulkOps);
    return true;
  }
}

export default StoryService;
