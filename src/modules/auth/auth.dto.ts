import Joi, { ObjectSchema } from "joi";

export interface LoginRequest {
  username: string;
  password: string;
}

export const loginRequestSchema: ObjectSchema<LoginRequest> =
  Joi.object<LoginRequest>({
    username: Joi.string().required().messages({
      "string.empty": "Username cannot be empty.",
      "any.required": "Username is required.",
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
