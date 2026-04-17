import { useState, CSSProperties } from "react";
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
} from "lucide-react";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Separator from "@radix-ui/react-separator";
import { api, ApiRequestError } from "@/services/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  // Step 1
  phone: string;
  phoneCode: string;
  smsCode: string[];
  email: string;
  password: string;
  // Step 2
  useCase: string;
  role: string;
  receiveUpdates: boolean;
  // Step 3
  companyName: string;
  businessDirection: string;
  teamSize: string;
  // Step 4
  teamEmails: string[];
}

const STEPS = [
  "Valid your phone",
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
 * Register Page — 4-step onboarding flow matching Figma design
 * CRM Woorkroom (nodes 0:7179, 0:7225, 0:7271, 0:7330, 0:7372)
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<FormData>({
    phone: "",
    phoneCode: "+1",
    smsCode: ["", "", "", ""],
    email: "",
    password: "",
    useCase: "Work",
    role: "Business Owner",
    receiveUpdates: true,
    companyName: "",
    businessDirection: "IT and programming",
    teamSize: "",
    teamEmails: [""],
  });

  const set = (field: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const setSmsDigit = (index: number, val: string) => {
    const digits = [...form.smsCode];
    digits[index] = val.slice(-1);
    set("smsCode", digits);
    if (val && index < 3)
      (
        document.getElementById(`sms-${index + 1}`) as HTMLInputElement
      )?.focus();
  };

  const setTeamEmail = (index: number, value: string) => {
    const emails = [...form.teamEmails];
    emails[index] = value;
    set("teamEmails", emails);
  };

  const validateStep = (): boolean => {
    const errs: Record<string, string> = {};
    if (step === 0) {
      if (!form.email) errs.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
      if (!form.password) errs.password = "Password is required";
      else if (form.password.length < 8) errs.password = "Min 8 characters";
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password))
        errs.password = "Must include uppercase, lowercase and a number";
    }
    if (step === 2) {
      if (!form.companyName.trim())
        errs.companyName = "Company name is required";
      if (!form.teamSize) errs.teamSize = "Select team size";
    }
    // Step 3 (Invite Team Members) is optional — no validation
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFinish = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setServerError("");
    try {
      await api.post("/auth/register", {
        email: form.email,
        password: form.password,
        name: form.role || "User",
      });
      navigate("/login?registered=1");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        // Show field-level validation details from server if available
        const details = (err.data as any)?.details;
        if (details?.length) {
          const fieldMsg = details
            .map((d: any) => `${d.field}: ${d.message}`)
            .join(" · ");
          setServerError(fieldMsg);
        } else {
          setServerError(err.data?.message ?? "Registration failed");
        }
      } else {
        setServerError("Registration failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step === STEPS.length - 1) handleFinish();
    else setStep((s) => s + 1);
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

              {/* ── STEP 1: Valid your phone ── */}
              {step === 0 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  <div>
                    <Label.Root style={labelStyle}>Mobile Number</Label.Root>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Select.Root
                        value={form.phoneCode}
                        onValueChange={(v) => set("phoneCode", v)}
                      >
                        <Select.Trigger
                          data-radix-select-trigger
                          className="reg-input"
                          style={{
                            ...inputStyle,
                            width: 80,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 4,
                            paddingRight: 8,
                          }}
                        >
                          <Select.Value />
                          <Select.Icon>
                            <ChevronDown size={14} color="#7D8592" />
                          </Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content
                            data-radix-select-content
                            position="popper"
                            sideOffset={4}
                          >
                            <Select.Viewport>
                              {["+1", "+52", "+44", "+34", "+49", "+33"].map(
                                (c) => (
                                  <Select.Item
                                    key={c}
                                    value={c}
                                    data-radix-select-item
                                  >
                                    <Select.ItemText>{c}</Select.ItemText>
                                    <Select.ItemIndicator>
                                      <Check size={12} color="#3F8CFF" />
                                    </Select.ItemIndicator>
                                  </Select.Item>
                                ),
                              )}
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                      <input
                        type="tel"
                        placeholder="345 567-23-56"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        className="reg-input"
                        style={{ ...inputStyle, flex: 1 }}
                      />
                    </div>
                  </div>

                  <div>
                    <Label.Root style={labelStyle}>Code from SMS</Label.Root>
                    <div style={{ display: "flex", gap: 12 }}>
                      {form.smsCode.map((digit, i) => (
                        <input
                          key={i}
                          id={`sms-${i}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => setSmsDigit(i, e.target.value)}
                          className="reg-input"
                          style={{
                            ...inputStyle,
                            width: 64,
                            textAlign: "center",
                            fontSize: 18,
                            fontWeight: 700,
                          }}
                        />
                      ))}
                    </div>
                    <div
                      style={{
                        marginTop: 10,
                        background: "#EBF4FF",
                        borderRadius: 10,
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        style={{ flexShrink: 0, marginTop: 1 }}
                      >
                        <circle
                          cx="9"
                          cy="9"
                          r="8"
                          stroke="#3F8CFF"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M9 8v5"
                          stroke="#3F8CFF"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <circle cx="9" cy="5.5" r="1" fill="#3F8CFF" />
                      </svg>
                      <p style={{ fontSize: 13, color: "#3F8CFF", margin: 0 }}>
                        SMS was sent to your number {form.phoneCode}{" "}
                        {form.phone || "—"}. It will be valid for 01:25
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label.Root htmlFor="reg-email" style={labelStyle}>
                      Email Address
                    </Label.Root>
                    <input
                      id="reg-email"
                      type="email"
                      placeholder="youremail@gmail.com"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      className="reg-input"
                      style={{
                        ...inputStyle,
                        width: "100%",
                        borderColor: fieldErrors.email ? "#EF4444" : "#D9E0E6",
                      }}
                    />
                    {fieldErrors.email && (
                      <p style={errorStyle}>{fieldErrors.email}</p>
                    )}
                  </div>

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
                          borderColor: fieldErrors.password
                            ? "#EF4444"
                            : "#D9E0E6",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        style={eyeBtnStyle}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p style={errorStyle}>{fieldErrors.password}</p>
                    )}
                  </div>
                </div>
              )}

              {/* ── STEP 2: Tell about yourself ── */}
              {step === 1 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 22 }}
                >
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

              {/* ── STEP 3: Tell about your company ── */}
              {step === 2 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 22 }}
                >
                  <div>
                    <Label.Root htmlFor="companyName" style={labelStyle}>
                      Your Company's Name
                    </Label.Root>
                    <input
                      id="companyName"
                      type="text"
                      placeholder="Company's Name"
                      value={form.companyName}
                      onChange={(e) => set("companyName", e.target.value)}
                      className="reg-input"
                      style={{
                        ...inputStyle,
                        width: "100%",
                        borderColor: fieldErrors.companyName
                          ? "#EF4444"
                          : "#D9E0E6",
                      }}
                    />
                    {fieldErrors.companyName && (
                      <p style={errorStyle}>{fieldErrors.companyName}</p>
                    )}
                  </div>
                  <div>
                    <Label.Root htmlFor="bizDir" style={labelStyle}>
                      Business Direction
                    </Label.Root>
                    <Select.Root
                      value={form.businessDirection}
                      onValueChange={(v) => set("businessDirection", v)}
                    >
                      <Select.Trigger
                        id="bizDir"
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
                            {DIRECTIONS.map((o) => (
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
                      How many people in your team?
                    </Label.Root>
                    {fieldErrors.teamSize && (
                      <p style={{ ...errorStyle, marginBottom: 6 }}>
                        {fieldErrors.teamSize}
                      </p>
                    )}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {TEAM_SIZES.map((size) => {
                        const active = form.teamSize === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            className="tag-btn"
                            onClick={() => set("teamSize", size)}
                            style={{
                              padding: "8px 16px",
                              borderRadius: 10,
                              border: `1px solid ${active ? "#3F8CFF" : "#D9E0E6"}`,
                              background: active ? "#3F8CFF" : "#fff",
                              color: active ? "#fff" : "#0A1628",
                              fontSize: 14,
                              fontWeight: active ? 700 : 400,
                            }}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 4: Invite Team Members ── */}
              {step === 3 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {form.teamEmails.map((email, i) => (
                    <div key={i}>
                      {i === 0 && (
                        <Label.Root style={labelStyle}>
                          Member's Email
                        </Label.Root>
                      )}
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          type="email"
                          placeholder="memberemail@gmail.com"
                          value={email}
                          onChange={(e) => setTeamEmail(i, e.target.value)}
                          className="reg-input"
                          style={{ ...inputStyle, flex: 1 }}
                        />
                        {form.teamEmails.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              set(
                                "teamEmails",
                                form.teamEmails.filter((_, idx) => idx !== i),
                              )
                            }
                            style={{
                              background: "none",
                              border: "1px solid #EF4444",
                              borderRadius: 10,
                              color: "#EF4444",
                              width: 48,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => set("teamEmails", [...form.teamEmails, ""])}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#3F8CFF",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 0",
                    }}
                  >
                    <Plus size={16} />
                    Add another Member
                  </button>
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
                    ? "Creating account..."
                    : step === STEPS.length - 1
                      ? "Finish"
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
