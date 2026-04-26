-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "portfolio";

-- CreateTable
CREATE TABLE "portfolio"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "portfolio"."users"("email");

