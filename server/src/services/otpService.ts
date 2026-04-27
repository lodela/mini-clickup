/**
 * OTP Service — generate, send, verify 6-digit codes.
 * Codes are bcrypt-hashed before storage.
 * Max 3 attempts, 10 min expiry (configurable via env).
 */
import bcrypt from "bcrypt";
import OtpToken, { OtpChannel } from "../models/OtpToken.js";
import { sendOtpEmail } from "./emailService.js";
import { sendOtpWhatsApp } from "./whatsappService.js";

const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES ?? "10", 10);
const OTP_MAX_ATTEMPTS   = parseInt(process.env.OTP_MAX_ATTEMPTS   ?? "3",  10);

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** Generate a new OTP, store it hashed, and send via the chosen channel */
export async function generateAndSend(
  email: string,
  channel: OtpChannel = "email",
  phone?: string
): Promise<void> {
  // Invalidate any previous OTP for this email
  await OtpToken.deleteMany({ email });

  const code     = generateCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await OtpToken.create({ email, codeHash, channel, expiresAt });

  if (channel === "whatsapp" && phone) {
    await sendOtpWhatsApp(phone, code);
  } else {
    await sendOtpEmail(email, code);
  }
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "not_found" | "expired" | "already_verified" | "too_many_attempts" | "invalid_code" };

/** Verify an OTP code for a given email */
export async function verifyOtp(email: string, code: string): Promise<VerifyResult> {
  const record = await OtpToken.findOne({ email }).select("+codeHash");

  if (!record)           return { ok: false, reason: "not_found" };
  if (record.verified)   return { ok: false, reason: "already_verified" };
  if (record.expiresAt < new Date()) return { ok: false, reason: "expired" };
  if (record.attempts >= OTP_MAX_ATTEMPTS) return { ok: false, reason: "too_many_attempts" };

  record.attempts += 1;
  const match = await bcrypt.compare(code, record.codeHash);

  if (!match) {
    await record.save();
    return { ok: false, reason: "invalid_code" };
  }

  record.verified = true;
  await record.save();
  return { ok: true };
}
