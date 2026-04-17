import { Types } from "mongoose";
import Sprint from "../models/Sprint.js";
import { ISprint } from "../models/Sprint.js";

export class SprintService {
  static async createSprint(sprintData: Partial<ISprint>): Promise<ISprint> {
    const sprint = new Sprint(sprintData);
    return await sprint.save();
  }

  static async getSprints(
    filters: Record<string, unknown> = {},
  ): Promise<ISprint[]> {
    return await Sprint.find(filters);
  }

  static async getSprintById(id: string): Promise<ISprint | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Sprint.findById(id);
  }

  static async updateSprint(
    id: string,
    updateData: Partial<ISprint>,
  ): Promise<ISprint | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const sprint = await Sprint.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    );

    return sprint;
  }

  static async deleteSprint(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await Sprint.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}

export default SprintService;
