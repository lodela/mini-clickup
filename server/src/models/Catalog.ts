import mongoose, { Document, Schema, Model } from "mongoose";

/**
 * Catalog type constants
 */
export type CatalogType =
  | "project_status"
  | "task_priority"
  | "task_status"
  | "task_type";

const CATALOG_TYPES = [
  "project_status",
  "task_priority",
  "task_status",
  "task_type",
] as const;

/**
 * Catalog Document Interface
 */
export interface ICatalog extends Document {
  type: CatalogType;
  key: string;
  value: string;
  label: string;
  labelEn: string;
  order: number;
  isActive: boolean;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Catalog grouped output type
 */
export type CatalogsByType = Record<CatalogType, ICatalog[]>;

/**
 * Catalog Schema
 */
const catalogSchema = new Schema<ICatalog>(
  {
    type: {
      type: String,
      enum: CATALOG_TYPES,
      required: [true, "Catalog type is required"],
      index: true,
    },
    key: {
      type: String,
      required: [true, "Catalog key is required"],
      trim: true,
    },
    value: {
      type: String,
      required: [true, "Catalog value is required"],
      trim: true,
    },
    label: {
      type: String,
      required: [true, "Spanish label is required"],
      trim: true,
    },
    labelEn: {
      type: String,
      required: [true, "English label is required"],
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: true },
    toObject: { virtuals: true, transform: true },
  },
);

/**
 * Compound indexes
 */
catalogSchema.index({ type: 1, order: 1 });
catalogSchema.index({ type: 1, key: 1 }, { unique: true });

/**
 * Static: Get all catalogs grouped by type
 */
catalogSchema.statics.getAllGrouped = async function (): Promise<CatalogsByType> {
  const catalogs = (await this.find({ isActive: true })
    .sort({ type: 1, order: 1 })
    .lean()) as ICatalog[];

  const grouped = catalogs.reduce<CatalogsByType>(
    (acc, cat) => {
      const type = cat.type as CatalogType;
      if (!acc[type]) acc[type] = [];
      acc[type].push(cat);
      return acc;
    },
    {} as CatalogsByType,
  );

  // Ensure every type has at least an empty array
  for (const t of CATALOG_TYPES) {
    if (!grouped[t]) grouped[t as CatalogType] = [];
  }

  return grouped;
};

export interface ICatalogModel extends Model<ICatalog> {
  getAllGrouped: () => Promise<CatalogsByType>;
}

const Catalog =
  (mongoose.models.Catalog as ICatalogModel) ||
  mongoose.model<ICatalog, ICatalogModel>("Catalog", catalogSchema);

export default Catalog;
