import { api } from "./api.js";

export interface Step1Data {
  onboardingToken: string;
  name: string;
  password: string;
  phone?: string;
  workPhone?: string;
  jobTitle?: string;
  useCase?: string;
}

export interface CompanyData {
  onboardingToken: string;
  companyId?: string;
  name?: string;
  website?: string;
  teamSize?: string;
  socials?: Record<string, string>;
}

export interface InviteData {
  onboardingToken: string;
  emails: string[];
}

export interface InviteResult {
  email: string;
  status: "queued" | "skipped";
  reason?: string;
}

export async function saveStep1(data: Step1Data): Promise<{ onboardingToken: string }> {
  const res = await api.patch<{ data: { onboardingToken: string } }>("/auth/onboarding/step1", data);
  return (res as any).data;
}

export async function saveCompany(data: CompanyData): Promise<{ onboardingToken: string }> {
  const res = await api.post<{ data: { onboardingToken: string } }>("/auth/onboarding/company", data);
  return (res as any).data;
}

export async function sendInvites(data: InviteData): Promise<InviteResult[]> {
  const res = await api.post<{ data: { invitations: InviteResult[] } }>("/auth/onboarding/invite", data);
  return (res as any).data?.invitations ?? [];
}

export async function completeRegistration(onboardingToken: string): Promise<void> {
  await api.post("/auth/register/complete", { onboardingToken });
}
