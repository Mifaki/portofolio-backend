ALTER TABLE "portfolio"."projectTexts" ADD COLUMN "position" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "projectTexts_projectId_position_idx" ON "portfolio"."projectTexts"("projectId", "position");
