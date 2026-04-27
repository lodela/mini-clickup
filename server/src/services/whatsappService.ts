/**
 * WhatsApp OTP via Meta Cloud API (optional).
 * Set META_WA_TOKEN and META_WA_PHONE_ID in .env to enable.
 * If env vars are missing, the service is a no-op and falls back gracefully.
 */

const WA_API_URL = "https://graph.facebook.com/v19.0";

function isConfigured(): boolean {
  return !!(process.env.META_WA_TOKEN && process.env.META_WA_PHONE_ID);
}

/** Send a 6-digit OTP via WhatsApp using Meta Cloud API */
export async function sendOtpWhatsApp(phone: string, code: string): Promise<void> {
  if (!isConfigured()) {
    console.warn("[WhatsApp] META_WA_TOKEN or META_WA_PHONE_ID not set — WA OTP skipped.");
    return;
  }

  const phoneId = process.env.META_WA_PHONE_ID!;
  const token = process.env.META_WA_TOKEN!;

  const body = {
    messaging_product: "whatsapp",
    to: phone.replace(/\D/g, ""), // strip non-digits
    type: "template",
    template: {
      name: "otp_verification",
      language: { code: "es_MX" },
      components: [
        {
          type: "body",
          parameters: [{ type: "text", text: code }],
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [{ type: "text", text: code }],
        },
      ],
    },
  };

  const res = await fetch(`${WA_API_URL}/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WhatsApp API error: ${res.status} — ${err}`);
  }
}
