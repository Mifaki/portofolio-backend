import Joi, { ObjectSchema } from "joi";

export interface LoginRequest {
  identifier: string;
  password: string;
}

export const loginRequestSchema: ObjectSchema<LoginRequest> =
  Joi.object<LoginRequest>({
    identifier: Joi.string().required().messages({
      "string.empty": "Identifier cannot be empty.",
      "any.required": "Email or username is required.",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password cannot be empty.",
      "any.required": "Password is required.",
    }),
  });

export interface RefreshRequest {
  refreshToken: string;
}

export const refreshSchema: ObjectSchema<RefreshRequest> =
  Joi.object<RefreshRequest>({
    refreshToken: Joi.string().required().messages({
      "string.empty": "Refresh token cannot be empty.",
      "any.required": "Refresh token is required.",
    }),
  });

export interface OtpSentPayload {
  email: string;
}

export interface SessionPayload {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string | null;
    lastLoginAt?: Date;
    createdAt: Date;
  };
}

export interface Tokens {
  token: string;
  refreshToken: string;
}

export interface OtpRequestBody {
  email: string;
}

export const otpRequestSchema = Joi.object<OtpRequestBody>({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "any.required": "Email is required.",
  }),
});

export interface OtpVerifyBody {
  email: string;
  code: string;
}

export const otpVerifySchema = Joi.object<OtpVerifyBody>({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "any.required": "Email is required.",
  }),
  code: Joi.string().length(6).pattern(/^\d+$/).required().messages({
    "string.length": "OTP must be exactly 6 digits.",
    "string.pattern.base": "OTP must contain only digits.",
    "any.required": "OTP code is required.",
  }),
});

export const loginRequestResponseSchema = Joi.object({
  email: Joi.string().email().description("Masked email address (e.g. us***@domain.com)"),
});

export const verifyOtpResponseSchema = Joi.object({
  token: Joi.string(),
  refreshToken: Joi.string(),
  user: Joi.object({
    id: Joi.string().uuid(),
    username: Joi.string(),
    email: Joi.string().email(),
    role: Joi.string().allow(null),
    lastLoginAt: Joi.date().allow(null),
    createdAt: Joi.date(),
  }),
});

export const refreshResponseSchema = Joi.object({
  token: Joi.string(),
  refreshToken: Joi.string(),
});
