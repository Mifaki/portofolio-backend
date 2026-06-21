/*
  Warnings:

  - You are about to drop the column `iconUrl` on the `aboutTechStacks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "portfolio"."aboutTechStacks" DROP COLUMN "iconUrl",
ADD COLUMN     "categoryId" CHAR(36);

-- CreateTable
CREATE TABLE "portfolio"."techStackCategories" (
    "id" CHAR(36) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "techStackCategories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "techStackCategories_name_key" ON "portfolio"."techStackCategories"("name");

-- CreateIndex
CREATE INDEX "aboutTechStacks_categoryId_idx" ON "portfolio"."aboutTechStacks"("categoryId");

-- AddForeignKey
ALTER TABLE "portfolio"."aboutTechStacks" ADD CONSTRAINT "aboutTechStacks_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "portfolio"."techStackCategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
