import dotenv from "dotenv";
import { env } from "process";
import { httpError } from "@/utils/error";

dotenv.config();

function getEnv(key: string, defaultValue?: string): string {
  const val = env[key] ?? defaultValue;
  if (val == null) {
    throw httpError(500, `Missing required environment variable: ${key}`);
  }
  return val;
}

export const NODE_ENV = (env.NODE_ENV ?? "development").toLowerCase();
export const PORT = parseInt(getEnv("PORT", "3000"), 10);
export const API_URL = getEnv("API_URL");
export const DATABASE_URL = getEnv("DATABASE_URL");
export const SECRET = getEnv("SECRET");
export const JWT_EXPIRES_IN = getEnv("JWT_EXPIRES_IN", "15m");
export const REFRESH_TOKEN_EXPIRES_IN = getEnv(
  "REFRESH_TOKEN_EXPIRES_IN",
  "7d",
);
export const ADMIN_USERNAME = getEnv("ADMIN_USERNAME", "admin");
export const ADMIN_EMAIL = getEnv("ADMIN_EMAIL", "admin@admin.com");
export const ADMIN_PASSWORD = getEnv("ADMIN_PASSWORD", "admin123");