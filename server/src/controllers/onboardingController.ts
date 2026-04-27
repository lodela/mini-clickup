/**
 * Onboarding Controller — multi-step registration flow.
 *
 * Flow:
 *  POST /api/auth/otp/send        → sends OTP to email (or WhatsApp)
 *  POST /api/auth/otp/verify      → verifies OTP, returns onboardingToken
 *  PATCH /api/auth/onboarding/step1 → save user profile info
 *  GET  /api/companies/search     → fuzzy search (requires onboardingToken)
 *  POST /api/auth/onboarding/company → create or link company
 *  POST /api/auth/onboarding/invite  → save team invitations
 *  POST /api/auth/register/complete  → finalize registration, issue auth cookies
 */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import * as otpService from "../services/otpService.js";
import * as companyService from "../services/companyService.js";
import * as invitationService from "../services/invitationService.js";
import { sendWelcomeEmail } from "../services/emailService.js";
import * as tokenService from "../services/tokenService.js";
import { OtpChannel } from "../models/OtpToken.js";

const ONBOARDING_TOKEN_EXPIRY = "30m";
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return secret;
};

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("accessToken", accessToken, {
    httpOnly: true, secure: isProduction, sameSite: "lax",
    maxAge: 15 * 60 * 1000, path: "/",
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, secure: isProduction, sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, path: "/",
  });
}

/** Issue a short-lived onboarding JWT (not a session token) */
function issueOnboardingToken(email: string): string {
  return jwt.sign({ email, type: "onboarding" }, getJwtSecret(), {
    expiresIn: ONBOARDING_TOKEN_EXPIRY,
  });
}

/** Verify onboarding JWT and return email */
function verifyOnboardingToken(token: string): { email: string } {
  const payload = jwt.verify(token, getJwtSecret()) as { email: string; type: string };
  if (payload.type !== "onboarding") throw new Error("Invalid token type");
  return { email: payload.email };
}

// ---------------------------------------------------------------------------
// POST /api/auth/otp/send
// ---------------------------------------------------------------------------
export async function sendOtp(
  req: Request<unknown, ApiResponse, { email: string; phone?: string; channel?: OtpChannel }>,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const { email, phone, channel = "email" } = req.body;

    if (!email) {
      res.status(400).json({ success: false, error: "Email is required" });
      return;
    }

    // Don't reveal if user already exists — just send OTP
    await otpService.generateAndSend(email.toLowerCase().trim(), channel, phone);

    res.status(200).json({
      success: true,
      message: `Verification code sent via ${channel}`,
    });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// POST /api/auth/otp/verify
// ---------------------------------------------------------------------------
export async function verifyOtp(
  req: Request<unknown, ApiResponse, { email: string; code: string }>,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({ success: false, error: "Email and code are required" });
      return;
    }

    const result = await otpService.verifyOtp(email.toLowerCase().trim(), code.trim());

    if (!result.ok) {
      const status = result.reason === "too_many_attempts" ? 429 : 400;
      res.status(status).json({ success: false, error: result.reason });
      return;
    }

    const onboardingToken = issueOnboardingToken(email.toLowerCase().trim());

    res.status(200).json({
      success: true,
      data: { onboardingToken },
      message: "Email verified — proceed to step 1",
    });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/auth/onboarding/step1  — About yourself
// ---------------------------------------------------------------------------
export async function step1AboutYou(
  req: Request<unknown, ApiResponse, {
    onboardingToken: string;
    name: string;
    password: string;
    phone?: string;
    jobTitle?: string;
    useCase?: string;
  }>,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const { onboardingToken, name, password, phone, jobTitle, useCase } = req.body;

    const { email } = verifyOnboardingToken(onboardingToken);

    // Create or update pending user
    const emailDomain = companyService.extractDomain(email);

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        password,
        name,
        phone: phone ?? null,
        jobTitle: jobTitle ?? null,
        useCase: useCase ?? null,
        emailDomain,
        emailVerified: true,
        onboardingStep: 1,
        role: "USER_C",
        isActive: false, // not active until registration complete
      });
    } else {
      user.name = name;
      if (password) user.password = password;
      user.phone = phone ?? user.phone;
      user.jobTitle = jobTitle ?? undefined;
      user.useCase = useCase ?? undefined;
      user.emailDomain = emailDomain;
      user.emailVerified = true;
      user.onboardingStep = 1;
      // Reset role to minimum valid value in case of legacy/invalid role
      if (!["GOD_MODE","CLIENT_A","CLIENT_B","CLIENT_C","DIRECTOR","EXECUTIVE","MANAGER","USER_A","USER_B","USER_C"].includes(user.role)) {
        user.role = "USER_C";
      }
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: { onboardingToken }, // pass token forward
      message: "Profile saved — proceed to company",
    });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// POST /api/auth/onboarding/company  — Tell about your company
