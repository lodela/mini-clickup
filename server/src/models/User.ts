import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";

/**
 * User Role Enum
 */
export type UserRole = 
  | "GOD_MODE" 
  | "CLIENT_A" | "CLIENT_B" | "CLIENT_C" 
  | "DIRECTOR" | "EXECUTIVE" | "MANAGER" 
  | "USER_A" | "USER_B" | "USER_C";

/**
 * User Document Interface
 */
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  companyId?: mongoose.Types.ObjectId; // null for GOD_MODE
  teams: mongoose.Types.ObjectId[];
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toJSON(): {
    _id: mongoose.Types.ObjectId;
    email: string;
    name: string;
    role: UserRole;
    companyId?: mongoose.Types.ObjectId;
    teams: mongoose.Types.ObjectId[];
    avatar?: string;
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  };
}

/**
 * User Schema Definition
 */
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
      index: { unique: true, collation: { locale: "en", strength: 2 } },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Exclude password by default in queries
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    role: {
      type: String,
      enum: [
        "GOD_MODE", 
        "CLIENT_A", "CLIENT_B", "CLIENT_C", 
        "DIRECTOR", "EXECUTIVE", "MANAGER", 
        "USER_A", "USER_B", "USER_C"
      ],
      default: "USER_C",
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    avatar: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: true },
    toObject: { virtuals: true, transform: true },
  },
);

/**
 * Pre-save hook: Hash password before saving
 */
userSchema.pre("save", async function (next) {
  // Only hash if password is modified or new
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || "12", 10);
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Instance method: Compare password
 * @param candidatePassword - Plain text password to compare
 * @returns Boolean indicating if passwords match
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Custom toJSON method: Exclude sensitive fields
 */
userSchema.methods.toJSON = function (): Record<string, unknown> {
  const obj = this.toObject();
  // Remove password from output
  delete obj.password;
  return obj;
};

/**
 * Create and export User model
 */
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
