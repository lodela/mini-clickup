import { api } from "./api.js";

export type OtpChannel = "email" | "whatsapp";

export async function sendOtp(
  email: string,
  channel: OtpChannel = "email",
  phone?: string
): Promise<void> {
  await api.post("/auth/otp/send", { email, channel, phone });
}

export interface VerifyOtpResult {
  onboardingToken: string;
}

export async function verifyOtp(email: string, code: string): Promise<VerifyOtpResult> {
  const res = await api.post<{ data: VerifyOtpResult }>("/auth/otp/verify", { email, code });
  return (res as any).data;
}
