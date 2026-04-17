# Models Guidelines

## Overview

Mongoose schemas defining data structure, validation, and business logic for MongoDB.

## Structure

```
server/src/models/
├── User.ts           # User schema with authentication fields
├── Team.ts           # Team schema with members and projects
├── Project.ts        # Project schema with tasks and status
├── Task.ts           # Task schema with assignee, priority, dates
├── Sprint.ts         # Sprint schema for time-boxed work
├── TimeOffRequest.ts # Vacation/sick leave requests
├── Notification.ts   # System notifications for users
├── ChatMessage.ts    # Chat messages in teams
└── Attachment.ts     # File attachments for tasks/comments
```

## Where to Look

| Task              | Location            |
| ----------------- | ------------------- |
| User data         | `User.ts`           |
| Team data         | `Team.ts`           |
| Project data      | `Project.ts`        |
| Task data         | `Task.ts`           |
| Sprint data       | `Sprint.ts`         |
| Time off requests | `TimeOffRequest.ts` |
| Notifications     | `Notification.ts`   |
| Chat messages     | `ChatMessage.ts`    |
| Attachments       | `Attachment.ts`     |

## Conventions

- File naming: PascalCase (e.g., `User.ts`)
- Schema definition: `new mongoose.Schema({ ... }, { timestamps: true })`
- Instance methods: Defined in `methods` object or directly on schema
- Static methods: Defined in `statics` object or as schema.statics
- Virtuals: Use `schema.virtual()` for computed properties
- Plugins: Use `schema.plugin()` for reusable functionality (e.g., autopopulate)
- Indexes: Define in schema options or use `schema.index()`
- Validation: Use Mongoose built-in validators or custom validators
- Defaults: Set default values in schema definition
- Transform: Use `toJSON` and `toObject` for hiding fields (password, \_\_v)
- Export: `mongoose.model('ModelName', schema)` as default or named export
- References: Use `mongoose.Schema.Types.ObjectId` for relationships
- Timestamps: Enable `{ timestamps: true }` for createdAt/updatedAt

## Anti-Patterns

- Logic in schemas: Keep schemas focused on data structure, move complex logic to services
- Large schemas: Consider splitting if schema has many virtuals/methods (>200 lines)
- Missing indexes: Frequently queried fields should be indexed
- Circular references: Avoid by careful population planning
- Over-populating: Be selective with population to avoid performance issues
- Stale data: Use virtuals for computed values that don't need storage
- Ignoring validation: Always validate data at schema level
- Exposing sensitive data: Never return passwords or tokens in default toJSON
- Inconsistent naming: Use consistent field naming (camelCase for JS, mongoose handles DB conversion)

## Notes

- All models enable timestamps for createdAt/updatedAt
- User schema excludes password and \_\_v from default JSON output
- Team and Project schemas use virtuals for memberCount/projectCount
- Task schema includes references to Project, Team, User (assignee/reporter)
- Consider adding soft delete functionality (deletedAt flag) if needed
- Population strategy: Define in services/controllers, not in schemas unless always needed
