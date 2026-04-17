# Scripts Guidelines

## Overview

Database seeding, utility scripts, and maintenance tasks.

## Structure

```
server/src/scripts/
└── seed.ts          # Creates super-admin user for development
```

## Where to Look

| Task                | Location                                |
| ------------------- | --------------------------------------- |
| Database seeding    | `seed.ts`                               |
| Maintenance scripts | Add new .ts files in this directory     |
| Utility functions   | Consider moving to `utils/` if reusable |

## Conventions

- File naming: Descriptive camelCase or kebab-case (e.g., `seed.ts`, `migrate-db.ts`)
- Script header: JSDoc comment with purpose and usage instructions (e.g., `Run: npx tsx src/scripts/seed.ts`)
- Async main: Wrap logic in async function, call it, handle errors with process.exit(1)
- Database connection: Connect at start, disconnect at end
- Model imports: Dynamically import after connection to avoid circular deps
- Exit codes: Use process.exit(0) for success, process.exit(1) for failure
- Logging: Use console.log for output, console.error for errors
- Environment: Use process.env for configuration (MONGODB_URI, etc.)
- Safety: In production, scripts should have safeguards (confirmation prompts)

## Anti-Patterns

- Logic in global scope: Wrap in function to avoid top-level await issues
- Missing error handling: Always catch errors and exit with non-zero code
- Hardcoded values: Use environment variables or parameters for configurability
- No disconnection: Always disconnect from database when done
- Blocking operations: Avoid synchronous operations in async scripts
- Circular dependencies: Import models after database connection
- Ignoring safety: Production scripts should not run without confirmation
- Large scripts: Split into multiple files if >200 lines (consider grouping by task)

## Notes

- `seed.ts` creates a super-admin user (admin@woorkroom.com / Admin@1234!) for development
- Run with: `npx tsx src/scripts/seed.ts`
- Consider adding migration scripts (e.g., for schema changes) in this directory
- Utility scripts (backups, reports) can also live here
- If scripts grow, consider subdirectories: `seeds/`, `migrations/`, `utils/`
- Check if `scripts/` should be moved to `utils/` - currently it's acceptable for DB-specific scripts
