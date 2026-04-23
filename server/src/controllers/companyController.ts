import { Request, Response } from "express";
import Company, { ICompany } from "../models/Company";
import User from "../models/User";
import ActionLog from "../models/ActionLog";
import { Types } from "mongoose";

/**
 * Helper to log actions
 */
const logAction = async (userId: string, action: string, entity: string, entityId: any, details: string, changes?: any) => {
  try {
    await ActionLog.create({
      userId,
      action,
      entity,
      entityId,
      details,
      changes,
    });
  } catch (error) {
    console.error("Failed to log action:", error);
  }
};

/**
 * Get all companies with pagination, search and stats
 */
export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    let query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { rfc: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Company.countDocuments(query);
    const companies = await Company.find(query)
      .populate("primaryContact", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: companies.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: companies,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create a new company and its initial Admin (CLIENT_A)
 */
export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name, legalName, rfc, fiscalAddress, primaryContactData } = req.body;

    // 1. Create the primary contact user (CLIENT_A) first if it's new data
    // Or link to an existing user. For PoC, let's assume we create a new user.
    const newAdmin = await User.create({
      name: primaryContactData.name,
      email: primaryContactData.email,
      password: "ChangeMe123!", // Default password for first login
      role: "CLIENT_A",
      isActive: true,
    });

    // 2. Create the company linked to this admin
    const company = await Company.create({
      name,
      legalName,
      rfc,
      fiscalAddress,
      primaryContact: newAdmin._id,
      logo: req.file ? `/uploads/logos/${req.file.filename}` : null,
    });

    // 3. Link user back to company
    newAdmin.companyId = company._id as Types.ObjectId;
    await newAdmin.save();

    // 4. Log the action
    await logAction(
      (req as any).user._id,
      "CREATE",
      "Company",
      company._id,
      `Created company ${name} and linked admin ${newAdmin.email}`,
      { company, admin: newAdmin.email }
    );

    res.status(201).json({
      success: true,
      data: company,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get company details with deep stats
 */
export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate("primaryContact", "name email role");

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    res.status(200).json({ success: true, data: company });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
