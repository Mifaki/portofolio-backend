-- CreateEnum
CREATE TYPE "portfolio"."TextType" AS ENUM ('headline', 'regular');

-- CreateEnum
CREATE TYPE "portfolio"."ImageType" AS ENUM ('thumbnail', 'normal');

-- CreateEnum
CREATE TYPE "portfolio"."ImageOrientation" AS ENUM ('landscape', 'portrait');

-- CreateTable
CREATE TABLE "portfolio"."Projects" (
    "id" CHAR(36) NOT NULL,
    "position" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "year" CHAR(4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio"."projectTexts" (
    "id" CHAR(36) NOT NULL,
    "projectId" CHAR(36) NOT NULL,
    "type" "portfolio"."TextType" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projectTexts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio"."projectImages" (
    "id" CHAR(36) NOT NULL,
    "projectId" CHAR(36) NOT NULL,
    "type" "portfolio"."ImageType" NOT NULL,
    "orientation" "portfolio"."ImageOrientation" NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projectImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Projects_title_key" ON "portfolio"."Projects"("title");

-- CreateIndex
CREATE INDEX "Projects_createdAt_idx" ON "portfolio"."Projects"("createdAt");

-- CreateIndex
CREATE INDEX "Projects_category_idx" ON "portfolio"."Projects"("category");

-- CreateIndex
CREATE INDEX "Projects_type_idx" ON "portfolio"."Projects"("type");

-- CreateIndex
CREATE INDEX "Projects_deletedAt_idx" ON "portfolio"."Projects"("deletedAt");

-- CreateIndex
CREATE INDEX "projectTexts_projectId_idx" ON "portfolio"."projectTexts"("projectId");

-- CreateIndex
CREATE INDEX "projectTexts_projectId_type_idx" ON "portfolio"."projectTexts"("projectId", "type");

-- CreateIndex
CREATE INDEX "projectImages_projectId_idx" ON "portfolio"."projectImages"("projectId");

-- CreateIndex
CREATE INDEX "projectImages_projectId_type_idx" ON "portfolio"."projectImages"("projectId", "type");

-- CreateIndex
CREATE INDEX "projectImages_projectId_orientation_idx" ON "portfolio"."projectImages"("projectId", "orientation");

-- AddForeignKey
ALTER TABLE "portfolio"."projectTexts" ADD CONSTRAINT "projectTexts_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "portfolio"."Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio"."projectImages" ADD CONSTRAINT "projectImages_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "portfolio"."Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
