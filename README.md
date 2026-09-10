# Course Selling Website

Express backend using PostgreSQL. The frontend will be added to `frontend/` in a later phase.

```text
backend/
  src/
    index.js          # Express app and startup
    config.js         # JWT settings
    db/               # PostgreSQL connection pool
    repositories/     # Parameterized SQL queries
    routes/
    middleware/
  migrations/         # Versioned SQL schema
  scripts/migrate.js  # Transactional migration runner
  .env.example
  package.json
```

## Setup

1. Install dependencies with `npm ci --prefix backend`.
2. Create a PostgreSQL database named `course_selling` using your local installation or a hosted PostgreSQL service.
3. Copy `backend/.env.example` to `backend/.env` if that file does not exist. Set `DATABASE_URL` to your database connection string and supply the two JWT secrets. Existing JWT settings were preserved during the folder move; the new `DATABASE_URL` must be filled in.
4. Run `npm run db:migrate --prefix backend`.
5. Run `npm run dev --prefix backend` for development, or `npm start --prefix backend`.

The default port is 3300. Environment loading uses `backend/.env` regardless of the working directory. Never commit this file. No root npm package or frontend dependencies are required yet.

Migrations run in a transaction, record applied filenames in `schema_migrations`, and skip those files on subsequent runs. Add a new numbered SQL file for future changes rather than editing an applied migration. The database itself must already exist; the runner creates its tables.

## Database and API compatibility

The schema contains `users`, `admins`, `courses`, and `purchases`. Courses reference their creator; purchases reference a user and course. Each user can purchase a course only once. Foreign keys prevent deletion of referenced records.

New IDs are UUIDs, exposed through the existing `_id`, `courseId`, `creatorId`, and `userId` fields. API routes remain under `/api/v1/user`, `/api/v1/admin`, and `/api/v1/course`; authenticated requests still use the `token` header. Existing MongoDB IDs and tokens are not migrated. No MongoDB records are copied or deleted by this setup.

Prices use `NUMERIC(12,2)` in PostgreSQL and are returned as JSON numbers to preserve the existing API shape. Database constraint errors return 400 for invalid input or references and 409 for duplicate records.

## Scope of this phase

This phase moves the backend and replaces MongoDB access with PostgreSQL. Authentication hardening, broader validation, and frontend implementation remain follow-up work. In particular, the existing plaintext password handling and admin login behavior have not been redesigned. The purchase endpoint records course access; it does not process payments.
