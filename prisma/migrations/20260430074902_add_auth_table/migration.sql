/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "portfolio"."users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "created_at",
DROP COLUMN "name",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "password" TEXT,
ADD COLUMN     "roleId" TEXT,
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE CHAR(36),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "portfolio"."Role" (
    "id" CHAR(36) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio"."Session" (
    "id" CHAR(36) NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio"."LoginLog" (
    "id" CHAR(36) NOT NULL,
    "userId" TEXT NOT NULL,
    "ip" VARCHAR(45) NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "portfolio"."Role"("name");

-- CreateIndex
CREATE INDEX "Role_createdAt_idx" ON "portfolio"."Role"("createdAt");

-- CreateIndex
CREATE INDEX "Role_updatedAt_idx" ON "portfolio"."Role"("updatedAt");

-- CreateIndex
CREATE INDEX "Role_deletedAt_idx" ON "portfolio"."Role"("deletedAt");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "portfolio"."Session"("userId");

-- CreateIndex
CREATE INDEX "Session_deletedAt_idx" ON "portfolio"."Session"("deletedAt");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "portfolio"."Session"("expiresAt");

-- CreateIndex
CREATE INDEX "LoginLog_userId_idx" ON "portfolio"."LoginLog"("userId");

-- CreateIndex
CREATE INDEX "LoginLog_ip_idx" ON "portfolio"."LoginLog"("ip");

-- CreateIndex
CREATE INDEX "LoginLog_createdAt_idx" ON "portfolio"."LoginLog"("createdAt");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "portfolio"."users"("createdAt");

-- AddForeignKey
ALTER TABLE "portfolio"."users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "portfolio"."Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "portfolio"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio"."LoginLog" ADD CONSTRAINT "LoginLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "portfolio"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
