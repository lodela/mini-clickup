/**
 * Invitation Service — create bulk invitations, validate corporate emails.
 */
import crypto from "crypto";
import Invitation from "../models/Invitation.js";
import { sendInvitationEmail } from "./emailService.js";
import mongoose from "mongoose";

/** Free/personal email provider domains — blocked for invitations */
const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com",
  "hotmail.com", "hotmail.es", "hotmail.co.uk",
  "outlook.com", "outlook.es",
  "yahoo.com", "yahoo.es", "yahoo.co.uk",
  "live.com", "live.com.mx",
  "icloud.com", "me.com", "mac.com",
  "proton.me", "protonmail.com",
  "aol.com",
  "msn.com",
  "yandex.com", "yandex.ru",
]);

export function isFreeEmailDomain(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return FREE_EMAIL_DOMAINS.has(domain);
}

/**
 * Validate that an email is suitable for a corporate invitation.
 * GOD_MODE users bypass the restriction.
 */
export function validateCorporateEmail(
  email: string,
  isGodMode: boolean
): { valid: boolean; reason?: string } {
  if (isGodMode) return { valid: true };
  if (isFreeEmailDomain(email)) {
    return { valid: false, reason: `Personal email domains are not allowed (${email.split("@")[1]})` };
  }
  return { valid: true };
}

export interface BulkInviteParams {
  emails: string[];
  companyId: string | mongoose.Types.ObjectId;
  invitedBy: string | mongoose.Types.ObjectId;
  inviterName: string;
  companyName: string;
  isGodMode?: boolean;
}

export interface InviteResult {
  email: string;
  status: "queued" | "skipped";
  reason?: string;
}

/**
 * Create invitation documents for a list of emails.
 * Emails are saved with status "pending"; admin confirms sending later.
 * Invalid emails are skipped and returned with a reason.
 */
export async function createBulkInvitations(
  params: BulkInviteParams
): Promise<InviteResult[]> {
  const { emails, companyId, invitedBy, inviterName, companyName, isGodMode = false } = params;
  const results: InviteResult[] = [];
  const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:5173";
  const EXPIRY_DAYS = 7;

  for (const rawEmail of emails) {
    const email = rawEmail.toLowerCase().trim();
    if (!email) continue;

    const validation = validateCorporateEmail(email, isGodMode);
    if (!validation.valid) {
      results.push({ email, status: "skipped", reason: validation.reason });
      continue;
    }

    // Skip if invitation already exists for this email+company
    const exists = await Invitation.findOne({ email, companyId, status: "pending" });
    if (exists) {
      results.push({ email, status: "skipped", reason: "Invitation already sent" });
      continue;
    }

    const token = crypto.randomBytes(32).toString("hex");
    const emailDomain = email.split("@")[1] ?? "";
    const expiresAt = new Date(Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    await Invitation.create({ companyId, invitedBy, email, emailDomain, token, expiresAt });

    // Send email immediately (admin can also batch-send later via admin panel)
    const inviteUrl = `${CLIENT_URL}/invite?token=${token}`;
    await sendInvitationEmail(email, inviterName, companyName, inviteUrl).catch((err) => {
      console.error(`[Invitation] Email failed for ${email}:`, err.message);
    });

    results.push({ email, status: "queued" });
  }

  return results;
}
