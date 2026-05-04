import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import * as Label from "@radix-ui/react-label";
import { api, ApiRequestError } from "@/services/api";
import { useTranslation } from "react-i18next";
import i18n from "@/locales";

/**
 * Reset Password Page
 * Receives ?token=xxx from email link
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { t } = useTranslation();
  const lang = i18n.language;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!password) errs.password = t("validation.required");
    else if (password.length < 8) errs.password = t("validation.passwordStrength");
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password))
      errs.password = t("validation.passwordRules");
    if (!confirm) errs.confirm = t("validation.required");
    else if (password !== confirm) errs.confirm = t("validation.passwordMatch");
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/reset-password", { token, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? (err.data?.message ?? t("auth.resetFailed"))
          : t("auth.resetFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap');
        .rp-root * { font-family: 'Nunito Sans', system-ui, -apple-system, sans-serif; }
        .rp-input { transition: border-color 0.15s, box-shadow 0.15s; }
        .rp-input:focus { outline: none; border-color: #3F8CFF !important; box-shadow: 0 0 0 2px #fff, 0 0 0 4px #3F8CFF; }
        .rp-btn:hover:not(:disabled) { opacity: 0.9; }
      `}</style>

      <div
        className="rp-root glass-theme"
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 480,
            background: "#fff",
            borderRadius: 24,
            padding: "48px 48px 40px",
            boxShadow: "0px 6px 58px rgba(196,203,214,0.12)",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#EBF4FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
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
            <span style={{ fontWeight: 700, fontSize: 18, color: "#0A1628" }}>
              Woorkroom
            </span>
          </div>

          {!token ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#DC2626", fontSize: 15 }}>
                {t("auth.invalidResetLink")}
              </p>
              <Link
                to="/forgot-password"
                style={{ color: "#3F8CFF", fontWeight: 700 }}
              >
                {t("auth.requestNewLink")}
              </Link>
            </div>
          ) : success ? (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "#D1FAE5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <ShieldCheck size={36} color="#10B981" />
              </div>
              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#0A1628",
                  margin: "0 0 12px",
                }}
              >
                {t("auth.passwordReset")}
              </h1>
              <p style={{ fontSize: 15, color: "#7D8592", lineHeight: "22px" }}>
                {t("auth.passwordResetSuccess")}
              </p>
            </div>
          ) : (
            <>
              {/* Language toggle */}
              <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
                {(["en", "es"] as const).map((lng) => (
                  <button
                    key={lng}
                    type="button"
                    onClick={() => i18n.changeLanguage(lng)}
                    style={{
                      padding: "4px 12px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                      background: lang.startsWith(lng) ? "#3F8CFF" : "transparent",
                      color: lang.startsWith(lng) ? "#fff" : "#7D8592",
                      transition: "background 0.15s, color 0.15s",
                    }}
                  >
                    {lng.toUpperCase()}
                  </button>
                ))}
              </div>

              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#0A1628",
                  margin: "0 0 8px",
                }}
              >
                {t("auth.setNewPassword")}
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: "#7D8592",
                  margin: "0 0 32px",
                  lineHeight: "22px",
                }}
              >
                {t("auth.setNewPasswordSubtitle")}
              </p>

              {error && (
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
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* New password */}
                <div style={{ marginBottom: 20 }}>
                  <Label.Root
                    htmlFor="rp-password"
                    style={{
                      display: "block",
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#0A1628",
                      marginBottom: 8,
                    }}
                  >
                    {t("auth.newPassword")}
                  </Label.Root>
                  <div style={{ position: "relative" }}>
                    <input
                      id="rp-password"
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setFieldErrors((p) => ({ ...p, password: "" }));
                      }}
                      className="rp-input"
                      style={{
                        width: "100%",
                        height: 52,
                        border: `1px solid ${fieldErrors.password ? "#EF4444" : "#D9E0E6"}`,
                        borderRadius: 14,
                        padding: "0 44px 0 16px",
                        fontSize: 15,
                        color: "#0A1628",
                        background: "#fff",
                        boxSizing: "border-box",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((p) => !p)}
                      style={{
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
                      }}
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm password */}
                <div style={{ marginBottom: 28 }}>
                  <Label.Root
                    htmlFor="rp-confirm"
                    style={{
                      display: "block",
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#0A1628",
                      marginBottom: 8,
                    }}
                  >
                    {t("auth.confirmPassword")}
                  </Label.Root>
                  <div style={{ position: "relative" }}>
                    <input
                      id="rp-confirm"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirm}
                      onChange={(e) => {
                        setConfirm(e.target.value);
                        setFieldErrors((p) => ({ ...p, confirm: "" }));
                      }}
                      className="rp-input"
                      style={{
                        width: "100%",
                        height: 52,
                        border: `1px solid ${fieldErrors.confirm ? "#EF4444" : "#D9E0E6"}`,
                        borderRadius: 14,
                        padding: "0 44px 0 16px",
                        fontSize: 15,
                        color: "#0A1628",
                        background: "#fff",
                        boxSizing: "border-box",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      style={{
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
                      }}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {fieldErrors.confirm && (
                    <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>
                      {fieldErrors.confirm}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="rp-btn"
                  style={{
                    width: "100%",
                    height: 48,
                    borderRadius: 14,
                    background: loading ? "#8AB8FF" : "#3F8CFF",
                    border: "none",
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: "0px 6px 12px rgba(63,140,255,0.264)",
                  }}
                >
                  {loading ? t("auth.updating") : t("auth.resetPassword")}
                  {!loading && <ArrowRight size={18} strokeWidth={2.5} />}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
