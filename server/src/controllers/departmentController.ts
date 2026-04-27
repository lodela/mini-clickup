import { Request, Response } from "express";
import Department, { IDepartment } from "../models/Department";
import Company from "../models/Company";
import ActionLog from "../models/ActionLog";

/**
 * Get all departments for the user's company
 */
export const getDepartments = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const query: any = {};

    // God Mode can see all, Clients only their company
    if (user.role !== "GOD_MODE") {
      query.companyId = user.companyId;
    }

    const departments = await Department.find(query)
      .populate("manager", "name email avatar")
      .populate("companyId", "name")
      .sort({ name: 1 });

    res.status(200).json({ success: true, data: departments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create a new department
 */
export const createDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, managerId, companyId } = req.body;
    const user = (req as any).user;

    // Use provided companyId or the user's own company
    const targetCompanyId = user.role === "GOD_MODE" ? companyId : user.companyId;

    if (!targetCompanyId) {
      res.status(400).json({ success: false, message: "Company ID is required" });
      return;
    }

    const department = await Department.create({
      name,
      description,
      manager: managerId,
      companyId: targetCompanyId,
    });

    await ActionLog.create({
      userId: user._id,
      action: "CREATE",
      entity: "Department",
      entityId: department._id,
      details: `Created department ${name}`,
      companyId: targetCompanyId
    });

    res.status(201).json({ success: true, data: department });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Update a department
 */
export const updateDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, managerId, status } = req.body;
    const updates: Partial<IDepartment> = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (managerId !== undefined) updates.manager = managerId;
    if (status !== undefined) updates.status = status;

    const department = await Department.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!department) {
      res.status(404).json({ success: false, message: "Department not found" });
      return;
    }

    await ActionLog.create({
      userId: (req as any).user._id,
      action: "UPDATE",
      entity: "Department",
      entityId: department._id,
      details: `Updated department ${department.name}`,
      companyId: department.companyId
    });

    res.status(200).json({ success: true, data: department });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Delete a department
 */
export const deleteDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      res.status(404).json({ success: false, message: "Department not found" });
      return;
    }

    await department.deleteOne();

    await ActionLog.create({
      userId: (req as any).user._id,
      action: "DELETE",
      entity: "Department",
      entityId: department._id,
      details: `Deleted department ${department.name}`,
      companyId: department.companyId
    });

    res.status(200).json({ success: true, message: "Department removed" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
