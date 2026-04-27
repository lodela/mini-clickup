import { useState, useEffect, useRef, CSSProperties } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  ChevronDown,
  Mail,
  MessageCircle,
} from "lucide-react";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Separator from "@radix-ui/react-separator";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { ApiRequestError } from "@/services/api";
import { sendOtp, verifyOtp, type OtpChannel } from "@/services/otp";
import { searchCompanies, type CompanySearchResult } from "@/services/companies";
import {
  saveStep1,
  saveCompany,
  sendInvites,
  completeRegistration,
} from "@/services/onboarding";
import { OtpInput } from "@/components/ui/OtpInput";
import { FuzzyCompanyModal } from "@/components/ui/FuzzyCompanyModal";
import { SocialLinksInput } from "@/components/ui/SocialLinksInput";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  // Step 0 — OTP
  email: string;
  password: string;
  phone: string;
  phoneCode: string;
  workPhone: string;
  workPhoneCode: string;
  otpCode: string;
  otpChannel: OtpChannel;
  // Step 1 — About yourself
  fullName: string;
  useCase: string;
  role: string;
  receiveUpdates: boolean;
  // Step 2 — Company
  companyName: string;
  companyWebsite: string;
  businessDirection: string;
  teamSize: string;
  socials: Record<string, string>;
  // Step 3 — Invite
  teamEmailLocals: string[];
}

const STEPS = [
  "Validate your email",
  "Tell about yourself",
  "Tell about your company",
  "Invite Team Members",
];

const USE_CASES = ["Work", "Personal", "Education", "Other"];
const ROLES = [
  "Business Owner",
  "Product Manager",
  "Developer",
  "Designer",
  "Other",
];
const DIRECTIONS = [
  "IT and programming",
  "Marketing",
  "Sales",
  "Design",
  "Finance",
  "Other",
];
const TEAM_SIZES = [
  "Only me",
  "2 - 5",
  "6 - 10",
  "11-20",
  "21 - 40",
  "41 - 50",
  "51 - 100",
  "101 - 500",
];

// ─── Style constants ───────────────────────────────────────────────────────────
const labelStyle: CSSProperties = {
  display: "block",
  fontSize: 14,
  fontWeight: 600,
  color: "#0A1628",
  marginBottom: 8,
};
const inputStyle: CSSProperties = {
  height: 56,
  border: "1px solid #D9E0E6",
  borderRadius: 14,
  padding: "0 16px",
  fontSize: 15,
  color: "#0A1628",
  background: "#fff",
  boxSizing: "border-box",
};
const eyeBtnStyle: CSSProperties = {
  position: "absolute",
  right: 14,
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#7D8592",
  padding: 0,
  display: "flex",
  alignItems: "center",
};
const errorStyle: CSSProperties = {
  color: "#EF4444",
  fontSize: 12,
  marginTop: 4,
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ currentStep }: { currentStep: number }) {
  return (
    <div
      style={{
        width: 200,
        flexShrink: 0,
        background: "#3F8CFF",
        display: "flex",
        flexDirection: "column",
        padding: "40px 28px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -40,
          left: -40,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }}
      />
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 40,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
            <rect x="4" y="4" width="8" height="8" rx="2" fill="#3F8CFF" />
            <rect
              x="16"
              y="4"
              width="8"
              height="8"
              rx="2"
              fill="#3F8CFF"
              opacity="0.6"
            />
            <rect
              x="4"
              y="16"
              width="8"
              height="8"
              rx="2"
              fill="#3F8CFF"
              opacity="0.6"
            />
            <rect
              x="16"
              y="16"
              width="8"
              height="8"
              rx="2"
              fill="#3F8CFF"
              opacity="0.3"
            />
          </svg>
        </div>
      </div>
      <p
        style={{
          color: "#fff",
          fontWeight: 700,
          fontSize: 22,
          lineHeight: "30px",
          marginBottom: 32,
          position: "relative",
          zIndex: 1,
        }}
      >
        Get started
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        {STEPS.map((s, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={i} style={{ display: "flex", gap: 10 }}>
              {/* Circle + vertical connector */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: done ? "#fff" : "transparent",
                    border: done
                      ? "none"
                      : active
                        ? "2px solid #fff"
                        : "2px solid rgba(255,255,255,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {done ? (
                    <Check size={13} color="#3F8CFF" strokeWidth={3} />
                  ) : active ? (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#fff",
                      }}
                    />
                  ) : null}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      height: 22,
                      background: done
                        ? "rgba(255,255,255,0.6)"
                        : "rgba(255,255,255,0.2)",
                      margin: "4px 0",
                    }}
                  />
                )}
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: active ? 700 : 400,
                  color: active
                    ? "#fff"
                    : done
                      ? "#fff"
                      : "rgba(255,255,255,0.55)",
                  paddingTop: 3,
                }}
              >
                {s}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
