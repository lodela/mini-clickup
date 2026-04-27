import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface ISocials {
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  x?: string;
  youtube?: string;
  tiktok?: string;
  whatsapp?: string;
}

export interface ICompany extends Document {
  name: string;
  legalName?: string;
  rfc?: string;
  fiscalAddress?: string;
  logo?: string;
  primaryContact?: Types.ObjectId;
  superAdmin?: Types.ObjectId;
  status: "Active" | "Inactive" | "Suspended";
  // New onboarding fields
  slug: string;           // normalized name for fast exact lookup
  emailDomain?: string;   // extracted from founder's email
  website?: string;
  teamSize?: string;
  socials: ISocials;
  stats: {
    projectsCount: number;
    storiesCount: number;
    ticketsCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, trim: true },
    legalName: { type: String, default: null, trim: true },
    rfc: { type: String, default: null, trim: true, uppercase: true },
    fiscalAddress: { type: String, default: null },
    logo: { type: String, default: null },
    primaryContact: { type: Schema.Types.ObjectId, ref: "User", default: null },
    superAdmin: { type: Schema.Types.ObjectId, ref: "User", default: null },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
    slug: { type: String, required: true, lowercase: true, trim: true, index: true },
    emailDomain: { type: String, default: null, lowercase: true, trim: true, index: true },
    website: { type: String, default: null, trim: true },
    teamSize: { type: String, default: null },
    socials: {
      linkedin:  { type: String, default: null },
      facebook:  { type: String, default: null },
      instagram: { type: String, default: null },
      x:         { type: String, default: null },
      youtube:   { type: String, default: null },
      tiktok:    { type: String, default: null },
      whatsapp:  { type: String, default: null },
    },
    stats: {
      projectsCount: { type: Number, default: 0 },
      storiesCount:  { type: Number, default: 0 },
      ticketsCount:  { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Company: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>("Company", companySchema);
export default Company;
