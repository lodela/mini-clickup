import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

/**
 * Login Page — Figma design: CRM Woorkroom (node 0:6914)
 * Split layout: blue brand panel (left) + login form (right)
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setErrors({});
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <>
      {/* Nunito Sans font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap');
        .login-root * { font-family: 'Nunito Sans', system-ui, -apple-system, sans-serif; }
        .login-input { transition: border-color 0.15s, box-shadow 0.15s; }
        .login-input:focus {
          outline: none;
          border-color: #3F8CFF !important;
          box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px #3F8CFF;
        }
        .login-btn:hover:not(:disabled) { opacity: 0.9; }
        .login-forgot:hover { color: #3F8CFF !important; }
        .login-signup:hover { text-decoration: underline; }
      `}</style>

      <div
        className="login-root"
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          background: "#F4F9FE",
        }}
      >
        {/* ── LEFT PANEL: dark navy branding ───────────────────── */}
        <div
          style={{
            width: "440px",
            flexShrink: 0,
            background: "#0A1628",
            display: "flex",
            flexDirection: "column",
            padding: "48px 40px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle decorative circles */}
          <div
            style={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 280,
              height: 280,
              borderRadius: "50%",
              background: "rgba(63,140,255,0.08)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -60,
              left: -60,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "rgba(63,140,255,0.06)",
              pointerEvents: "none",
            }}
          />

          {/* Logo + Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
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
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: 30,
                lineHeight: "40.92px",
              }}
            >
              Woorkroom
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              marginTop: "auto",
              marginBottom: "auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            <p
              style={{
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: 40,
                lineHeight: "56px",
                margin: 0,
              }}
            >
              Your place to work
            </p>
            <p
              style={{
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: 40,
                lineHeight: "56px",
                margin: 0,
              }}
            >
              Plan. Create. Control.
            </p>
          </div>

          {/* Mini kanban preview */}
          <div
            style={{
              borderRadius: 16,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "16px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 8,
              }}
            >
              {[
                {
                  label: "To Do",
                  color: "#94A3B8",
                  cards: [{ h: 36 }, { h: 28 }],
                },
                { label: "In Progress", color: "#3F8CFF", cards: [{ h: 56 }] },
                { label: "In Review", color: "#F59E0B", cards: [{ h: 40 }] },
                {
                  label: "Done",
                  color: "#10B981",
                  cards: [{ h: 32 }, { h: 24 }],
                },
              ].map((col) => (
                <div key={col.label}>
                  <p
                    style={{
                      color: col.color,
                      fontSize: 10,
                      fontWeight: 700,
                      margin: "0 0 6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {col.label}
                  </p>
                  {col.cards.map((card, i) => (
                    <div
                      key={i}
                      style={{
                        height: card.h,
                        borderRadius: 8,
                        background: `${col.color}22`,
                        border: `1px solid ${col.color}44`,
                        marginBottom: 6,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: light background + card ─────────────── */}
        <div
          style={{
            flex: 1,
            background: "#F4F9FE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 24px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 440,
              background: "#FFFFFF",
              borderRadius: 24,
              padding: 48,
              boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.104)",
            }}
          >
            {/* Card header */}
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#0A1628",
                margin: "0 0 8px",
                lineHeight: "36px",
              }}
            >
              Sign In
            </h1>
            <p
              style={{
                fontSize: 16,
                fontWeight: 400,
                color: "#7D8592",
                margin: "0 0 32px",
                lineHeight: "21.82px",
              }}
            >
              Welcome back! Please enter your details.
            </p>

            {/* Server error */}
            {error && (
              <div
                style={{
                  background: "#FEE2E2",
                  border: "1px solid #FECACA",
                  borderRadius: 12,
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
              {/* Email */}
              <div style={{ marginBottom: 24 }}>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#0A1628",
                    marginBottom: 8,
                    lineHeight: "21.82px",
                  }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="youremail@gmail.com"
                  autoComplete="email"
                  className="login-input"
                  style={{
                    width: "100%",
                    height: 56,
                    border: `1px solid ${errors.email ? "#EF4444" : "#D9E0E6"}`,
                    borderRadius: 14,
                    padding: "0 16px",
                    fontSize: 16,
                    color: "#0A1628",
                    background: "#FFFFFF",
                    boxSizing: "border-box",
                  }}
                />
                {errors.email && (
                  <p style={{ color: "#EF4444", fontSize: 13, marginTop: 4 }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div style={{ marginBottom: 16 }}>
                <label
                  htmlFor="password"
                  style={{
                    display: "block",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#0A1628",
                    marginBottom: 8,
                    lineHeight: "21.82px",
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="login-input"
                    style={{
                      width: "100%",
                      height: 56,
                      border: `1px solid ${errors.password ? "#EF4444" : "#D9E0E6"}`,
                      borderRadius: 14,
                      padding: "0 48px 0 16px",
                      fontSize: 16,
                      color: "#0A1628",
                      background: "#FFFFFF",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((p) => !p)}
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
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p style={{ color: "#EF4444", fontSize: 13, marginTop: 4 }}>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember me + Forgot password */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 24,
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <div
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        rememberMe: !prev.rememberMe,
                      }))
                    }
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      border: `1px solid ${formData.rememberMe ? "#3F8CFF" : "#0A1628"}`,
                      background: formData.rememberMe ? "#3F8CFF" : "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      flexShrink: 0,
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                  >
                    {formData.rememberMe && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M2.5 7L5.5 10L11.5 4"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 16,
                      color: "#7D8592",
                      lineHeight: "21.82px",
                    }}
                  >
                    Remember me
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="login-forgot"
                  style={{
                    fontSize: 16,
                    color: "#7D8592",
                    textDecoration: "none",
                    lineHeight: "21.82px",
                  }}
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="login-btn"
                style={{
                  width: "100%",
                  height: 48,
                  borderRadius: 14,
                  background: isSubmitting ? "#8AB8FF" : "#3F8CFF",
                  border: "none",
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: 700,
                  lineHeight: "21.82px",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0px 6px 12px rgba(63, 140, 255, 0.264)",
                  transition: "opacity 0.15s",
                  padding: "12px 24px",
                  marginBottom: 24,
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeOpacity="0.25"
                      />
                      <path
                        d="M4 12a8 8 0 018-8"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={20} strokeWidth={2.5} />
                  </>
                )}
              </button>

              {/* Register link */}
              <p
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  color: "#7D8592",
                  margin: 0,
                  lineHeight: "21.82px",
                }}
              >
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="login-signup"
                  style={{
                    color: "#3F8CFF",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
