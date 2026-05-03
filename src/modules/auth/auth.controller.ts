import * as AuthService from "@/modules/auth/auth.service";
import * as R from "@/utils/response";

import { Request, Response } from "express";
import {
  loginRequestSchema,
  otpRequestSchema,
  otpVerifySchema,
  refreshSchema,
} from "@/modules/auth/auth.dto";

export const loginRequest = async (req: Request, res: Response) => {
  const { error, value } = loginRequestSchema.validate(req.body);
  if (error) {
    R.badRequest(res, error.details[0].message);
    return;
  }

  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";

  const userAgent = req.headers["user-agent"];

  const payload = await AuthService.authenticateUser(
    value.identifier,
    value.password,
    ip,
    userAgent,
  );

  R.ok(res, "OTP sent to your email address", payload);
};

export const refresh = async (req: Request, res: Response) => {
  const { error, value } = refreshSchema.validate(req.body);
  if (error) {
    R.badRequest(res, error.details[0].message);
    return;
  }

  const tokens = await AuthService.refreshToken(value.refreshToken);
  R.ok(res, "Token refreshed", tokens);
};

export const logout = async (req: Request, res: Response) => {
  const uid = (req as any).user!.id;
  await AuthService.logout(uid);
  R.ok(res, "Logged out successfully");
};

export const requestOtp = async (req: Request, res: Response) => {
  const { error, value } = otpRequestSchema.validate(req.body);
  if (error) {
    R.badRequest(res, error.details[0].message);
    return;
  }

  await AuthService.requestOtp(value.email);
  R.ok(res, "OTP resent to your email address");
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { error, value } = otpVerifySchema.validate(req.body);
  if (error) {
    R.badRequest(res, error.details[0].message);
    return;
  }

  const payload = await AuthService.verifyOtp(value.email, value.code);
  R.ok(res, "Sign-in successful", payload);
};
