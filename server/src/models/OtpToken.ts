import mongoose, { Document, Schema, Model } from "mongoose";

export type OtpChannel = "email" | "whatsapp";

export interface IOtpToken extends Document {
  email: string;
  codeHash: string;      // bcrypt hash of the 6-digit code
  channel: OtpChannel;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const otpTokenSchema = new Schema<IOtpToken>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    codeHash: { type: String, required: true, select: false },
    channel: { type: String, enum: ["email", "whatsapp"], default: "email" },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
    attempts: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const OtpToken: Model<IOtpToken> =
  mongoose.models.OtpToken || mongoose.model<IOtpToken>("OtpToken", otpTokenSchema);

export default OtpToken;
