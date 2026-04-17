import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import * as Label from "@radix-ui/react-label";
import { api, ApiRequestError } from "@/services/api";

/**
 * Forgot Password Page — Figma CRM Woorkroom
 * Sends reset link to email
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/forgot-password", { email });
    } catch (err) {
      // Always show success to avoid email enumeration
      if (err instanceof ApiRequestError && err.status !== 404) {
        setError(err.data?.message ?? "Something went wrong");
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap');
        .fp-root * { font-family: 'Nunito Sans', system-ui, -apple-system, sans-serif; }
        .fp-input { transition: border-color 0.15s, box-shadow 0.15s; }
        .fp-input:focus { outline: none; border-color: #3F8CFF !important; box-shadow: 0 0 0 2px #fff, 0 0 0 4px #3F8CFF; }
        .fp-btn:hover:not(:disabled) { opacity: 0.9; }
      `}</style>

      <div
        className="fp-root"
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

          {!submitted ? (
            <>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#0A1628",
                  margin: "0 0 8px",
                }}
              >
                Forgot Password?
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: "#7D8592",
                  margin: "0 0 32px",
                  lineHeight: "22px",
                }}
              >
                No worries! Enter your email and we'll send you a link to reset
                your password.
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
                <Label.Root
                  htmlFor="fp-email"
                  style={{
                    display: "block",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#0A1628",
                    marginBottom: 8,
                  }}
                >
                  Email Address
                </Label.Root>
                <div style={{ position: "relative", marginBottom: 28 }}>
                  <Mail
                    size={18}
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#7D8592",
                    }}
                  />
                  <input
                    id="fp-email"
                    type="email"
                    placeholder="youremail@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className="fp-input"
                    style={{
                      width: "100%",
                      height: 52,
                      border: "1px solid #D9E0E6",
                      borderRadius: 14,
                      padding: "0 16px 0 44px",
                      fontSize: 15,
                      color: "#0A1628",
                      background: "#fff",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="fp-btn"
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
                  {loading ? "Sending..." : "Send Reset Link"}
                  {!loading && <ArrowRight size={18} strokeWidth={2.5} />}
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: 24 }}>
                <Link
                  to="/login"
                  style={{
                    color: "#7D8592",
                    fontSize: 14,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontWeight: 600,
                  }}
                >
                  <ArrowLeft size={14} />
                  Back to Sign In
                </Link>
              </div>
            </>
          ) : (
            /* Success state */
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "#EBF4FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <Mail size={32} color="#3F8CFF" />
              </div>
              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#0A1628",
                  margin: "0 0 12px",
                }}
              >
                Check your email
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: "#7D8592",
                  margin: "0 0 8px",
                  lineHeight: "22px",
                }}
              >
                We sent a password reset link to
              </p>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0A1628",
                  margin: "0 0 32px",
                }}
              >
                {email}
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#7D8592",
                  lineHeight: "20px",
                  marginBottom: 32,
                }}
              >
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#3F8CFF",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  try another address
                </button>
              </p>
              <Link
                to="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#7D8592",
                  fontSize: 14,
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                <ArrowLeft size={14} />
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
