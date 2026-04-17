import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import * as Label from "@radix-ui/react-label";
import { api, ApiRequestError } from "@/services/api";

/**
 * Reset Password Page
 * Receives ?token=xxx from email link
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

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
    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "Min 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password))
      errs.password =
        "Must include uppercase, lowercase, number, and special char";
    if (!confirm) errs.confirm = "Please confirm password";
    else if (password !== confirm) errs.confirm = "Passwords do not match";
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
          ? (err.data?.message ?? "Reset failed")
          : "Reset failed. The link may have expired.",
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
        className="rp-root"
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
          background: "#F4F9FE",
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
                Invalid or expired reset link.
              </p>
              <Link
                to="/forgot-password"
                style={{ color: "#3F8CFF", fontWeight: 700 }}
              >
                Request a new one
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
                Password reset!
              </h1>
              <p style={{ fontSize: 15, color: "#7D8592", lineHeight: "22px" }}>
                Your password has been updated. Redirecting to Sign In…
              </p>
            </div>
          ) : (
            <>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#0A1628",
                  margin: "0 0 8px",
                }}
              >
                Set New Password
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: "#7D8592",
                  margin: "0 0 32px",
                  lineHeight: "22px",
                }}
              >
                Choose a strong password for your account.
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
                    New Password
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
                    Confirm Password
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
                  {loading ? "Updating..." : "Reset Password"}
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
