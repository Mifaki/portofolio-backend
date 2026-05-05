import { OtpSentPayload, SessionPayload, Tokens } from "./auth.dto";
import { comparePassword, generateSingleToken, generateTokens } from "@/middleware/auth";
import { OTP_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from "@/config/variable";
import { httpError } from "@/utils/error";
import { parseDurationToSeconds } from "@/utils/parse";
import { prisma } from "@/config/prisma";
import { randomInt } from "crypto";
import { sendOtpEmail } from "@/utils/mailer";

const OTP_EXPIRES_SECONDS = parseDurationToSeconds(OTP_EXPIRES_IN);
const OTP_EXPIRES_MINUTES = Math.round(OTP_EXPIRES_SECONDS / 60);

async function issueOtp(email: string): Promise<void> {
  const code = randomInt(100000, 999999).toString();

  await prisma.otpCode.deleteMany({ where: { email, usedAt: null } });

  await prisma.otpCode.create({
    data: {
      email,
      code,
      expiresAt: new Date(Date.now() + OTP_EXPIRES_SECONDS * 1000),
    },
  });

  await sendOtpEmail(email, code, OTP_EXPIRES_MINUTES);
}

export async function authenticateUser(
  identifier: string,
  password: string,
  ip: string,
  userAgent?: string,
): Promise<OtpSentPayload> {
  const input = identifier.toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: input }, { username: input }],
    },
  });

  if (!user || !user.password) {
    throw httpError(401, "Invalid credentials");
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw httpError(401, "Invalid credentials");
  }

  await prisma.loginLog.create({
    data: { userId: user.id, ip, userAgent },
  });

  await issueOtp(user.email);

  return { email:user.email };
}

export async function getUser(identifier: string) {
  return prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });
}

export async function createSession(userId: string): Promise<SessionPayload> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });
  if (!user) throw httpError(404, "User not found");

  await prisma.session.deleteMany({ where: { userId } });

  const tokens = generateTokens(userId);
  const expiresMs = parseDurationToSeconds(REFRESH_TOKEN_EXPIRES_IN) * 1000;

  await prisma.session.create({
    data: {
      userId,
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(Date.now() + expiresMs),
    },
  });

  return {
    token: tokens.token,
    refreshToken: tokens.refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role?.name ?? null,
      lastLoginAt: user.lastLoginAt || undefined,
      createdAt: user.createdAt,
    },
  };
}

export async function deleteExistingSessions(userId: string) {
  return prisma.session.deleteMany({
    where: { userId },
  });
}

export async function refreshToken(oldRefresh: string): Promise<Tokens> {
  const session = await prisma.session.findFirst({
    where: { refreshToken: oldRefresh },
  });

  if (!session) {
    throw httpError(401, "Invalid refresh token");
  }

  const now = new Date();
  const expiresAt = new Date(session.expiresAt);
  if (expiresAt.getTime() <= now.getTime()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    throw httpError(401, "Session expired");
  }

  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const msLeft = expiresAt.getTime() - now.getTime();

  if (msLeft <= ONE_DAY_MS) {
    const tokens = generateTokens(session.userId);
    const refreshMs = parseDurationToSeconds(REFRESH_TOKEN_EXPIRES_IN) * 1000;

    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(now.getTime() + refreshMs),
      },
    });

    return tokens;
  }

  const { token } = generateSingleToken(session.userId);
  return { token, refreshToken: oldRefresh };
}

export async function logout(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}

export async function requestOtp(email: string): Promise<void> {
  const normalized = email.toLowerCase();

  const user = await prisma.user.findFirst({
    where: { email: normalized, deletedAt: null },
  });
  if (!user) throw httpError(404, "No account found with this email");

  const recentOtp = await prisma.otpCode.findFirst({
    where: {
      email: normalized,
      usedAt: null,
      createdAt: { gte: new Date(Date.now() - 60_000) },
    },
  });
  if (recentOtp) {
    throw httpError(429, "Please wait 60 seconds before requesting another OTP");
  }

  await issueOtp(normalized);
}

export async function verifyOtp(
  email: string,
  code: string,
): Promise<SessionPayload> {
  const normalized = email.toLowerCase();

  const otp = await prisma.otpCode.findFirst({
    where: { email: normalized, usedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) throw httpError(400, "No active OTP found for this email");

  if (new Date() > otp.expiresAt) {
    await prisma.otpCode.delete({ where: { id: otp.id } }).catch(() => {});
    throw httpError(400, "OTP has expired, please request a new one");
  }

  if (otp.code !== code) throw httpError(400, "Invalid OTP code");

  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { usedAt: new Date() },
  });

  const user = await prisma.user.findFirst({
    where: { email: normalized, deletedAt: null },
  });
  if (!user) throw httpError(404, "No account found with this email");

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return createSession(user.id);
}
