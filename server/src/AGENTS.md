# Employee Module Guidelines

## Overview

Complete CRUD module for Employee management with task assignment tracking and workload monitoring.

## Structure

```
server/src/
├── models/Employee.ts           # Mongoose schema + methods
├── types/employee.types.ts      # TypeScript types & DTOs
├── services/employeeService.ts  # Business logic
├── controllers/employeeController.ts  # HTTP handlers
├── routes/employees.ts          # API routes
└── scripts/seedEmployees.ts     # Data seeding script
```

## API Endpoints

### Base URL: `/api/employees`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create new employee | ✅ |
| GET | `/` | Get all employees (paginated) | ✅ |
| GET | `/statistics` | Get employee statistics | ✅ |
| GET | `/workload-distribution` | Get workload distribution | ✅ |
| GET | `/:id` | Get employee by ID | ✅ |
| GET | `/:id/activity` | Get employee activity summary | ✅ |
| PUT | `/:id` | Update employee details | ✅ |
| PATCH | `/:id/tasks` | Update task assignments | ✅ |
| DELETE | `/:id` | Delete employee | ✅ |

## Data Model

### Employee Schema
```typescript
{
  employeeId: string;           // Unique identifier
  firstName: string;            // 1-50 chars
  lastName: string;             // 1-50 chars
  email: string;                // Unique, validated
  startDate: Date;
  exitDate?: Date | null;
  title: string;                // Job title
  supervisor?: ObjectId;        // Reference to another Employee
  department: string;
  division?: string;
  status: "Active" | "Future Start" | "Inactive" | "Terminated";
  employeeType: "Full-Time" | "Part-Time" | "Contract" | "Temporary";
  dob: Date;                    // Date of birth
  gender: string;
  performanceScore: "Needs Improvement" | "Fully Meets" | "Exceeds";
  employeeRating: number;       // 1-5
  avatar?: string;              // URL
  level: "Junior" | "Middle" | "Senior";
  taskAssignments: {
    backlogTasks: number;
    tasksInProgress: number;
    tasksInReview: number;
    completedTasks: number;
    totalTasks: number;
    lastUpdated: Date;
  };
}
```

### Virtuals
- `fullName`: `${firstName} ${lastName}`
- `age`: Calculated from DOB
- `isActive`: `status === "Active" || status === "Future Start"`

## Usage Examples

### Create Employee
```typescript
POST /api/employees
{
  "employeeId": "EMP001",
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@miniclickup.com",
  "startDate": "2024-01-15",
  "title": "Senior Developer",
  "department": "Engineering",
  "gender": "Male",
  "dob": "1990-05-20",
  "level": "Senior",
  "taskAssignments": {
    "backlogTasks": 3,
    "tasksInProgress": 5,
    "tasksInReview": 2,
    "completedTasks": 20
  }
}
```

### Get Employees with Filters
```bash
GET /api/employees?status=Active&department=Engineering&level=Senior&page=1&limit=10
```

### Update Task Assignments
```typescript
PATCH /api/employees/:id/tasks
{
  "tasksInProgress": 7,
  "completedTasks": 25
}
```

### Get Activity Summary (for Activity View)
```bash
GET /api/employees/:id/activity
```

Response:
```json
{
  "_id": "...",
  "employeeId": "EMP001",
  "fullName": "Juan Pérez",
  "avatar": "https://i.pravatar.cc/150?img=11",
  "title": "Senior Developer",
  "level": "Senior",
  "taskAssignments": {
    "backlogTasks": 3,
    "tasksInProgress": 5,
    "tasksInReview": 2,
    "completedTasks": 20,
    "totalTasks": 30,
    "lastUpdated": "2024-01-20T10:00:00Z"
  },
  "workloadPercentage": 70,
  "status": "Active"
}
```

## Seed Data

### Run Seed Script
```bash
cd server
npm run seed:employees
```

This will:
1. Load 24 Latino employees from `MOCKs/employees_latino_sample.json`
2. Transform and validate data
3. Clear existing employees
4. Insert new employees with random task assignments
5. Display summary statistics