/**
 * Register Page — 4-step onboarding flow
 * Step 0: Email OTP verification
 * Step 1: Personal info
 * Step 2: Company (fuzzy search + fuzzy modal)
 * Step 3: Invite team members (corporate domain only)
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // OTP flow state
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [onboardingToken, setOnboardingToken] = useState("");

  // Company search state
  const [companyResults, setCompanyResults] = useState<CompanySearchResult[]>([]);
  const [showFuzzyModal, setShowFuzzyModal] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>();
  const companyDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
    phone: "",
    phoneCode: "+52",
    workPhone: "",
    workPhoneCode: "+52",
    otpCode: "",
    otpChannel: "email",
    fullName: "",
    useCase: "Work",
    role: "Business Owner",
    receiveUpdates: true,
    companyName: "",
    companyWebsite: "",
    businessDirection: "IT and programming",
    teamSize: "",
    socials: {},
    teamEmailLocals: [""],
  });

  const set = (field: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const emailDomain = form.email.includes("@") ? form.email.split("@")[1] : "";

  // Debounced company fuzzy search
  useEffect(() => {
    if (step !== 2) return;
    const q = form.companyName.trim();
    if (q.length < 2) { setCompanyResults([]); return; }
    if (companyDebounceRef.current) clearTimeout(companyDebounceRef.current);
    companyDebounceRef.current = setTimeout(async () => {
      try {
        const results = await searchCompanies(q, emailDomain);
        setCompanyResults(results);
        if (results.length > 0) setShowFuzzyModal(true);
      } catch { /* silent */ }
    }, 400);
    return () => { if (companyDebounceRef.current) clearTimeout(companyDebounceRef.current); };
  }, [form.companyName, step]);

  const validateStep = (): boolean => {
    const errs: Record<string, string> = {};
    if (step === 0) {
      if (!form.email) errs.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
      if (!form.password) errs.password = "Password is required";
      else if (form.password.length < 8) errs.password = "Min 8 characters";
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password))
        errs.password = "Must include uppercase, lowercase and a number";
      if (!form.phone.trim()) errs.phone = "Número móvil requerido";
      if (otpSent && !otpVerified && form.otpCode.length !== 6)
        errs.otpCode = "Enter the 6-digit code";
    }
    if (step === 1) {
      if (!form.fullName.trim()) errs.fullName = "Full name is required";
    }
    if (step === 2) {
      if (!form.companyName.trim()) errs.companyName = "Company name is required";
      if (!form.teamSize) errs.teamSize = "Select team size";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = async () => {
    setServerError("");

    // Step 0 — OTP flow
    if (step === 0) {
      if (!validateStep()) return;
      setSubmitting(true);
      try {
        if (!otpSent) {
          // First click → send OTP
          await sendOtp(form.email, form.otpChannel,
            form.phone ? `${form.phoneCode}${form.phone}` : undefined);
          setOtpSent(true);
        } else if (!otpVerified) {
          // Second click → verify OTP
          const result = await verifyOtp(form.email, form.otpCode);
          setOnboardingToken(result.onboardingToken);
          setOtpVerified(true);
          setStep(1);
        }
      } catch (err) {
        setServerError(err instanceof ApiRequestError
          ? (err.data?.message ?? "Error") : "Error sending OTP");
      } finally { setSubmitting(false); }
      return;
    }

    if (!validateStep()) return;
    setSubmitting(true);

    try {
      if (step === 1) {
        const res = await saveStep1({
          onboardingToken,
          name: form.fullName,
          password: form.password,
          phone: form.phone ? `${form.phoneCode}${form.phone}` : undefined,
          workPhone: form.workPhone ? `${form.workPhoneCode}${form.workPhone}` : undefined,
          jobTitle: form.role,
          useCase: form.useCase,
        });
        setOnboardingToken(res.onboardingToken);
        setStep(2);
      } else if (step === 2) {
        const res = await saveCompany({
          onboardingToken,
          companyId: selectedCompanyId,
          name: form.companyName,
          website: form.companyWebsite,
          teamSize: form.teamSize,
          socials: form.socials,
        });
        setOnboardingToken(res.onboardingToken);
        setStep(3);
      } else if (step === 3) {
        const emails = form.teamEmailLocals
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => `${l}@${emailDomain}`);
        if (emails.length > 0) {
          await sendInvites({ onboardingToken, emails });
        }
        await completeRegistration(onboardingToken);
        navigate("/login?registered=1");
      }
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setServerError(err.data?.message ?? "An error occurred");
      } else {
        setServerError("An error occurred");
      }
    } finally { setSubmitting(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap');
        .reg-root * { font-family: 'Nunito Sans', system-ui, -apple-system, sans-serif; }
        .reg-input { transition: border-color 0.15s, box-shadow 0.15s; }
        .reg-input:focus { outline: none; border-color: #3F8CFF !important; box-shadow: 0 0 0 2px #fff, 0 0 0 4px #3F8CFF; }
        [data-radix-select-trigger] { appearance: none; text-align: left; }
        [data-radix-select-content] { z-index: 9999; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.12); padding: 4px 0; min-width: var(--radix-select-trigger-width); }
        [data-radix-select-item] { padding: 10px 16px; font-size: 14px; color: #0A1628; cursor: pointer; display: flex; align-items: center; justify-content: space-between; outline: none; }
        [data-radix-select-item]:hover, [data-radix-select-item][data-highlighted] { background: #EBF4FF; }
        [data-radix-radio-item] { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #D9E0E6; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; outline: none; flex-shrink: 0; }
        [data-radix-radio-item][data-state=checked] { border-color: #3F8CFF; }
        [data-radix-radio-item]:focus-visible { box-shadow: 0 0 0 2px #fff, 0 0 0 4px #3F8CFF; }
        .reg-btn:hover:not(:disabled) { opacity: 0.9; }
        .tag-btn { transition: background 0.15s, border-color 0.15s, color 0.15s; cursor: pointer; }
      `}</style>

      <div
        className="reg-root"
        style={{
          position: "fixed",
          inset: 0,
          background: "#F4F9FE",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid #E8EDF2",
            padding: "12px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 14, color: "#7D8592" }}>
            Sign up - step {step + 1}
          </span>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#3F8CFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
              <rect
                x="4"
                y="4"
                width="8"
                height="8"
                rx="2"
                fill="#fff"
                opacity="0.6"
              />
              <rect
                x="16"
                y="4"
                width="8"
                height="8"
                rx="2"
                fill="#fff"
                opacity="0.6"
              />
              <rect
                x="4"
                y="16"
                width="8"
                height="8"
                rx="2"
                fill="#fff"
                opacity="0.6"
              />
              <rect
                x="16"
                y="16"
                width="8"
                height="8"
                rx="2"
                fill="#fff"
                opacity="0.3"
              />
            </svg>
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px",
            overflow: "auto",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 860,
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 4px 40px rgba(0,0,0,0.07)",
              display: "flex",
              overflow: "hidden",
              minHeight: 540,
            }}
          >
            <Sidebar currentStep={step} />

            {/* Form panel */}
            <div
              style={{
                flex: 1,
                padding: "48px 56px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#3F8CFF",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: 6,
                }}
              >
                STEP {step + 1}/{STEPS.length}
              </p>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#0A1628",
                  margin: "0 0 28px",
                }}
              >
                {STEPS[step]}
              </h2>

              {serverError && (
                <div
                  style={{
                    background: "#FEE2E2",
                    border: "1px solid #FECACA",
                    borderRadius: 10,
                    padding: "10px 14px",
                    color: "#DC2626",
                    fontSize: 14,
                    marginBottom: 20,
                  }}
                >
                  {serverError}
                </div>
              )}

              {/* ── STEP 0: Validate your email ── */}
              {step === 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Email */}
                  <div>
                    <Label.Root htmlFor="reg-email" style={labelStyle}>
                      Email Address
                    </Label.Root>
                    <input
                      id="reg-email"
                      type="email"
                      placeholder="you@yourcompany.com"
                      value={form.email}
                      onChange={(e) => { set("email", e.target.value); setOtpSent(false); setOtpVerified(false); }}
                      disabled={otpSent}
                      className="reg-input"
                      style={{
                        ...inputStyle,
                        width: "100%",
                        borderColor: fieldErrors.email ? "#EF4444" : "#D9E0E6",
                        opacity: otpSent ? 0.7 : 1,
                      }}
                    />
                    {fieldErrors.email && <p style={errorStyle}>{fieldErrors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <Label.Root htmlFor="reg-password" style={labelStyle}>
                      Create Password
                    </Label.Root>
                    <div style={{ position: "relative" }}>
                      <input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => set("password", e.target.value)}
                        className="reg-input"
                        style={{
                          ...inputStyle,
                          width: "100%",
                          paddingRight: 44,
                          borderColor: fieldErrors.password ? "#EF4444" : "#D9E0E6",
                        }}
                      />
                      <button type="button" onClick={() => setShowPassword((p) => !p)} style={eyeBtnStyle}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {fieldErrors.password && <p style={errorStyle}>{fieldErrors.password}</p>}
                  </div>

                  {/* Mobile — required */}
                  <div>
                    <Label.Root style={labelStyle}>
                      Número Móvil
                    </Label.Root>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Select.Root value={form.phoneCode} onValueChange={(v) => set("phoneCode", v)}>
                        <Select.Trigger data-radix-select-trigger className="reg-input"
                          style={{ ...inputStyle, width: 80, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4, paddingRight: 8 }}>
                          <Select.Value />
                          <Select.Icon><ChevronDown size={14} color="#7D8592" /></Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content data-radix-select-content position="popper" sideOffset={4}>
                            <Select.Viewport>
                              {["+52", "+1", "+44", "+34", "+49", "+33"].map((c) => (
                                <Select.Item key={c} value={c} data-radix-select-item>
                                  <Select.ItemText>{c}</Select.ItemText>
                                  <Select.ItemIndicator><Check size={12} color="#3F8CFF" /></Select.ItemIndicator>
                                </Select.Item>
                              ))}
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                      <input type="tel" placeholder="55 1234 5678" value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        className="reg-input"
                        style={{ ...inputStyle, flex: 1, borderColor: fieldErrors.phone ? "#EF4444" : "#D9E0E6" }} />
                    </div>
                    {fieldErrors.phone && <p style={errorStyle}>{fieldErrors.phone}</p>}
                  </div>

                  {/* Línea de Oficina */}
                  <div>
                    <Label.Root style={{ ...labelStyle, display: "flex", justifyContent: "space-between" }}>
                      <span>Línea de Oficina</span>
                      <span style={{ fontSize: 12, color: "#7D8592", fontWeight: 400 }}>Teléfono fijo corporativo</span>
                    </Label.Root>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Select.Root value={form.workPhoneCode} onValueChange={(v) => set("workPhoneCode", v)}>
                        <Select.Trigger data-radix-select-trigger className="reg-input"
                          style={{ ...inputStyle, width: 80, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4, paddingRight: 8 }}>
                          <Select.Value />
                          <Select.Icon><ChevronDown size={14} color="#7D8592" /></Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content data-radix-select-content position="popper" sideOffset={4}>
                            <Select.Viewport>
                              {["+52", "+1", "+44", "+34", "+49", "+33"].map((c) => (
                                <Select.Item key={c} value={c} data-radix-select-item>
                                  <Select.ItemText>{c}</Select.ItemText>
                                  <Select.ItemIndicator><Check size={12} color="#3F8CFF" /></Select.ItemIndicator>
                                </Select.Item>
                              ))}
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                      <input type="tel" placeholder="81 8000 0000 ext. 123" value={form.workPhone}
                        onChange={(e) => set("workPhone", e.target.value)}
                        className="reg-input" style={{ ...inputStyle, flex: 1 }} />
                    </div>
                  </div>

                  {/* OTP channel toggle — Radix ToggleGroup */}
                  {!otpSent && (
                    <div>
                      <Label.Root style={{ ...labelStyle, marginBottom: 8, display: "block" }}>
                        Enviar código de verificación:
                      </Label.Root>
                      <ToggleGroup.Root
                        type="single"
                        value={form.otpChannel}
                        onValueChange={(v) => v && set("otpChannel", v as OtpChannel)}
                        style={{
                          display: "flex",
                          background: "#F0F4F8",
                          borderRadius: 12,
                          padding: 4,
                          gap: 4,
                        }}
                      >
                        <ToggleGroup.Item
                          value="email"
                          style={{
                            flex: 1,
                            padding: "10px 0",
                            borderRadius: 9,
                            border: "none",
                            background: form.otpChannel === "email" ? "#3F8CFF" : "transparent",
                            color: form.otpChannel === "email" ? "#fff" : "#7D8592",
                            fontSize: 14,
                            fontWeight: form.otpChannel === "email" ? 700 : 500,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <Mail size={15} />
                          Email
                        </ToggleGroup.Item>
                        <ToggleGroup.Item
                          value="whatsapp"
                          style={{
                            flex: 1,
                            padding: "10px 0",
                            borderRadius: 9,
                            border: "none",
                            background: form.otpChannel === "whatsapp" ? "#25D366" : "transparent",
                            color: form.otpChannel === "whatsapp" ? "#fff" : "#7D8592",
                            fontSize: 14,
                            fontWeight: form.otpChannel === "whatsapp" ? 700 : 500,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <MessageCircle size={15} />
                          WhatsApp
                        </ToggleGroup.Item>
                      </ToggleGroup.Root>
                    </div>
                  )}

                  {/* OTP input (shown after send) */}
                  {otpSent && !otpVerified && (
                    <div>
                      <Label.Root style={labelStyle}>
                        Enter the 6-digit code
                        <span style={{ fontWeight: 400, color: "#7D8592", marginLeft: 8 }}>
                          sent to {form.otpChannel === "whatsapp" ? `${form.phoneCode}${form.phone}` : form.email}
                        </span>
                      </Label.Root>
                      <OtpInput value={form.otpCode} onChange={(v) => set("otpCode", v)} />
                      {fieldErrors.otpCode && <p style={{ ...errorStyle, textAlign: "center", marginTop: 8 }}>{fieldErrors.otpCode}</p>}
                      <p style={{ fontSize: 13, color: "#7D8592", textAlign: "center", marginTop: 12 }}>
                        Didn't receive it?{" "}
                        <button type="button"
                          onClick={async () => { try { await sendOtp(form.email, form.otpChannel, form.phone ? `${form.phoneCode}${form.phone}` : undefined); } catch (_err) { /* silent retry */ } }}
                          style={{ background: "none", border: "none", color: "#3F8CFF", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
                          Resend code
                        </button>
                      </p>
                    </div>
                  )}

                  {otpVerified && (
                    <div style={{ background: "#ECFDF5", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                      <Check size={18} color="#10B981" />
                      <span style={{ fontSize: 14, color: "#059669" }}>Email verified successfully</span>
                    </div>
                  )}
                </div>
              )}

              {/* ── STEP 1: Tell about yourself ── */}
              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  <div>
                    <Label.Root htmlFor="fullName" style={labelStyle}>Full Name</Label.Root>
                    <input id="fullName" type="text" placeholder="Norberto Lodela"
                      value={form.fullName} onChange={(e) => set("fullName", e.target.value)}
                      className="reg-input"
                      style={{ ...inputStyle, width: "100%", borderColor: fieldErrors.fullName ? "#EF4444" : "#D9E0E6" }} />
                    {fieldErrors.fullName && <p style={errorStyle}>{fieldErrors.fullName}</p>}
                  </div>
                  <div>
                    <Label.Root htmlFor="useCase" style={labelStyle}>
                      Why will you use the service?
                    </Label.Root>
                    <Select.Root
                      value={form.useCase}
                      onValueChange={(v) => set("useCase", v)}
                    >
                      <Select.Trigger
                        id="useCase"
                        data-radix-select-trigger
                        className="reg-input"
                        style={{
                          ...inputStyle,
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Select.Value />
                        <Select.Icon>
                          <ChevronDown size={16} color="#7D8592" />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content
                          data-radix-select-content
                          position="popper"
                          sideOffset={4}
                        >
                          <Select.Viewport>
                            {USE_CASES.map((o) => (
                              <Select.Item
                                key={o}
                                value={o}
                                data-radix-select-item
                              >
                                <Select.ItemText>{o}</Select.ItemText>
                                <Select.ItemIndicator>
                                  <Check size={14} color="#3F8CFF" />
                                </Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>
                  <div>
                    <Label.Root htmlFor="role" style={labelStyle}>
                      What describes you best?
                    </Label.Root>
                    <Select.Root
                      value={form.role}
                      onValueChange={(v) => set("role", v)}
                    >
                      <Select.Trigger
                        id="role"
                        data-radix-select-trigger
                        className="reg-input"
                        style={{
                          ...inputStyle,
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Select.Value />
                        <Select.Icon>
                          <ChevronDown size={16} color="#7D8592" />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content
                          data-radix-select-content
                          position="popper"
                          sideOffset={4}
                        >
                          <Select.Viewport>
                            {ROLES.map((o) => (
                              <Select.Item
                                key={o}
                                value={o}
                                data-radix-select-item
                              >
                                <Select.ItemText>{o}</Select.ItemText>
                                <Select.ItemIndicator>
                                  <Check size={14} color="#3F8CFF" />
                                </Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>
                  <div>
                    <Label.Root style={labelStyle}>
                      Receive product updates?
                    </Label.Root>
                    <RadioGroup.Root
                      value={form.receiveUpdates ? "Yes" : "No"}
                      onValueChange={(v) => set("receiveUpdates", v === "Yes")}
                      style={{ display: "flex", gap: 24 }}
                    >
                      {["Yes", "No"].map((opt) => (
                        <Label.Root
                          key={opt}
                          htmlFor={`rg-${opt}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            cursor: "pointer",
                            fontSize: 15,
                            color: "#0A1628",
                            fontWeight: 400,
                          }}
                        >
                          <RadioGroup.Item
                            id={`rg-${opt}`}
                            value={opt}
                            data-radix-radio-item
                          >
                            <RadioGroup.Indicator
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                height: "100%",
                              }}
                            >
                              <div
                                style={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: "50%",
                                  background: "#3F8CFF",
                                }}
                              />
                            </RadioGroup.Indicator>
                          </RadioGroup.Item>
                          {opt}
                        </Label.Root>
                      ))}
                    </RadioGroup.Root>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Tell about your company ── */}
              {step === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  {/* Fuzzy modal */}
                  <FuzzyCompanyModal
                    open={showFuzzyModal}
                    results={companyResults}
                    onSelect={(c) => {
                      setSelectedCompanyId(c._id);
                      set("companyName", c.name);
                      setShowFuzzyModal(false);
                      setCompanyResults([]);
                    }}
                    onCreateNew={() => { setSelectedCompanyId(undefined); setShowFuzzyModal(false); }}
                    onClose={() => setShowFuzzyModal(false)}
                  />

                  <div>
                    <Label.Root htmlFor="companyName" style={labelStyle}>
                      Your Company's Name
                    </Label.Root>
                    <input
                      id="companyName"
                      type="text"
                      placeholder="Company's Name"
                      value={form.companyName}
                      onChange={(e) => { set("companyName", e.target.value); setSelectedCompanyId(undefined); }}
                      className="reg-input"
                      style={{ ...inputStyle, width: "100%", borderColor: fieldErrors.companyName ? "#EF4444" : "#D9E0E6" }}
                    />
                    {selectedCompanyId && (
                      <p style={{ fontSize: 12, color: "#059669", marginTop: 4 }}>
                        ✓ Linked to existing company
                      </p>
                    )}
                    {fieldErrors.companyName && <p style={errorStyle}>{fieldErrors.companyName}</p>}
                  </div>

                  {/* Website */}
                  <div>
                    <Label.Root htmlFor="companyWebsite" style={labelStyle}>Website (optional)</Label.Root>
                    <input id="companyWebsite" type="url" placeholder="https://yourcompany.com"
                      value={form.companyWebsite} onChange={(e) => set("companyWebsite", e.target.value)}
                      className="reg-input" style={{ ...inputStyle, width: "100%" }} />
                  </div>

                  <div>
                    <Label.Root htmlFor="bizDir" style={labelStyle}>Business Direction</Label.Root>
                    <Select.Root value={form.businessDirection} onValueChange={(v) => set("businessDirection", v)}>
                      <Select.Trigger id="bizDir" data-radix-select-trigger className="reg-input"
                        style={{ ...inputStyle, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Select.Value />
                        <Select.Icon><ChevronDown size={16} color="#7D8592" /></Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content data-radix-select-content position="popper" sideOffset={4}>
                          <Select.Viewport>
                            {DIRECTIONS.map((o) => (
                              <Select.Item key={o} value={o} data-radix-select-item>
                                <Select.ItemText>{o}</Select.ItemText>
                                <Select.ItemIndicator><Check size={14} color="#3F8CFF" /></Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>

                  <div>
                    <Label.Root style={labelStyle}>How many people in your team?</Label.Root>
                    {fieldErrors.teamSize && <p style={{ ...errorStyle, marginBottom: 6 }}>{fieldErrors.teamSize}</p>}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {TEAM_SIZES.map((size) => {
                        const active = form.teamSize === size;
                        return (
                          <button key={size} type="button" className="tag-btn" onClick={() => set("teamSize", size)}
                            style={{
                              padding: "8px 16px", borderRadius: 10,
                              border: `1px solid ${active ? "#3F8CFF" : "#D9E0E6"}`,
                              background: active ? "#3F8CFF" : "#fff",
                              color: active ? "#fff" : "#0A1628",
                              fontSize: 14, fontWeight: active ? 700 : 400,
                            }}>
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Social networks (collapsible) */}
                  <details>
                    <summary style={{ cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#3F8CFF", listStyle: "none", marginBottom: 12 }}>
                      + Add social networks (optional)
                    </summary>
                    <SocialLinksInput value={form.socials} onChange={(v) => set("socials", v)} />
                  </details>
                </div>
              )}

              {/* ── STEP 3: Invite Team Members ── */}
              {step === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {emailDomain && (
                    <div style={{ background: "#EBF4FF", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#3F8CFF" }}>
                      Invitations will use your corporate domain:{" "}
                      <strong>@{emailDomain}</strong>
                      <br />
                      <span style={{ color: "#7D8592", fontSize: 12 }}>
                        Free email providers (Gmail, Hotmail, etc.) are not allowed.
                      </span>
                    </div>
                  )}
                  {form.teamEmailLocals.map((local, i) => (
                    <div key={i}>
                      {i === 0 && <Label.Root style={labelStyle}>Member's Email</Label.Root>}
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input
                          type="text"
                          placeholder="username"
                          value={local}
                          onChange={(e) => {
                            const locals = [...form.teamEmailLocals];
                            locals[i] = e.target.value.replace(/@.*/g, ""); // strip domain if pasted
                            set("teamEmailLocals", locals);
                          }}
                          className="reg-input"
                          style={{ ...inputStyle, flex: 1 }}
                        />
                        {/* Non-editable domain badge */}
                        <span style={{
                          background: "#F0F4F8", border: "1px solid #D9E0E6",
                          borderRadius: 10, padding: "0 14px", height: 56,
                          display: "flex", alignItems: "center", fontSize: 15,
                          color: "#7D8592", flexShrink: 0, whiteSpace: "nowrap",
                        }}>
                          @{emailDomain || "domain.com"}
                        </span>
                        {form.teamEmailLocals.length > 1 && (
                          <button type="button"
                            onClick={() => set("teamEmailLocals", form.teamEmailLocals.filter((_, idx) => idx !== i))}
                            style={{
                              background: "none", border: "1px solid #EF4444",
                              borderRadius: 10, color: "#EF4444", width: 48, height: 56,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: "pointer", flexShrink: 0,
                            }}>
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button type="button"
                    onClick={() => set("teamEmailLocals", [...form.teamEmailLocals, ""])}
                    style={{
                      background: "none", border: "none", color: "#3F8CFF",
                      fontSize: 14, fontWeight: 700, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 6, padding: "4px 0",
                    }}>
                    <Plus size={16} /> Add another Member
                  </button>
                  <p style={{ fontSize: 13, color: "#7D8592", marginTop: 4 }}>
                    You can skip this step and invite later from the admin panel.
                  </p>
                </div>
              )}

              <div style={{ flex: 1 }} />

              {/* Navigation */}
              <Separator.Root
                style={{
                  height: 1,
                  background: "#F0F4F8",
                  margin: "32px 0 20px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: step > 0 ? "space-between" : "flex-end",
                }}
              >
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#7D8592",
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <ArrowLeft size={16} /> Previous
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={submitting}
                  className="reg-btn"
                  style={{
                    height: 48,
                    padding: "0 28px",
                    borderRadius: 14,
                    background: submitting ? "#8AB8FF" : "#3F8CFF",
                    border: "none",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: submitting ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0px 4px 12px rgba(63,140,255,0.3)",
                  }}
                >
                  {submitting
                    ? (step === 0 && !otpSent ? "Sending..." : step === 0 ? "Verifying..." : "Saving...")
                    : step === 0 && !otpSent ? "Send Code"
                    : step === 0 && !otpVerified ? "Verify & Continue"
                    : step === STEPS.length - 1 ? "Finish"
                    : "Next Step"}
                  {!submitting && <ArrowRight size={16} strokeWidth={2.5} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            padding: "12px 0 20px",
            fontSize: 14,
            color: "#7D8592",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#3F8CFF",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </>
  );
}
