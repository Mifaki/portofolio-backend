import * as R from "@/utils/response";

import { JWT_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN, SECRET } from "@/config/variable";
import { Request, RequestHandler } from "express";

import { User } from "@/generated/prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { parseDurationToSeconds } from "@/utils/parse";
import { prisma } from "@/config/prisma";

export interface AuthRequest extends Request {
  user?: Omit<User, "password"> & {
    roleId: string;
    role: string;
  };
}

const { sign } = jwt;

export const generateTokens = (userId: string) => {
  const accessExpires = parseDurationToSeconds(JWT_EXPIRES_IN);
  const refreshExpires = parseDurationToSeconds(REFRESH_TOKEN_EXPIRES_IN);

  const token = sign({}, SECRET, { subject: userId, expiresIn: accessExpires });

  const refreshToken = sign({}, SECRET, {
    subject: userId,
    expiresIn: refreshExpires,
  });

  return { token, refreshToken };
};

export const generateSingleToken = (userId: string) => {
  const accessExpires = parseDurationToSeconds(JWT_EXPIRES_IN);

  const token = sign({}, SECRET, { subject: userId, expiresIn: accessExpires });

  return { token };
};

export const authorize = (...allowedRoles: string[]): RequestHandler => {
  return (req, res, next) => {
    const authReq = req as unknown as AuthRequest;

    if (!authReq.user) {
      R.unauthorized(res, "Not authenticated");
      return;
    }
    if (!allowedRoles.includes(authReq.user.role)) {
      R.forbidden(res, "Forbidden");
      return;
    }
    next();
  };
};

export const authenticate: RequestHandler = async (req, res, next) => {
  const authReq = req as AuthRequest;
  const header = authReq.headers.authorization;

  if (!header) {
    R.unauthorized(res, "Missing auth header");
    return;
  }

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    R.unauthorized(res, "Invalid authorization format");
    return;
  }

  try {
    const payload = jwt.verify(token, SECRET) as any;
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { role: true },
    });

    if (!user) {
      R.unauthorized(res, "User not found");
      return;
    }

    if (user.deletedAt) {
      await prisma.session.deleteMany({ where: { userId: user.id } });
      R.unauthorized(res, "User was deleted");
      return;
    }

    const { password, role, ...rest } = user;
    authReq.user = {
      ...rest,
      roleId: role?.id || "",
      role: role?.name || "",
    };
    return next();
  } catch (e) {
    R.unauthorized(res, "Invalid or expired token");
    return;
  }
};
export const hashPassword = (raw: string) => bcrypt.hash(raw, 12);

export const comparePassword = (raw: string, hash: string) =>
    bcrypt.compare(raw, hash);