### Mock Data Fields
- 24 employees with Hispanic/Latino names
- Diverse departments: Sales, Engineering, IT/IS, Field Operations, etc.
- Various employee types: Full-Time, Part-Time, Contract
- Performance scores: Needs Improvement, Fully Meets, Exceeds
- Levels: Junior, Middle, Senior
- Auto-generated avatars from pravatar.cc
- Random task assignments for activity view

## Service Functions

| Function | Description |
|----------|-------------|
| `createEmployeeService` | Create new employee |
| `getEmployeesService` | Get paginated list with filters |
| `getEmployeeByIdService` | Get single employee |
| `getEmployeeActivityService` | Get activity summary |
| `updateEmployeeService` | Update employee details |
| `updateTaskAssignmentsService` | Update task assignments |
| `deleteEmployeeService` | Delete employee |
| `getEmployeeStatisticsService` | Get aggregated statistics |
| `getWorkloadDistributionService` | Get workload for all employees |

## Business Logic

### Workload Calculation
```typescript
// Workload percentage based on active tasks
workloadPercentage = (tasksInProgress + tasksInReview) / max(activeTasks, 1) * 100

// Workload levels
Low: totalTasks <= 5
Medium: totalTasks <= 15
High: totalTasks <= 25
Critical: totalTasks > 25
```

### Age Calculation
```typescript
// Calculate age from DOB
const today = new Date();
const birthDate = new Date(dob);
let age = today.getFullYear() - birthDate.getFullYear();
// Adjust for month/day
```

## Validation

### Zod Schemas
- `createEmployeeSchema`: Full validation for creation
- `updateEmployeeSchema`: Partial validation for updates
- `updateTaskAssignmentsSchema`: Task-specific validation

### Validation Rules
- Email: Valid format, unique, lowercase
- Employee ID: Unique, max 20 chars
- Names: 1-50 characters
- Dates: Valid ISO 8601 format
- Rating: 1-5
- Task counts: Non-negative integers

## Error Handling

### Custom Errors
```typescript
// Employee not found
throw AppError.notFound("Employee not found");

// Email already exists
throw AppError.conflict("Email already exists");

// Invalid employee ID format
throw AppError.badRequest("Invalid employee ID format");

// Validation failed
throw AppError.badRequest("Invalid employee data");
```

## Testing

### Test Scenarios
1. Create employee with valid data
2. Create employee with duplicate email (should fail)
3. Get employees with pagination
4. Get employees with filters
5. Get employee activity summary
6. Update employee details
7. Update task assignments
8. Delete employee
9. Get statistics
10. Get workload distribution

## Integration with Other Modules

### Tasks Module
- Employees can be assigned to tasks
- Task assignments are tracked in `taskAssignments`
- Workload affects task distribution

### Projects Module
- Employees can be project members
- Department and division align with project structure

### Teams Module
- Employees belong to teams
- Supervisor relationship can reference other employees

## Frontend Integration

### List View (Figmas: node-id=0-6050)
Use `GET /api/employees` with fields:
- fullName, email, gender, age (from DOB)
- title, level, performanceScore, employeeRating
- avatar

### Activity View (Figmas: node-id=0-8153)
Use `GET /api/employees/:id/activity` or `GET /api/employees/workload-distribution`:
- taskAssignments (backlog, in progress, in review)
- workloadPercentage (for circular progress indicator)
- avatar, fullName, title, level

## Performance Optimization

### Indexes
```typescript
employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ email: 1 });
employeeSchema.index({ status: 1 });
employeeSchema.index({ department: 1 });
employeeSchema.index({ firstName: 1, lastName: 1 });
employeeSchema.index({ "taskAssignments.totalTasks": 1 });
```

### Aggregation Pipeline
Use MongoDB aggregation for statistics to minimize queries.

## TODO: Enhancements

- [ ] Add employee search by skills
- [ ] Implement employee onboarding workflow
- [ ] Add performance review history
- [ ] Track vacation/sick days
- [ ] Add employee documents/certifications
- [ ] Implement supervisor hierarchy tree
- [ ] Add team assignment history
- [ ] Track salary/compensation (secure field)
