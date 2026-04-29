import { Request, Response } from "express";
import mongoose, { HydratedDocument, Types } from "mongoose";
import Company, { ICompany } from "../models/Company";
import User, { IUser } from "../models/User";
import ActionLog from "../models/ActionLog";
import * as invitationService from "../services/invitationService.js";

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

    const query: any = {};
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
export const createCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, legalName, rfc, fiscalAddress } = req.body;
    const sendInvitation = req.body.sendInvitation === "true" || req.body.sendInvitation === true;
    const locale = (req.body.locale as string) || "en";

    // primaryContactData arrives as JSON string when sent via FormData
    const rawContact = req.body.primaryContactData;
    const primaryContactData = typeof rawContact === "string" ? JSON.parse(rawContact) : rawContact;

    if (!primaryContactData?.email || !primaryContactData?.name) {
      res.status(400).json({ success: false, message: "Datos del administrador incompletos (email y nombre requeridos)" });
      return;
    }

    // ── Comprehensive duplicate checks ──────────────────────────────────────
    type FieldError = { field: string; message: string };
    const fieldErrors: FieldError[] = [];

    const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // 1. Company name (case-insensitive)
    const existingByName = await Company.findOne({ name: { $regex: new RegExp(`^${escapeRegex(name)}$`, "i") } });
    if (existingByName) {
      fieldErrors.push({ field: "name", message: `La empresa "${name}" ya existe` });
    }

    // 2. Company legalName (case-insensitive)
    if (legalName) {
      const existingByLegal = await Company.findOne({ legalName: { $regex: new RegExp(`^${escapeRegex(legalName)}$`, "i") } });
      if (existingByLegal) {
        fieldErrors.push({ field: "legalName", message: `La razón social "${legalName}" ya está registrada` });
      }
    }

    // 3. RFC (exact, case-insensitive)
    if (rfc) {
      const existingByRfc = await Company.findOne({ rfc: rfc.toUpperCase().trim() });
      if (existingByRfc) {
        fieldErrors.push({ field: "rfc", message: `El RFC "${rfc.toUpperCase()}" ya está registrado` });
      }
    }

    // 4. Admin email
    const existingByEmail = await User.findOne({ email: primaryContactData.email.toLowerCase().trim() });
    if (existingByEmail) {
      fieldErrors.push({ field: "adminEmail", message: `El email "${primaryContactData.email}" ya está en uso` });
    }

    // 5. Admin cell phone (stored as 'phone' in User model)
    if (primaryContactData?.cellPhone) {
      const existingByPhone = await User.findOne({ phone: primaryContactData.cellPhone.trim() });
      if (existingByPhone) {
        fieldErrors.push({ field: "adminCellPhone", message: `El teléfono "${primaryContactData.cellPhone}" ya está registrado` });
      }
    }

    if (fieldErrors.length > 0) {
      res.status(409).json({
        success: false,
        message: "Ya existen registros con estos datos. Verifica los campos marcados.",
        fieldErrors,
      });
      return;
    }

    let newAdmin: HydratedDocument<IUser> | null = null;

    if (sendInvitation) {
      const inviteResult = await invitationService.createCorporateInvitation({
        email: primaryContactData.email,
        name: primaryContactData.name,
        role: "CLIENT_A",
        companyId: null,
        companyName: name,
        adminName: "System Administrator",
        locale,
        phone: primaryContactData.cellPhone ?? undefined,
      });

      if (!inviteResult.success || !inviteResult.data) {
        res.status(400).json({ success: false, message: inviteResult.error ?? "Invitation failed" });
        return;
      }
      newAdmin = inviteResult.data as HydratedDocument<IUser>;
    } else {
      newAdmin = await User.create({
        name: primaryContactData.name,
        email: primaryContactData.email,
        password: "ChangeMe123!",
        role: "CLIENT_A",
        isActive: true,
        ...(primaryContactData.cellPhone ? { phone: primaryContactData.cellPhone } : {}),
      });
    }

    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let company;
    try {
      company = await Company.create({
        name,
        legalName,
        rfc: rfc || undefined,
        fiscalAddress,
        slug,
        primaryContact: newAdmin._id,
        logo: req.file ? `/uploads/logos/${req.file.filename}` : null,
      });
    } catch (companyError: any) {
      // Rollback: delete the user we just created to avoid orphans
      await User.findByIdAndDelete(newAdmin._id).catch(() => {});
      throw companyError;
    }

    newAdmin.companyId = company._id as Types.ObjectId;
    await newAdmin.save();

    await logAction(
      (req as any).user._id,
      "CREATE",
      "Company",
      company._id,
      `Created company ${name} and linked admin ${newAdmin.email}`,
      { company, admin: newAdmin.email },
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
export const getCompanyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const company = await Company.findById(req.params.id)
      .populate("primaryContact", "name email role");

    if (!company) {
      res.status(404).json({ success: false, message: "Company not found" });
      return;
    }

    res.status(200).json({ success: true, data: company });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
