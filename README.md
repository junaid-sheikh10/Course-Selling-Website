# Course Selling Website

Express/CommonJS backend using SQLite and Prisma ORM 6.19.3. Prisma 6 is pinned for compatibility with the existing CommonJS JavaScript application. The frontend will be added to `frontend/` later.

```text
backend/
  prisma/
    schema.prisma                 # Models mapped to existing SQL tables
    migrations/001_initial/       # Initial SQLite schema and constraints
  scripts/prisma.js               # CLI wrapper; loads backend/.env
  src/
    controllers/                  # HTTP request and response handling
    services/                     # Application business rules
    repositories/                 # Prisma database queries
    routes/                       # API route declarations
    middleware/                   # Authentication, authorization, and errors
    validation/                   # Request schemas
    db/index.js                   # Shared Prisma Client
    index.js
  .env.example
  package.json
```

## Fresh database setup

1. Run `npm ci --prefix backend`. The postinstall script generates Prisma Client.
2. Copy `backend/.env.example` to `backend/.env` if it does not exist. Keep `DATABASE_URL="file:./dev.db"` and set `JWT_SECRET`. Never commit `.env`.
3. No database server is required. Prisma creates the local database at `backend/prisma/dev.db`.
4. Run `npm run db:migrate --prefix backend` to apply committed migrations.
5. Run `npm run dev --prefix backend` or `npm start --prefix backend`.

Default port: 3300. All npm commands below can run from the repository root. The SQLite database file and journal files are ignored by Git.

## Development commands

```sh
npm run db:validate --prefix backend
npm run db:generate --prefix backend
npm run db:migrate:dev --prefix backend -- --name describe_change
npm run db:reset --prefix backend
npm run db:studio --prefix backend
```

Edit `backend/prisma/schema.prisma`, then create and review a migration with `db:migrate:dev`. Use `db:migrate` to apply committed migrations in deployment. `db:reset` deletes local data and rebuilds the development database. Regenerate the client after schema changes. Prisma is included as a runtime dependency so client generation also works when dev dependencies are omitted.

Studio opens a browser interface for viewing and editing records in the local SQLite database. pgAdmin is for PostgreSQL and is not needed for this setup.

## Current data model

The schema contains `User`, `Course`, `WishlistItem`, `CartItem`, and `Enrollment`. A user with the `AUTHOR` role can create courses while retaining normal user capabilities. Course prices are stored in euro cents. Each course has between 1 and 20 seats, with 20 as the default.

Available seats are calculated from the course seat limit and enrollment count. Cart items do not reserve seats. The database migration enforces nonnegative prices, valid seat limits, unique wishlist/cart entries, and one enrollment per user and course.

## API structure

The backend mounts empty route modules at `/api/v1/auth`, `/api/v1/me`, and `/api/v1/courses`. Controllers, services, repositories, authentication middleware, and validation files are scaffolded. Endpoint implementations will be added after the API contract is finalized.
