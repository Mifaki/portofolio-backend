-- CreateTable: OTP codes
CREATE TABLE "portfolio"."OtpCode" (
    "id" CHAR(36) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "code" CHAR(6) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OtpCode_email_idx" ON "portfolio"."OtpCode"("email");

-- CreateIndex
CREATE INDEX "OtpCode_expiresAt_idx" ON "portfolio"."OtpCode"("expiresAt");
