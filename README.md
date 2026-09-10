# Course Selling Website

Express/CommonJS backend using PostgreSQL and Prisma ORM 6.19.3. Prisma 6 is pinned for compatibility with the existing CommonJS JavaScript application. The frontend will be added to `frontend/` later.

```text
backend/
  prisma/
    schema.prisma                 # Models mapped to existing SQL tables
    migrations/001_initial/       # Initial PostgreSQL schema and constraints
  scripts/prisma.js               # CLI wrapper; loads backend/.env
  src/
    db/index.js                   # Shared Prisma Client
    repositories/index.js         # Prisma queries and API serialization
    routes/
    middleware/
    index.js
  .env.example
  package.json
```

## Fresh database setup

1. Run `npm ci --prefix backend`. The postinstall script generates Prisma Client.
2. Create a PostgreSQL database named `course_selling`, locally or with a hosted provider.
3. Copy `backend/.env.example` to `backend/.env` if it does not exist. Set `DATABASE_URL` and both JWT secrets. Never commit `.env`.
4. Run `npm run db:migrate --prefix backend` to apply committed migrations.
5. Run `npm run dev --prefix backend` or `npm start --prefix backend`.

Default port: 3300. All npm commands below can run from the repository root. Generation and schema validation can run without a database; migrations and Studio require a real connection string.

## Existing database from the previous SQL migration

If you already applied the old `001_initial.sql`, do not run the initial migration again or reset the database. First verify that its four tables and constraints match `backend/prisma/migrations/001_initial/migration.sql`. Then register that migration as already applied:

```sh
npm run db:baseline --prefix backend
npm run db:migrate --prefix backend
```

Baselining records migration history without creating or deleting application tables. Do not baseline an empty or mismatched database. The old `schema_migrations` bookkeeping table may remain; Prisma uses `_prisma_migrations` instead. No existing database is automatically baselined, reset, or migrated by dependency installation.

## Development commands

```sh
npm run db:validate --prefix backend
npm run db:generate --prefix backend
npm run db:migrate:dev --prefix backend -- --name describe_change
npm run db:studio --prefix backend
```

Edit `backend/prisma/schema.prisma`, then create and review a migration with `db:migrate:dev` against a development database. This command requires permission to create a shadow database. Use `db:migrate` to apply committed migrations in deployment. Regenerate the client after schema changes. Prisma is included as a runtime dependency so client generation also works when dev dependencies are omitted.

Studio opens a browser interface for viewing and editing database records. pgAdmin can connect to the same PostgreSQL database independently of Prisma.

## Compatibility and scope

Tables: `users`, `admins`, `courses`, `purchases`. Models map camelCase fields to the existing snake_case SQL columns. UUID IDs continue to be returned as `_id` in records. Prices remain `NUMERIC(12,2)` in PostgreSQL and JSON numbers in API responses. Purchase timestamps remain stored but are omitted from existing API responses for compatibility.

Foreign keys and the unique user/course purchase constraint remain. The nonnegative price CHECK is maintained in migration SQL because Prisma's schema does not express it. Preserve it when reviewing later migrations.

Existing routes remain under `/api/v1/user`, `/api/v1/admin`, and `/api/v1/course`, with the existing `token` header. Duplicate records return 409; invalid database input returns 400. Course updates remain scoped to the authenticated creator.

No MongoDB data or tokens are migrated. Authentication hardening, broader validation, and the frontend remain follow-up work; existing plaintext password handling and admin login behavior are unchanged. Purchases record course access and do not process payments.