// ---------------------------------------------------------------------------
export async function onboardingCompany(
  req: Request<unknown, ApiResponse, {
    onboardingToken: string;
    companyId?: string;        // if user selected an existing company
    name?: string;
    website?: string;
    teamSize?: string;
    socials?: Record<string, string>;
  }>,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const { onboardingToken, companyId, name, website, teamSize, socials } = req.body;
    const { email } = verifyOnboardingToken(onboardingToken);

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, error: "User not found — complete step 1 first" });
      return;
    }

    const emailDomain = companyService.extractDomain(email);

    if (companyId) {
      // Link to existing company
      await companyService.linkUserToCompany(user._id as unknown as string, companyId);
      user.companyId = new (await import("mongoose")).default.Types.ObjectId(companyId);
    } else {
      // Create new company
      if (!name) {
        res.status(400).json({ success: false, error: "Company name is required" });
        return;
      }
      const company = await companyService.createCompany({
        name,
        website,
        teamSize,
        socials,
        emailDomain,
        founderId: user._id as unknown as string,
      });
      user.companyId = company._id as any;
    }

    user.onboardingStep = 2;
    await user.save();

    res.status(200).json({
      success: true,
      data: { onboardingToken },
      message: "Company saved — proceed to invite",
    });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// POST /api/auth/onboarding/invite  — Invite team members
// ---------------------------------------------------------------------------
export async function onboardingInvite(
  req: Request<unknown, ApiResponse, { onboardingToken: string; emails: string[] }>,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const { onboardingToken, emails } = req.body;
    const { email } = verifyOnboardingToken(onboardingToken);

    const user = await User.findOne({ email }).populate("companyId");
    if (!user || !user.companyId) {
      res.status(400).json({ success: false, error: "Complete the company step first" });
      return;
    }

    const isGodMode = user.role === "GOD_MODE";
    const company = user.companyId as any;

    const results = await invitationService.createBulkInvitations({
      emails: emails ?? [],
      companyId: String(company._id ?? company),
      invitedBy: String(user._id),
      inviterName: user.name,
      companyName: company.name ?? "your company",
      isGodMode,
    });

    user.onboardingStep = 3;
    await user.save();

    res.status(200).json({
      success: true,
      data: { invitations: results, onboardingToken },
      message: "Invitations queued",
    });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// POST /api/auth/register/complete  — Finalize registration
// ---------------------------------------------------------------------------
export async function registerComplete(
  req: Request<unknown, ApiResponse, { onboardingToken: string }>,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const { onboardingToken } = req.body;
    const { email } = verifyOnboardingToken(onboardingToken);

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    user.isActive = true;
    user.onboardingStep = 4;
    user.lastLogin = new Date();
    await user.save();

    // Issue auth tokens
    const accessToken = tokenService.generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = tokenService.generateRefreshToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    setAuthCookies(res, accessToken, refreshToken);

    // Fire-and-forget welcome email
    sendWelcomeEmail(user.email, user.name).catch((err) =>
      console.error("[Welcome email failed]", err.message)
    );

    res.status(201).json({
      success: true,
      data: { user: user.toJSON() },
      message: "Registration complete — welcome!",
    });
  } catch (err) {
    next(err);
  }
}
