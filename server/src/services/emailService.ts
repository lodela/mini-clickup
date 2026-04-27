import nodemailer from "nodemailer";

/** Escape HTML special characters to prevent injection in email templates (CWE-079) */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Lazy transporter — created on first use so dotenv has already loaded
function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER!,
      pass: process.env.GMAIL_APP_PASSWORD!,
    },
  });
}

function FROM() {
  return `"mini-clickup" <${process.env.GMAIL_USER}>`;
}

/** Send 6-digit OTP code via email */
export async function sendOtpEmail(to: string, code: string): Promise<void> {
  await getTransporter().sendMail({
    from: FROM(),
    to,
    subject: "Your mini-clickup verification code",
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto">
        <h2 style="color:#6366f1">Verify your email</h2>
        <p>Use the code below to verify your account. It expires in <strong>10 minutes</strong>.</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;text-align:center;
                    padding:16px;background:#f4f4f5;border-radius:8px;margin:24px 0">
          ${code}
        </div>
        <p style="color:#6b7280;font-size:13px">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}

/** Send password reset link */
export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  await getTransporter().sendMail({
    from: FROM(),
    to,
    subject: "Reset your mini-clickup password",
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto">
        <h2>Reset your password</h2>
        <p>Click the button below to reset your password. The link expires in <strong>1 hour</strong>.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;
           color:#fff;border-radius:6px;text-decoration:none;margin:16px 0">
          Reset Password
        </a>
        <p style="color:#6b7280;font-size:13px">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}

/** Send team invitation email */
export async function sendInvitationEmail(
  to: string,
  inviterName: string,
  companyName: string,
  inviteUrl: string
): Promise<void> {
  const safeInviter = escapeHtml(inviterName);
  const safeCompany = escapeHtml(companyName);
  const safeUrl = encodeURI(inviteUrl);
  await getTransporter().sendMail({
    from: FROM(),
    to,
    subject: `${safeInviter} invited you to join ${safeCompany} on mini-clickup`,
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto">
        <h2>You're invited!</h2>
        <p><strong>${safeInviter}</strong> invited you to join <strong>${safeCompany}</strong> on mini-clickup.</p>
        <a href="${safeUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;
           color:#fff;border-radius:6px;text-decoration:none;margin:16px 0">
          Accept Invitation
        </a>
        <p style="color:#6b7280;font-size:13px">This invitation expires in 7 days.</p>
      </div>
    `,
  });
}

/** Send welcome email after registration complete */
export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const safeName = escapeHtml(name);
  await getTransporter().sendMail({
    from: FROM(),
    to,
    subject: `Welcome to mini-clickup, ${safeName}!`,
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto">
        <h2>Welcome, ${safeName}! 🎉</h2>
        <p>Your account is ready. Start managing your projects like a pro.</p>
        <a href="${process.env.CLIENT_URL ?? "http://localhost:5173"}/dashboard"
           style="display:inline-block;padding:12px 24px;background:#6366f1;
           color:#fff;border-radius:6px;text-decoration:none;margin:16px 0">
          Go to Dashboard
        </a>
      </div>
    `,
  });
}
