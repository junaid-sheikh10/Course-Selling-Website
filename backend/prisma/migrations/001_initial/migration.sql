PRAGMA foreign_keys=OFF;

CREATE TABLE "users" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "password_hash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "birth_year" INTEGER,
  "role" TEXT NOT NULL DEFAULT 'USER' CHECK ("role" IN ('USER', 'AUTHOR')),
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL,
  CONSTRAINT "users_birth_year_check"
    CHECK ("birth_year" IS NULL OR "birth_year" >= 1900)
);

CREATE TABLE "courses" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price_in_cents" INTEGER NOT NULL CHECK ("price_in_cents" >= 0),
  "seat_limit" INTEGER NOT NULL DEFAULT 20 CHECK ("seat_limit" BETWEEN 1 AND 20),
  "author_id" TEXT NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL,
  CONSTRAINT "courses_author_id_fkey"
    FOREIGN KEY ("author_id") REFERENCES "users" ("id")
    ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "wishlist_items" (
  "user_id" TEXT NOT NULL,
  "course_id" TEXT NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("user_id", "course_id"),
  CONSTRAINT "wishlist_items_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "wishlist_items_course_id_fkey"
    FOREIGN KEY ("course_id") REFERENCES "courses" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "cart_items" (
  "user_id" TEXT NOT NULL,
  "course_id" TEXT NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("user_id", "course_id"),
  CONSTRAINT "cart_items_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "cart_items_course_id_fkey"
    FOREIGN KEY ("course_id") REFERENCES "courses" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "enrollments" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "course_id" TEXT NOT NULL,
  "enrolled_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "enrollments_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users" ("id")
    ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT "enrollments_course_id_fkey"
    FOREIGN KEY ("course_id") REFERENCES "courses" ("id")
    ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "courses_author_id_idx" ON "courses"("author_id");
CREATE INDEX "wishlist_items_course_id_idx" ON "wishlist_items"("course_id");
CREATE INDEX "cart_items_course_id_idx" ON "cart_items"("course_id");
CREATE UNIQUE INDEX "enrollments_user_id_course_id_key" ON "enrollments"("user_id", "course_id");
CREATE INDEX "enrollments_course_id_idx" ON "enrollments"("course_id");

PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
