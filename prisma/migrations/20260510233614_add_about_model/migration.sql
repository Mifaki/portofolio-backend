-- CreateTable
CREATE TABLE "portfolio"."abouts" (
    "id" CHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "instagram" VARCHAR(500),
    "github" VARCHAR(500),
    "linkedin" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "abouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio"."aboutDescriptions" (
    "id" CHAR(36) NOT NULL,
    "aboutId" CHAR(36) NOT NULL,
    "content" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aboutDescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio"."aboutTechStacks" (
    "id" CHAR(36) NOT NULL,
    "aboutId" CHAR(36) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "iconUrl" TEXT NOT NULL,
    "percentage" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aboutTechStacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio"."aboutImages" (
    "id" CHAR(36) NOT NULL,
    "aboutId" CHAR(36) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aboutImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio"."workExperiences" (
    "id" CHAR(36) NOT NULL,
    "aboutId" CHAR(36) NOT NULL,
    "company" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "location" VARCHAR(255),
    "startMonth" INTEGER NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endMonth" INTEGER,
    "endYear" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workExperiences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "abouts_deletedAt_idx" ON "portfolio"."abouts"("deletedAt");

-- CreateIndex
CREATE INDEX "aboutDescriptions_aboutId_idx" ON "portfolio"."aboutDescriptions"("aboutId");

-- CreateIndex
CREATE INDEX "aboutDescriptions_aboutId_position_idx" ON "portfolio"."aboutDescriptions"("aboutId", "position");

-- CreateIndex
CREATE INDEX "aboutTechStacks_aboutId_idx" ON "portfolio"."aboutTechStacks"("aboutId");

-- CreateIndex
CREATE INDEX "aboutImages_aboutId_idx" ON "portfolio"."aboutImages"("aboutId");

-- CreateIndex
CREATE INDEX "workExperiences_aboutId_idx" ON "portfolio"."workExperiences"("aboutId");

-- CreateIndex
CREATE INDEX "workExperiences_aboutId_position_idx" ON "portfolio"."workExperiences"("aboutId", "position");

-- AddForeignKey
ALTER TABLE "portfolio"."aboutDescriptions" ADD CONSTRAINT "aboutDescriptions_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "portfolio"."abouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio"."aboutTechStacks" ADD CONSTRAINT "aboutTechStacks_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "portfolio"."abouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio"."aboutImages" ADD CONSTRAINT "aboutImages_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "portfolio"."abouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio"."workExperiences" ADD CONSTRAINT "workExperiences_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "portfolio"."abouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
