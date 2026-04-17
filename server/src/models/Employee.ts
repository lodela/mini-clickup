import mongoose, { Document, Schema, Model, Types } from "mongoose";

/**
 * Employee Status Enum
 */
export type EmployeeStatus = "Active" | "Future Start" | "Inactive" | "Terminated";

/**
 * Employee Type Enum
 */
export type EmployeeType = "Full-Time" | "Part-Time" | "Contract" | "Temporary";

/**
 * Performance Score Enum
 */
export type PerformanceScore = "Needs Improvement" | "Fully Meets" | "Exceeds";

/**
 * Employee Level Enum
 */
export type EmployeeLevel = "Junior" | "Middle" | "Senior";

/**
 * Task Assignment Interface (for activity view)
 */
export interface IEmployeeTaskAssignment {
  backlogTasks: number;
  tasksInProgress: number;
  tasksInReview: number;
  completedTasks: number;
  totalTasks: number;
  lastUpdated: Date;
}

/**
 * Employee Document Interface
 */
export interface IEmployee extends Document {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  startDate: Date;
  exitDate?: Date | null;
  title: string;
  supervisor?: Types.ObjectId;
  department: string;
  division?: string;
  status: EmployeeStatus;
  employeeType: EmployeeType;
  dob: Date;
  gender: string;
  performanceScore: PerformanceScore;
  employeeRating: number; // 1-5
  avatar?: string;
  level?: EmployeeLevel;
  taskAssignments?: IEmployeeTaskAssignment;
  createdAt: Date;
  updatedAt: Date;
  getFullName(): string;
  getAge(): number;
  toJSON(): {
    _id: Types.ObjectId;
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    startDate: string;
    exitDate?: string | null;
    title: string;
    supervisor?: Types.ObjectId;
    department: string;
    division?: string;
    status: EmployeeStatus;
    employeeType: EmployeeType;
    dob: string;
    gender: string;
    performanceScore: PerformanceScore;
    employeeRating: number;
    avatar?: string;
    level?: EmployeeLevel;
    taskAssignments?: IEmployeeTaskAssignment;
    createdAt: string;
    updatedAt: string;
    fullName: string;
    age: number;
    isActive: boolean;
    __v: number;
  };
}

/**
 * Employee Task Assignment Schema (embedded document)
 */
const employeeTaskAssignmentSchema = new Schema<IEmployeeTaskAssignment>(
  {
    backlogTasks: {
      type: Number,
      default: 0,
      min: 0,
    },
    tasksInProgress: {
      type: Number,
      default: 0,
      min: 0,
    },
    tasksInReview: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedTasks: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalTasks: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

/**
 * Employee Schema Definition
 */
const employeeSchema = new Schema<IEmployee>(
  {
    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
      unique: true,
      trim: true,
      maxlength: [20, "Employee ID cannot exceed 20 characters"],
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
      index: { unique: true, collation: { locale: "en", strength: 2 } },
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    exitDate: {
      type: Date,
      default: null,
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"],
    },
    supervisor: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      maxlength: [100, "Department cannot exceed 100 characters"],
    },
    division: {
      type: String,
      trim: true,
      maxlength: [100, "Division cannot exceed 100 characters"],
      default: null,
    },
    status: {
      type: String,
      enum: ["Active", "Future Start", "Inactive", "Terminated"],
      default: "Active",
    },
    employeeType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Contract", "Temporary"],
      default: "Full-Time",
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      trim: true,
      maxlength: [20, "Gender cannot exceed 20 characters"],
    },
    performanceScore: {
      type: String,
      enum: ["Needs Improvement", "Fully Meets", "Exceeds"],
      default: "Fully Meets",
    },
    employeeRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    avatar: {
      type: String,
      default: null,
    },
    level: {
      type: String,
      enum: ["Junior", "Middle", "Senior"],
      default: "Middle",
    },
    taskAssignments: {
      type: employeeTaskAssignmentSchema,
      default: () => ({
        backlogTasks: 0,
        tasksInProgress: 0,
        tasksInReview: 0,
        completedTasks: 0,
        totalTasks: 0,
        lastUpdated: new Date(),
      }),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: true },
    toObject: { virtuals: true, transform: true },
  },
);

/**
 * Indexes for performance optimization
 */
employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ email: 1 });
employeeSchema.index({ status: 1 });
employeeSchema.index({ department: 1 });
employeeSchema.index({ firstName: 1, lastName: 1 });
employeeSchema.index({ "taskAssignments.backlogTasks": 1 });
employeeSchema.index({ "taskAssignments.tasksInProgress": 1 });

/**
 * Virtual for full name
 */
employeeSchema.virtual("fullName").get(function (this: IEmployee) {
  return `${this.firstName} ${this.lastName}`;
});

/**
 * Virtual for age
 */
employeeSchema.virtual("age").get(function (this: IEmployee) {
  const today = new Date();
  const birthDate = new Date(this.dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

/**
 * Virtual for isActive status
 */
employeeSchema.virtual("isActive").get(function (this: IEmployee) {
  return this.status === "Active" || this.status === "Future Start";
});

/**
 * Instance method: Get full name
 */
employeeSchema.methods.getFullName = function (): string {
  return `${this.firstName} ${this.lastName}`;
};

/**
 * Instance method: Get age
 */
employeeSchema.methods.getAge = function (): number {
  const today = new Date();
  const birthDate = new Date(this.dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

/**
 * Instance method: Update task assignments
 */
employeeSchema.methods.updateTaskAssignments = async function (
  assignments: Partial<IEmployeeTaskAssignment>
): Promise<void> {
  if (!this.taskAssignments) {
    this.taskAssignments = {
      backlogTasks: 0,
      tasksInProgress: 0,
      tasksInReview: 0,
      completedTasks: 0,
      totalTasks: 0,
      lastUpdated: new Date(),
    };
  }

  Object.assign(this.taskAssignments, {
    ...assignments,
    lastUpdated: new Date(),
  });

  // Calculate total tasks
  this.taskAssignments.totalTasks =
    this.taskAssignments.backlogTasks +
    this.taskAssignments.tasksInProgress +
    this.taskAssignments.tasksInReview +
    this.taskAssignments.completedTasks;

  await this.save();
};

/**
 * Custom toJSON method: Include virtuals and format dates
 */
employeeSchema.methods.toJSON = function (): Record<string, unknown> {
  const obj = this.toObject();
  
  // Include virtuals
  obj.fullName = this.getFullName();
  obj.age = this.getAge();
  obj.isActive = this.isActive();
  
  // Format dates as ISO strings
  if (obj.startDate) obj.startDate = new Date(obj.startDate).toISOString();
  if (obj.exitDate) obj.exitDate = new Date(obj.exitDate).toISOString();
  if (obj.dob) obj.dob = new Date(obj.dob).toISOString();
  if (obj.createdAt) obj.createdAt = new Date(obj.createdAt).toISOString();
  if (obj.updatedAt) obj.updatedAt = new Date(obj.updatedAt).toISOString();
  if (obj.taskAssignments?.lastUpdated) {
    obj.taskAssignments.lastUpdated = new Date(obj.taskAssignments.lastUpdated).toISOString();
  }
  
  return obj;
};

/**
 * Static method: Find employees by department and status
 */
employeeSchema.statics.findByDepartmentAndStatus = async function (
  department: string,
  status?: EmployeeStatus
): Promise<IEmployee[]> {
  const query: Record<string, unknown> = { department };
  
  if (status) {
    query.status = status;
  }

  return this.find(query).sort({ firstName: 1, lastName: 1 });
};

/**
 * Static method: Find active employees
 */
employeeSchema.statics.findActive = function (): Promise<IEmployee[]> {
  return this.find({ status: { $in: ["Active", "Future Start"] } })
    .sort({ firstName: 1, lastName: 1 });
};

/**
 * Static method: Find employees with high workload
 */
employeeSchema.statics.findHighWorkload = function (
  minTasks: number = 10
): Promise<IEmployee[]> {
  return this.find({
    "taskAssignments.totalTasks": { $gte: minTasks },
    status: { $in: ["Active", "Future Start"] },
  }).sort({ "taskAssignments.totalTasks": -1 });
};

/**
 * Create and export Employee model
 */
const Employee: Model<IEmployee> =
  mongoose.models.Employee || mongoose.model<IEmployee>("Employee", employeeSchema);

export default Employee;
