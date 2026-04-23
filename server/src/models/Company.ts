import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface ICompany extends Document {
  name: string; // Nombre Comercial
  legalName: string; // Razón Social
  rfc: string;
  fiscalAddress: string;
  logo?: string;
  primaryContact: Types.ObjectId; // Usuario responsable
  status: "Active" | "Inactive" | "Suspended";
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
    legalName: { type: String, required: true, trim: true },
    rfc: { type: String, required: true, trim: true, uppercase: true },
    fiscalAddress: { type: String, required: true },
    logo: { type: String, default: null },
    primaryContact: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
    stats: {
      projectsCount: { type: Number, default: 0 },
      storiesCount: { type: Number, default: 0 },
      ticketsCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Company: Model<ICompany> = mongoose.models.Company || mongoose.model<ICompany>("Company", companySchema);
export default Company;
