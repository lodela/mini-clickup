import mongoose, { Document, Schema, Model, Types } from "mongoose";

export type InvitationStatus = "pending" | "accepted" | "rejected" | "expired";

export interface IInvitation extends Document {
  companyId: Types.ObjectId;
  invitedBy: Types.ObjectId;
  email: string;
  emailDomain: string;
  status: InvitationStatus;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const invitationSchema = new Schema<IInvitation>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    emailDomain: { type: String, required: true, lowercase: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "expired"],
      default: "pending",
    },
    token: { type: String, required: true, unique: true, select: false },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  },
  { timestamps: true }
);

const Invitation: Model<IInvitation> =
  mongoose.models.Invitation || mongoose.model<IInvitation>("Invitation", invitationSchema);

export default Invitation;
