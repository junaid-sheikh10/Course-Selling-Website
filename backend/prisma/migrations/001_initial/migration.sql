PRAGMA foreign_keys=OFF;

CREATE TABLE "users" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "first_name" TEXT,
  "last_name" TEXT
);

CREATE TABLE "admins" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "first_name" TEXT,
  "last_name" TEXT
);

CREATE TABLE "courses" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "price" DECIMAL NOT NULL CHECK ("price" >= 0),
  "image_url" TEXT,
  "creator_id" TEXT NOT NULL,
  "creator_name" TEXT,
  CONSTRAINT "courses_creator_id_fkey"
    FOREIGN KEY ("creator_id") REFERENCES "admins" ("id")
    ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "purchases" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "course_id" TEXT NOT NULL,
  "purchased_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "purchases_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users" ("id")
    ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT "purchases_course_id_fkey"
    FOREIGN KEY ("course_id") REFERENCES "courses" ("id")
    ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");
CREATE INDEX "courses_creator_id_idx" ON "courses"("creator_id");
CREATE UNIQUE INDEX "purchases_user_id_course_id_key" ON "purchases"("user_id", "course_id");
CREATE INDEX "purchases_course_id_idx" ON "purchases"("course_id");

PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
