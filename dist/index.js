"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_config = require("dotenv/config");

// src/config/variable.ts
var import_dotenv = __toESM(require("dotenv"));
var import_process = require("process");

// src/utils/error.ts
var httpError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

// src/config/variable.ts
import_dotenv.default.config();
function getEnv(key, defaultValue) {
  const val = import_process.env[key] ?? defaultValue;
  if (val == null) {
    throw httpError(500, `Missing required environment variable: ${key}`);
  }
  return val;
}
var NODE_ENV = (import_process.env.NODE_ENV ?? "development").toLowerCase();
var PORT = parseInt(getEnv("PORT", "3000"), 10);
var API_URL = getEnv("API_URL");
var DATABASE_URL = getEnv("DATABASE_URL");
var SECRET = getEnv("SECRET", "secret");
var JWT_EXPIRES_IN = getEnv("JWT_EXPIRES_IN", "15m");
var REFRESH_TOKEN_EXPIRES_IN = getEnv(
  "REFRESH_TOKEN_EXPIRES_IN",
  "7d"
);
var ADMIN_USERNAME = getEnv("ADMIN_USERNAME", "admin");
var ADMIN_EMAIL = getEnv("ADMIN_EMAIL", "admin@admin.com");
var ADMIN_PASSWORD = getEnv("ADMIN_PASSWORD", "admin123");
var SMTP_HOST = getEnv("SMTP_HOST", "smtp.gmail.com");
var SMTP_PORT = parseInt(getEnv("SMTP_PORT", "587"), 10);
var SMTP_USER = getEnv("SMTP_USER", "");
var SMTP_PASS = getEnv("SMTP_PASS", "");
var SMTP_FROM = getEnv("SMTP_FROM", "");
var OTP_EXPIRES_IN = getEnv("OTP_EXPIRES_IN", "5m");
var ALLOWED_ORIGINS = getEnv("ALLOWED_ORIGINS").split(",");
var ALLOWED_HEADERS = getEnv("ALLOWED_HEADERS", "Content-Type,Authorization,Accept");
var ALLOWED_METHODS = getEnv("ALLOWED_METHODS", "HEAD,GET,PUT,PATCH,POST,DELETE");

// src/utils/response.ts
var send = (res, code, msg, data) => res.status(code).json({
  status: code < 300 ? "success" : "error",
  message: msg,
  ...data !== void 0 ? { data } : {}
});
var ok = (res, msg = "Ok", data) => send(res, 200, msg, data);
var created = (res, msg = "Created", data) => send(res, 201, msg, data);
var badRequest = (res, msg = "Bad Request") => send(res, 400, msg);
var unauthorized = (res, msg = "Unauthorized") => send(res, 401, msg);
var forbidden = (res, msg = "Forbidden") => send(res, 403, msg);

// src/middleware/cors.ts
var cors = (req, res, next) => {
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Headers", ALLOWED_HEADERS);
    res.header("Access-Control-Allow-Methods", ALLOWED_METHODS);
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
    return;
  }
  if (req.method === "OPTIONS") {
    badRequest(res, "Not allowed by CORS");
    return;
  }
  next();
};

// src/index.ts
var import_express6 = __toESM(require("express"));

// src/middleware/auth.ts
var import_bcrypt = __toESM(require("bcrypt"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));

// src/utils/parse.ts
function parseDurationToSeconds(str) {
  const m = str.match(/^(\d+)([smhd])$/);
  if (!m) throw new Error(`Invalid duration format: ${str}`);
  const n = parseInt(m[1], 10);
  switch (m[2]) {
    case "s":
      return n;
    case "m":
      return n * 60;
    case "h":
      return n * 60 * 60;
    case "d":
      return n * 24 * 60 * 60;
  }
  throw new Error(`Invalid unit in duration: ${str}`);
}

// src/generated/prisma/internal/class.ts
var runtime = __toESM(require("@prisma/client/runtime/client"));
var config = {
  "previewFeatures": [],
  "clientVersion": "7.8.0",
  "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
  "activeProvider": "postgresql",
  "inlineSchema": 'model OtpCode {\n  id        String    @id @default(uuid()) @db.Char(36)\n  email     String    @db.VarChar(255)\n  code      String    @db.Char(6)\n  expiresAt DateTime\n  usedAt    DateTime?\n  createdAt DateTime  @default(now())\n\n  @@index([email])\n  @@index([expiresAt])\n  @@schema("portfolio")\n}\n\nenum TextType {\n  headline\n  regular\n\n  @@schema("portfolio")\n}\n\nenum ImageType {\n  thumbnail\n  normal\n\n  @@schema("portfolio")\n}\n\nenum ImageOrientation {\n  landscape\n  portrait\n\n  @@schema("portfolio")\n}\n\nmodel Project {\n  id       String @id @default(uuid()) @db.Char(36)\n  position Int\n  title    String @unique @db.VarChar(255)\n  category String @db.VarChar(100)\n  type     String @db.VarChar(100)\n  year     String @db.Char(4)\n\n  texts  ProjectText[]\n  images ProjectImage[]\n\n  createdAt  DateTime  @default(now())\n  modifiedAt DateTime  @updatedAt\n  deletedAt  DateTime?\n\n  @@index([createdAt])\n  @@index([category])\n  @@index([type])\n  @@index([deletedAt])\n  @@map("Projects")\n  @@schema("portfolio")\n}\n\nmodel ProjectText {\n  id        String   @id @default(uuid()) @db.Char(36)\n  projectId String   @db.Char(36)\n  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)\n  type      TextType\n  content   String   @db.Text\n\n  createdAt  DateTime @default(now())\n  modifiedAt DateTime @updatedAt\n\n  @@index([projectId])\n  @@index([projectId, type])\n  @@map("projectTexts")\n  @@schema("portfolio")\n}\n\nmodel ProjectImage {\n  id          String           @id @default(uuid()) @db.Char(36)\n  projectId   String           @db.Char(36)\n  project     Project          @relation(fields: [projectId], references: [id], onDelete: Cascade)\n  type        ImageType\n  orientation ImageOrientation\n  imageUrl    String           @db.Text\n\n  createdAt  DateTime @default(now())\n  modifiedAt DateTime @updatedAt\n\n  @@index([projectId])\n  @@index([projectId, type])\n  @@index([projectId, orientation])\n  @@map("projectImages")\n  @@schema("portfolio")\n}\n\nmodel Role {\n  id    String  @id @default(uuid()) @db.Char(36)\n  name  String  @unique @db.VarChar(100)\n  title String? @db.VarChar(255)\n  users User[]\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @default(now()) @updatedAt\n  deletedAt DateTime?\n\n  @@index([createdAt])\n  @@index([updatedAt])\n  @@index([deletedAt])\n  @@schema("portfolio")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n  schemas  = ["portfolio"]\n}\n\nmodel User {\n  id          String    @id @default(uuid()) @db.Char(36)\n  email       String    @unique\n  username    String\n  roleId      String?\n  role        Role?     @relation(fields: [roleId], references: [id])\n  password    String?\n  lastLoginAt DateTime?\n  createdAt   DateTime  @default(now())\n  deletedAt   DateTime?\n\n  sessions  Session[]\n  loginLogs LoginLog[]\n\n  @@index([createdAt])\n  @@map("users")\n  @@schema("portfolio")\n}\n\nmodel Session {\n  id           String   @id @default(uuid()) @db.Char(36)\n  userId       String\n  user         User     @relation(fields: [userId], references: [id])\n  refreshToken String   @db.Text\n  expiresAt    DateTime\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @default(now()) @updatedAt\n  deletedAt DateTime?\n\n  @@index([userId])\n  @@index([deletedAt])\n  @@index([expiresAt])\n  @@schema("portfolio")\n}\n\nmodel LoginLog {\n  id        String  @id @default(uuid()) @db.Char(36)\n  userId    String\n  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  ip        String  @db.VarChar(45)\n  userAgent String? @db.Text\n\n  createdAt DateTime @default(now())\n\n  @@index([userId])\n  @@index([ip])\n  @@index([createdAt])\n  @@schema("portfolio")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"OtpCode":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"usedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Project":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"position","kind":"scalar","type":"Int"},{"name":"title","kind":"scalar","type":"String"},{"name":"category","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"year","kind":"scalar","type":"String"},{"name":"texts","kind":"object","type":"ProjectText","relationName":"ProjectToProjectText"},{"name":"images","kind":"object","type":"ProjectImage","relationName":"ProjectToProjectImage"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"modifiedAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"}],"dbName":"Projects"},"ProjectText":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"projectId","kind":"scalar","type":"String"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToProjectText"},{"name":"type","kind":"enum","type":"TextType"},{"name":"content","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"modifiedAt","kind":"scalar","type":"DateTime"}],"dbName":"projectTexts"},"ProjectImage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"projectId","kind":"scalar","type":"String"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToProjectImage"},{"name":"type","kind":"enum","type":"ImageType"},{"name":"orientation","kind":"enum","type":"ImageOrientation"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"modifiedAt","kind":"scalar","type":"DateTime"}],"dbName":"projectImages"},"Role":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"users","kind":"object","type":"User","relationName":"RoleToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"username","kind":"scalar","type":"String"},{"name":"roleId","kind":"scalar","type":"String"},{"name":"role","kind":"object","type":"Role","relationName":"RoleToUser"},{"name":"password","kind":"scalar","type":"String"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"loginLogs","kind":"object","type":"LoginLog","relationName":"LoginLogToUser"}],"dbName":"users"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"LoginLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"LoginLogToUser"},{"name":"ip","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","OtpCode.findUnique","OtpCode.findUniqueOrThrow","orderBy","cursor","OtpCode.findFirst","OtpCode.findFirstOrThrow","OtpCode.findMany","data","OtpCode.createOne","OtpCode.createMany","OtpCode.createManyAndReturn","OtpCode.updateOne","OtpCode.updateMany","OtpCode.updateManyAndReturn","create","update","OtpCode.upsertOne","OtpCode.deleteOne","OtpCode.deleteMany","having","_count","_min","_max","OtpCode.groupBy","OtpCode.aggregate","project","texts","images","Project.findUnique","Project.findUniqueOrThrow","Project.findFirst","Project.findFirstOrThrow","Project.findMany","Project.createOne","Project.createMany","Project.createManyAndReturn","Project.updateOne","Project.updateMany","Project.updateManyAndReturn","Project.upsertOne","Project.deleteOne","Project.deleteMany","_avg","_sum","Project.groupBy","Project.aggregate","ProjectText.findUnique","ProjectText.findUniqueOrThrow","ProjectText.findFirst","ProjectText.findFirstOrThrow","ProjectText.findMany","ProjectText.createOne","ProjectText.createMany","ProjectText.createManyAndReturn","ProjectText.updateOne","ProjectText.updateMany","ProjectText.updateManyAndReturn","ProjectText.upsertOne","ProjectText.deleteOne","ProjectText.deleteMany","ProjectText.groupBy","ProjectText.aggregate","ProjectImage.findUnique","ProjectImage.findUniqueOrThrow","ProjectImage.findFirst","ProjectImage.findFirstOrThrow","ProjectImage.findMany","ProjectImage.createOne","ProjectImage.createMany","ProjectImage.createManyAndReturn","ProjectImage.updateOne","ProjectImage.updateMany","ProjectImage.updateManyAndReturn","ProjectImage.upsertOne","ProjectImage.deleteOne","ProjectImage.deleteMany","ProjectImage.groupBy","ProjectImage.aggregate","role","user","sessions","loginLogs","users","Role.findUnique","Role.findUniqueOrThrow","Role.findFirst","Role.findFirstOrThrow","Role.findMany","Role.createOne","Role.createMany","Role.createManyAndReturn","Role.updateOne","Role.updateMany","Role.updateManyAndReturn","Role.upsertOne","Role.deleteOne","Role.deleteMany","Role.groupBy","Role.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","LoginLog.findUnique","LoginLog.findUniqueOrThrow","LoginLog.findFirst","LoginLog.findFirstOrThrow","LoginLog.findMany","LoginLog.createOne","LoginLog.createMany","LoginLog.createManyAndReturn","LoginLog.updateOne","LoginLog.updateMany","LoginLog.updateManyAndReturn","LoginLog.upsertOne","LoginLog.deleteOne","LoginLog.deleteMany","LoginLog.groupBy","LoginLog.aggregate","AND","OR","NOT","id","userId","ip","userAgent","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","refreshToken","expiresAt","updatedAt","deletedAt","email","username","roleId","password","lastLoginAt","name","title","every","some","none","projectId","ImageType","type","ImageOrientation","orientation","imageUrl","modifiedAt","TextType","content","position","category","year","code","usedAt","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "qANGgAEJlAEAAI8CADCVAQAABAAQlgEAAI8CADCXAQEAAAABmwFAAOsBACGoAUAA6wEAIasBAQDpAQAhwQEBAOkBACHCAUAA7gEAIQEAAAABACABAAAAAQAgCZQBAACPAgAwlQEAAAQAEJYBAACPAgAwlwEBAOkBACGbAUAA6wEAIagBQADrAQAhqwEBAOkBACHBAQEA6QEAIcIBQADuAQAhAcIBAACQAgAgAwAAAAQAIAMAAAUAMAQAAAEAIAMAAAAEACADAAAFADAEAAABACADAAAABAAgAwAABQAwBAAAAQAgBpcBAQAAAAGbAUAAAAABqAFAAAAAAasBAQAAAAHBAQEAAAABwgFAAAAAAQEIAAAJACAGlwEBAAAAAZsBQAAAAAGoAUAAAAABqwEBAAAAAcEBAQAAAAHCAUAAAAABAQgAAAsAMAEIAAALADAGlwEBAJQCACGbAUAAlgIAIagBQACWAgAhqwEBAJQCACHBAQEAlAIAIcIBQACcAgAhAgAAAAEAIAgAAA4AIAaXAQEAlAIAIZsBQACWAgAhqAFAAJYCACGrAQEAlAIAIcEBAQCUAgAhwgFAAJwCACECAAAABAAgCAAAEAAgAgAAAAQAIAgAABAAIAMAAAABACAPAAAJACAQAAAOACABAAAAAQAgAQAAAAQAIAQVAACIAwAgFgAAigMAIBcAAIkDACDCAQAAkAIAIAmUAQAAjgIAMJUBAAAXABCWAQAAjgIAMJcBAQDXAQAhmwFAANkBACGoAUAA2QEAIasBAQDXAQAhwQEBANcBACHCAUAA4wEAIQMAAAAEACADAAAWADAUAAAXACADAAAABAAgAwAABQAwBAAAAQAgDhsAAIYCACAcAACHAgAglAEAAIQCADCVAQAAJwAQlgEAAIQCADCXAQEAAAABmwFAAOsBACGqAUAA7gEAIbEBAQAAAAG3AQEA6QEAIbsBQADrAQAhvgECAIUCACG_AQEA6QEAIcABAQDpAQAhAQAAABoAIAoaAACLAgAglAEAAIwCADCVAQAAHAAQlgEAAIwCADCXAQEA6QEAIZsBQADrAQAhtQEBAOkBACG3AQAAjQK9ASK7AUAA6wEAIb0BAQDpAQAhARoAAIcDACAKGgAAiwIAIJQBAACMAgAwlQEAABwAEJYBAACMAgAwlwEBAAAAAZsBQADrAQAhtQEBAOkBACG3AQAAjQK9ASK7AUAA6wEAIb0BAQDpAQAhAwAAABwAIAMAAB0AMAQAAB4AIAsaAACLAgAglAEAAIgCADCVAQAAIAAQlgEAAIgCADCXAQEA6QEAIZsBQADrAQAhtQEBAOkBACG3AQAAiQK3ASK5AQAAigK5ASK6AQEA6QEAIbsBQADrAQAhARoAAIcDACALGgAAiwIAIJQBAACIAgAwlQEAACAAEJYBAACIAgAwlwEBAAAAAZsBQADrAQAhtQEBAOkBACG3AQAAiQK3ASK5AQAAigK5ASK6AQEA6QEAIbsBQADrAQAhAwAAACAAIAMAACEAMAQAACIAIAEAAAAcACABAAAAIAAgAQAAABoAIA4bAACGAgAgHAAAhwIAIJQBAACEAgAwlQEAACcAEJYBAACEAgAwlwEBAOkBACGbAUAA6wEAIaoBQADuAQAhsQEBAOkBACG3AQEA6QEAIbsBQADrAQAhvgECAIUCACG_AQEA6QEAIcABAQDpAQAhAxsAAIUDACAcAACGAwAgqgEAAJACACADAAAAJwAgAwAAKAAwBAAAGgAgAwAAACcAIAMAACgAMAQAABoAIAMAAAAnACADAAAoADAEAAAaACALGwAAgwMAIBwAAIQDACCXAQEAAAABmwFAAAAAAaoBQAAAAAGxAQEAAAABtwEBAAAAAbsBQAAAAAG-AQIAAAABvwEBAAAAAcABAQAAAAEBCAAALAAgCZcBAQAAAAGbAUAAAAABqgFAAAAAAbEBAQAAAAG3AQEAAAABuwFAAAAAAb4BAgAAAAG_AQEAAAABwAEBAAAAAQEIAAAuADABCAAALgAwCxsAAOkCACAcAADqAgAglwEBAJQCACGbAUAAlgIAIaoBQACcAgAhsQEBAJQCACG3AQEAlAIAIbsBQACWAgAhvgECAOgCACG_AQEAlAIAIcABAQCUAgAhAgAAABoAIAgAADEAIAmXAQEAlAIAIZsBQACWAgAhqgFAAJwCACGxAQEAlAIAIbcBAQCUAgAhuwFAAJYCACG-AQIA6AIAIb8BAQCUAgAhwAEBAJQCACECAAAAJwAgCAAAMwAgAgAAACcAIAgAADMAIAMAAAAaACAPAAAsACAQAAAxACABAAAAGgAgAQAAACcAIAYVAADjAgAgFgAA5gIAIBcAAOUCACArAADkAgAgLAAA5wIAIKoBAACQAgAgDJQBAACAAgAwlQEAADoAEJYBAACAAgAwlwEBANcBACGbAUAA2QEAIaoBQADjAQAhsQEBANcBACG3AQEA1wEAIbsBQADZAQAhvgECAIECACG_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_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_QG9ASK7AUAA2QEAIb0BAQDXAQAhBxUAANsBACAWAAD_AQAgFwAA_wEAIJwBAAAAvQECnQEAAAC9AQieAQAAAL0BCKMBAAD-Ab0BIgcVAADbAQAgFgAA_wEAIBcAAP8BACCcAQAAAL0BAp0BAAAAvQEIngEAAAC9AQijAQAA_gG9ASIEnAEAAAC9AQKdAQAAAL0BCJ4BAAAAvQEIowEAAP8BvQEiDJQBAACAAgAwlQEAADoAEJYBAACAAgAwlwEBANcBACGbAUAA2QEAIaoBQADjAQAhsQEBANcBACG3AQEA1wEAIbsBQADZAQAhvgECAIECACG_AQEA1wEAIcABAQDXAQAhDRUAANsBACAWAADbAQAgFwAA2wEAICsAAIMCACAsAADbAQAgnAECAAAAAZ0BAgAAAASeAQIAAAAEnwECAAAAAaABAgAAAAGhAQIAAAABogECAAAAAaMBAgCCAgAhDRUAANsBACAWAADbAQAgFwAA2wEAICsAAIMCACAsAADbAQAgnAECAAAAAZ0BAgAAAASeAQIAAAAEnwECAAAAAaABAgAAAAGhAQIAAAABogECAAAAAaMBAgCCAgAhCJwBCAAAAAGdAQgAAAAEngEIAAAABJ8BCAAAAAGgAQgAAAABoQEIAAAAAaIBCAAAAAGjAQgAgwIAIQ4bAACGAgAgHAAAhwIAIJQBAACEAgAwlQEAACcAEJYBAACEAgAwlwEBAOkBACGbAUAA6wEAIaoBQADuAQAhsQEBAOkBACG3AQEA6QEAIbsBQADrAQAhvgECAIUCACG_AQEA6QEAIcABAQDpAQAhCJwBAgAAAAGdAQIAAAAEngECAAAABJ8BAgAAAAGgAQIAAAABoQECAAAAAaIBAgAAAAGjAQIA2wEAIQOyAQAAHAAgswEAABwAILQBAAAcACADsgEAACAAILMBAAAgACC0AQAAIAAgCxoAAIsCACCUAQAAiAIAMJUBAAAgABCWAQAAiAIAMJcBAQDpAQAhmwFAAOsBACG1AQEA6QEAIbcBAACJArcBIrkBAACKArkBIroBAQDpAQAhuwFAAOsBACEEnAEAAAC3AQKdAQAAALcBCJ4BAAAAtwEIowEAAPsBtwEiBJwBAAAAuQECnQEAAAC5AQieAQAAALkBCKMBAAD5AbkBIhAbAACGAgAgHAAAhwIAIJQBAACEAgAwlQEAACcAEJYBAACEAgAwlwEBAOkBACGbAUAA6wEAIaoBQADuAQAhsQEBAOkBACG3AQEA6QEAIbsBQADrAQAhvgECAIUCACG_AQEA6QEAIcABAQDpAQAhwwEAACcAIMQBAAAnACAKGgAAiwIAIJQBAACMAgAwlQEAABwAEJYBAACMAgAwlwEBAOkBACGbAUAA6wEAIbUBAQDpAQAhtwEAAI0CvQEiuwFAAOsBACG9AQEA6QEAIQScAQAAAL0BAp0BAAAAvQEIngEAAAC9AQijAQAA_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-QIAMMcBAAD6AgAgyAEAAPsCADDJAQAA-wIAMMoBAAD7AgAwywEAAPsCADDMAQAA_QIAMM0BAAD-AgAwCw8AAOsCADAQAADwAgAwxQEAAOwCADDGAQAA7QIAMMcBAADuAgAgyAEAAO8CADDJAQAA7wIAMMoBAADvAgAwywEAAO8CADDMAQAA8QIAMM0BAADyAgAwBpcBAQAAAAGbAUAAAAABtwEAAAC3AQK5AQAAALkBAroBAQAAAAG7AUAAAAABAgAAACIAIA8AAPYCACADAAAAIgAgDwAA9gIAIBAAAPUCACABCAAAjAMAMAsaAACLAgAglAEAAIgCADCVAQAAIAAQlgEAAIgCADCXAQEAAAABmwFAAOsBACG1AQEA6QEAIbcBAACJArcBIrkBAACKArkBIroBAQDpAQAhuwFAAOsBACECAAAAIgAgCAAA9QIAIAIAAADzAgAgCAAA9AIAIAqUAQAA8gIAMJUBAADzAgAQlgEAAPICADCXAQEA6QEAIZsBQADrAQAhtQEBAOkBACG3AQAAiQK3ASK5AQAAigK5ASK6AQEA6QEAIbsBQADrAQAhCpQBAADyAgAwlQEAAPMCABCWAQAA8gIAMJcBAQDpAQAhmwFAAOsBACG1AQEA6QEAIbcBAACJArcBIrkBAACKArkBIroBAQDpAQAhuwFAAOsBACEGlwEBAJQCACGbAUAAlgIAIbcBAADZArcBIrkBAADaArkBIroBAQCUAgAhuwFAAJYCACEGlwEBAJQCACGbAUAAlgIAIbcBAADZArcBIrkBAADaArkBIroBAQCUAgAhuwFAAJYCACEGlwEBAAAAAZsBQAAAAAG3AQAAALcBArkBAAAAuQECugEBAAAAAbsBQAAAAAEFlwEBAAAAAZsBQAAAAAG3AQAAAL0BArsBQAAAAAG9AQEAAAABAgAAAB4AIA8AAIIDACADAAAAHgAgDwAAggMAIBAAAIEDACABCAAAiwMAMAoaAACLAgAglAEAAIwCADCVAQAAHAAQlgEAAIwCADCXAQEAAAABmwFAAOsBACG1AQEA6QEAIbcBAACNAr0BIrsBQADrAQAhvQEBAOkBACECAAAAHgAgCAAAgQMAIAIAAAD_AgAgCAAAgAMAIAmUAQAA_gIAMJUBAAD_AgAQlgEAAP4CADCXAQEA6QEAIZsBQADrAQAhtQEBAOkBACG3AQAAjQK9ASK7AUAA6wEAIb0BAQDpAQAhCZQBAAD-AgAwlQEAAP8CABCWAQAA_gIAMJcBAQDpAQAhmwFAAOsBACG1AQEA6QEAIbcBAACNAr0BIrsBQADrAQAhvQEBAOkBACEFlwEBAJQCACGbAUAAlgIAIbcBAADgAr0BIrsBQACWAgAhvQEBAJQCACEFlwEBAJQCACGbAUAAlgIAIbcBAADgAr0BIrsBQACWAgAhvQEBAJQCACEFlwEBAAAAAZsBQAAAAAG3AQAAAL0BArsBQAAAAAG9AQEAAAABBA8AAPcCADDFAQAA-AIAMMcBAAD6AgAgywEAAPsCADAEDwAA6wIAMMUBAADsAgAwxwEAAO4CACDLAQAA7wIAMAAAAxsAAIUDACAcAACGAwAgqgEAAJACACAAAAAFlwEBAAAAAZsBQAAAAAG3AQAAAL0BArsBQAAAAAG9AQEAAAABBpcBAQAAAAGbAUAAAAABtwEAAAC3AQK5AQAAALkBAroBAQAAAAG7AUAAAAABChwAAIQDACCXAQEAAAABmwFAAAAAAaoBQAAAAAGxAQEAAAABtwEBAAAAAbsBQAAAAAG-AQIAAAABvwEBAAAAAcABAQAAAAECAAAAGgAgDwAAjQMAIAMAAAAnACAPAACNAwAgEAAAkQMAIAwAAAAnACAIAACRAwAgHAAA6gIAIJcBAQCUAgAhmwFAAJYCACGqAUAAnAIAIbEBAQCUAgAhtwEBAJQCACG7AUAAlgIAIb4BAgDoAgAhvwEBAJQCACHAAQEAlAIAIQocAADqAgAglwEBAJQCACGbAUAAlgIAIaoBQACcAgAhsQEBAJQCACG3AQEAlAIAIbsBQACWAgAhvgECAOgCACG_AQEAlAIAIcABAQCUAgAhChsAAIMDACCXAQEAAAABmwFAAAAAAaoBQAAAAAGxAQEAAAABtwEBAAAAAbsBQAAAAAG-AQIAAAABvwEBAAAAAcABAQAAAAECAAAAGgAgDwAAkgMAIAMAAAAnACAPAACSAwAgEAAAlgMAIAwAAAAnACAIAACWAwAgGwAA6QIAIJcBAQCUAgAhmwFAAJYCACGqAUAAnAIAIbEBAQCUAgAhtwEBAJQCACG7AUAAlgIAIb4BAgDoAgAhvwEBAJQCACHAAQEAlAIAIQobAADpAgAglwEBAJQCACGbAUAAlgIAIaoBQACcAgAhsQEBAJQCACG3AQEAlAIAIbsBQACWAgAhvgECAOgCACG_AQEAlAIAIcABAQCUAgAhB5cBAQAAAAGbAUAAAAABqgFAAAAAAasBAQAAAAGsAQEAAAABrgEBAAAAAa8BQAAAAAEGlwEBAAAAAZsBQAAAAAGpAUAAAAABqgFAAAAAAbABAQAAAAGxAQEAAAABAgAAAGkAIA8AAJgDACAGlwEBAAAAAZsBQAAAAAGnAQEAAAABqAFAAAAAAakBQAAAAAGqAUAAAAABBJcBAQAAAAGZAQEAAAABmgEBAAAAAZsBQAAAAAEDAAAAbwAgDwAAmAMAIBAAAJ4DACAIAAAAbwAgCAAAngMAIJcBAQCUAgAhmwFAAJYCACGpAUAAlgIAIaoBQACcAgAhsAEBAJQCACGxAQEAlQIAIQaXAQEAlAIAIZsBQACWAgAhqQFAAJYCACGqAUAAnAIAIbABAQCUAgAhsQEBAJUCACEKTwAAvQIAIFIAAL8CACCXAQEAAAABmwFAAAAAAaoBQAAAAAGrAQEAAAABrAEBAAAAAa0BAQAAAAGuAQEAAAABrwFAAAAAAQIAAABtACAPAACfAwAgAwAAAGsAIA8AAJ8DACAQAACjAwAgDAAAAGsAIAgAAKMDACBPAACiAgAgUgAApAIAIJcBAQCUAgAhmwFAAJYCACGqAUAAnAIAIasBAQCUAgAhrAEBAJQCACGtAQEAlQIAIa4BAQCVAgAhrwFAAJwCACEKTwAAogIAIFIAAKQCACCXAQEAlAIAIZsBQACWAgAhqgFAAJwCACGrAQEAlAIAIawBAQCUAgAhrQEBAJUCACGuAQEAlQIAIa8BQACcAgAhCk8AAL0CACBRAAC-AgAglwEBAAAAAZsBQAAAAAGqAUAAAAABqwEBAAAAAawBAQAAAAGtAQEAAAABrgEBAAAAAa8BQAAAAAECAAAAbQAgDwAApAMAIAMAAABrACAPAACkAwAgEAAAqAMAIAwAAABrACAIAACoAwAgTwAAogIAIFEAAKMCACCXAQEAlAIAIZsBQACWAgAhqgFAAJwCACGrAQEAlAIAIawBAQCUAgAhrQEBAJUCACGuAQEAlQIAIa8BQACcAgAhCk8AAKICACBRAACjAgAglwEBAJQCACGbAUAAlgIAIaoBQACcAgAhqwEBAJQCACGsAQEAlAIAIa0BAQCVAgAhrgEBAJUCACGvAUAAnAIAIQAAAAADFQAGFgAHFwAIAAAAAxUABhYABxcACAMVAA0bHwscIwwBGgAKARoACgIbJAAcJQAAAAUVABEWABQXABUrABIsABMAAAAAAAUVABEWABQXABUrABIsABMBGgAKARoACgMVABoWABsXABwAAAADFQAaFgAbFwAcARoACgEaAAoDFQAhFgAiFwAjAAAAAxUAIRYAIhcAIwIVACpTbiYEFQApT3AlUXQnUngoAVAAJgFQACYCUXkAUnoAAVN7AAAAAxUALhYALxcAMAAAAAMVAC4WAC8XADABT5wBJQFPogElAxUANRYANhcANwAAAAMVADUWADYXADcBUAAmAVAAJgMVADwWAD0XAD4AAAADFQA8FgA9FwA-AVAAJgFQACYDFQBDFgBEFwBFAAAAAxUAQxYARBcARQECAQIDAQUGAQYHAQcIAQkKAQoMAgsNAwwPAQ0RAg4SBBETARIUARMVAhgYBRkZCR0bCh4mCh8pCiAqCiErCiItCiMvAiQwDiUyCiY0Aic1Dyg2Cik3Cio4Ai07EC48Fi89CzA-CzE_CzJACzNBCzRDCzVFAjZGFzdICzhKAjlLGDpMCztNCzxOAj1RGT5SHT9TDEBUDEFVDEJWDENXDERZDEVbAkZcHkdeDEhgAklhH0piDEtjDExkAk1nIE5oJFRqJVV8JVZ-JVd_JViAASVZggElWoQBAluFAStchwElXYkBAl6KASxfiwElYIwBJWGNAQJikAEtY5EBMWSSASZlkwEmZpQBJmeVASZolgEmaZgBJmqaAQJrmwEybJ4BJm2gAQJuoQEzb6MBJnCkASZxpQECcqgBNHOpATh0qgEndasBJ3asASd3rQEneK4BJ3mwASd6sgECe7MBOXy1ASd9twECfrgBOn-5ASeAAboBJ4EBuwECggG-ATuDAb8BP4QBwAEohQHBASiGAcIBKIcBwwEoiAHEASiJAcYBKIoByAECiwHJAUCMAcsBKI0BzQECjgHOAUGPAc8BKJAB0AEokQHRAQKSAdQBQpMB1QFG"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.js"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.js");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var runtime2 = __toESM(require("@prisma/client/runtime/client"));
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
var PrismaClient = getPrismaClientClass();

// src/config/prisma.ts
var import_adapter_pg = require("@prisma/adapter-pg");
var adapter = new import_adapter_pg.PrismaPg({
  connectionString: process.env.DATABASE_URL
});
var prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : []
});

// src/middleware/auth.ts
var { sign } = import_jsonwebtoken.default;
var generateTokens = (userId) => {
  const accessExpires = parseDurationToSeconds(JWT_EXPIRES_IN);
  const refreshExpires = parseDurationToSeconds(REFRESH_TOKEN_EXPIRES_IN);
  const token = sign({}, SECRET, { subject: userId, expiresIn: accessExpires });
  const refreshToken2 = sign({}, SECRET, {
    subject: userId,
    expiresIn: refreshExpires
  });
  return { token, refreshToken: refreshToken2 };
};
var generateSingleToken = (userId) => {
  const accessExpires = parseDurationToSeconds(JWT_EXPIRES_IN);
  const token = sign({}, SECRET, { subject: userId, expiresIn: accessExpires });
  return { token };
};
var authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const authReq = req;
    if (!authReq.user) {
      unauthorized(res, "Not authenticated");
      return;
    }
    if (!allowedRoles.includes(authReq.user.role)) {
      forbidden(res, "Forbidden");
      return;
    }
    next();
  };
};
var authenticate = async (req, res, next) => {
  const authReq = req;
  const header = authReq.headers.authorization;
  if (!header) {
    unauthorized(res, "Missing auth header");
    return;
  }
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    unauthorized(res, "Invalid authorization format");
    return;
  }
  try {
    const payload = import_jsonwebtoken.default.verify(token, SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { role: true }
    });
    if (!user) {
      unauthorized(res, "User not found");
      return;
    }
    if (user.deletedAt) {
      await prisma.session.deleteMany({ where: { userId: user.id } });
      unauthorized(res, "User was deleted");
      return;
    }
    const { password, role, ...rest } = user;
    authReq.user = {
      ...rest,
      roleId: role?.id || "",
      role: role?.name || ""
    };
    return next();
  } catch (e) {
    unauthorized(res, "Invalid or expired token");
    return;
  }
};
var hashPassword = (raw2) => import_bcrypt.default.hash(raw2, 12);
var comparePassword = (raw2, hash) => import_bcrypt.default.compare(raw2, hash);

// src/modules/auth/auth.service.ts
var import_crypto = require("crypto");

// src/utils/mailer.ts
var import_nodemailer = __toESM(require("nodemailer"));
var import_ejs = __toESM(require("ejs"));
var import_path = __toESM(require("path"));
var transport = import_nodemailer.default.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS }
});
var OTP_TEMPLATE = import_path.default.join(process.cwd(), "src/templates/otp-email.ejs");
async function sendOtpEmail(email, code, expiresInMinutes) {
  const html = await import_ejs.default.renderFile(OTP_TEMPLATE, { code, expiresInMinutes });
  await transport.sendMail({
    from: `"Faiz's Portfolio" <${SMTP_FROM}>`,
    to: email,
    subject: `${code} is your sign-in code`,
    text: `Your OTP code is: ${code}

This code expires in ${expiresInMinutes} minutes. Do not share it with anyone.`,
    html
  });
}

// src/modules/auth/auth.service.ts
var OTP_EXPIRES_SECONDS = parseDurationToSeconds(OTP_EXPIRES_IN);
var OTP_EXPIRES_MINUTES = Math.round(OTP_EXPIRES_SECONDS / 60);
async function issueOtp(email) {
  const code = (0, import_crypto.randomInt)(1e5, 999999).toString();
  await prisma.otpCode.deleteMany({ where: { email, usedAt: null } });
  await prisma.otpCode.create({
    data: {
      email,
      code,
      expiresAt: new Date(Date.now() + OTP_EXPIRES_SECONDS * 1e3)
    }
  });
  await sendOtpEmail(email, code, OTP_EXPIRES_MINUTES);
}
async function authenticateUser(identifier, password, ip, userAgent) {
  const input = identifier.toLowerCase();
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: input }, { username: input }]
    }
  });
  if (!user || !user.password) {
    throw httpError(401, "Invalid credentials");
  }
  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw httpError(401, "Invalid credentials");
  }
  await prisma.loginLog.create({
    data: { userId: user.id, ip, userAgent }
  });
  await issueOtp(user.email);
  return { email: user.email };
}
async function createSession(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true }
  });
  if (!user) throw httpError(404, "User not found");
  await prisma.session.deleteMany({ where: { userId } });
  const tokens = generateTokens(userId);
  const expiresMs = parseDurationToSeconds(REFRESH_TOKEN_EXPIRES_IN) * 1e3;
  await prisma.session.create({
    data: {
      userId,
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(Date.now() + expiresMs)
    }
  });
  return {
    token: tokens.token,
    refreshToken: tokens.refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role?.name ?? null,
      lastLoginAt: user.lastLoginAt || void 0,
      createdAt: user.createdAt
    }
  };
}
async function refreshToken(oldRefresh) {
  const session = await prisma.session.findFirst({
    where: { refreshToken: oldRefresh }
  });
  if (!session) {
    throw httpError(401, "Invalid refresh token");
  }
  const now = /* @__PURE__ */ new Date();
  const expiresAt = new Date(session.expiresAt);
  if (expiresAt.getTime() <= now.getTime()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {
    });
    throw httpError(401, "Session expired");
  }
  const ONE_DAY_MS = 24 * 60 * 60 * 1e3;
  const msLeft = expiresAt.getTime() - now.getTime();
  if (msLeft <= ONE_DAY_MS) {
    const tokens = generateTokens(session.userId);
    const refreshMs = parseDurationToSeconds(REFRESH_TOKEN_EXPIRES_IN) * 1e3;
    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(now.getTime() + refreshMs)
      }
    });
    return tokens;
  }
  const { token } = generateSingleToken(session.userId);
  return { token, refreshToken: oldRefresh };
}
async function logout(userId) {
  await prisma.session.deleteMany({ where: { userId } });
}
async function requestOtp(email) {
  const normalized = email.toLowerCase();
  const user = await prisma.user.findFirst({
    where: { email: normalized, deletedAt: null }
  });
  if (!user) throw httpError(404, "No account found with this email");
  const recentOtp = await prisma.otpCode.findFirst({
    where: {
      email: normalized,
      usedAt: null,
      createdAt: { gte: new Date(Date.now() - 6e4) }
    }
  });
  if (recentOtp) {
    throw httpError(429, "Please wait 60 seconds before requesting another OTP");
  }
  await issueOtp(normalized);
}
async function verifyOtp(email, code) {
  const normalized = email.toLowerCase();
  const otp = await prisma.otpCode.findFirst({
    where: { email: normalized, usedAt: null },
    orderBy: { createdAt: "desc" }
  });
  if (!otp) throw httpError(400, "No active OTP found for this email");
  if (/* @__PURE__ */ new Date() > otp.expiresAt) {
    await prisma.otpCode.delete({ where: { id: otp.id } }).catch(() => {
    });
    throw httpError(400, "OTP has expired, please request a new one");
  }
  if (otp.code !== code) throw httpError(400, "Invalid OTP code");
  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { usedAt: /* @__PURE__ */ new Date() }
  });
  const user = await prisma.user.findFirst({
    where: { email: normalized, deletedAt: null }
  });
  if (!user) throw httpError(404, "No account found with this email");
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: /* @__PURE__ */ new Date() }
  });
  return createSession(user.id);
}

// src/modules/auth/auth.dto.ts
var import_joi = __toESM(require("joi"));
var loginRequestSchema = import_joi.default.object({
  identifier: import_joi.default.string().required().messages({
    "string.empty": "Identifier cannot be empty.",
    "any.required": "Email or username is required."
  }),
  password: import_joi.default.string().required().messages({
    "string.empty": "Password cannot be empty.",
    "any.required": "Password is required."
  })
});
var refreshSchema = import_joi.default.object({
  refreshToken: import_joi.default.string().required().messages({
    "string.empty": "Refresh token cannot be empty.",
    "any.required": "Refresh token is required."
  })
});
var otpRequestSchema = import_joi.default.object({
  email: import_joi.default.string().email().required().messages({
    "string.email": "Invalid email format.",
    "any.required": "Email is required."
  })
});
var otpVerifySchema = import_joi.default.object({
  email: import_joi.default.string().email().required().messages({
    "string.email": "Invalid email format.",
    "any.required": "Email is required."
  }),
  code: import_joi.default.string().length(6).pattern(/^\d+$/).required().messages({
    "string.length": "OTP must be exactly 6 digits.",
    "string.pattern.base": "OTP must contain only digits.",
    "any.required": "OTP code is required."
  })
});
var loginRequestResponseSchema = import_joi.default.object({
  email: import_joi.default.string().email().description("Masked email address (e.g. us***@domain.com)")
});
var verifyOtpResponseSchema = import_joi.default.object({
  token: import_joi.default.string(),
  refreshToken: import_joi.default.string(),
  user: import_joi.default.object({
    id: import_joi.default.string().uuid(),
    username: import_joi.default.string(),
    email: import_joi.default.string().email(),
    role: import_joi.default.string().allow(null),
    lastLoginAt: import_joi.default.date().allow(null),
    createdAt: import_joi.default.date()
  })
});
var refreshResponseSchema = import_joi.default.object({
  token: import_joi.default.string(),
  refreshToken: import_joi.default.string()
});

// src/modules/auth/auth.controller.ts
var loginRequest = async (req, res) => {
  const { error, value } = loginRequestSchema.validate(req.body);
  if (error) {
    badRequest(res, error.details[0].message);
    return;
  }
  const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.socket.remoteAddress || "unknown";
  const userAgent = req.headers["user-agent"];
  const payload = await authenticateUser(
    value.identifier,
    value.password,
    ip,
    userAgent
  );
  ok(res, "OTP sent to your email address", payload);
};
var refresh = async (req, res) => {
  const { error, value } = refreshSchema.validate(req.body);
  if (error) {
    badRequest(res, error.details[0].message);
    return;
  }
  const tokens = await refreshToken(value.refreshToken);
  ok(res, "Token refreshed", tokens);
};
var logout2 = async (req, res) => {
  const uid = req.user.id;
  await logout(uid);
  ok(res, "Logged out successfully");
};
var requestOtp2 = async (req, res) => {
  const { error, value } = otpRequestSchema.validate(req.body);
  if (error) {
    badRequest(res, error.details[0].message);
    return;
  }
  await requestOtp(value.email);
  ok(res, "OTP resent to your email address");
};
var verifyOtp2 = async (req, res) => {
  const { error, value } = otpVerifySchema.validate(req.body);
  if (error) {
    badRequest(res, error.details[0].message);
    return;
  }
  const payload = await verifyOtp(value.email, value.code);
  ok(res, "Sign-in successful", payload);
};

// src/modules/auth/auth.route.ts
var import_express = require("express");

// src/utils/wrap-router.ts
function wrapRouter(router6) {
  router6.stack.forEach((layer) => {
    if (!layer.route) return;
    layer.route.stack.forEach((handleLayer) => {
      const orig = handleLayer.handle;
      if (orig.length === 3 || orig.length === 4) {
        handleLayer.handle = (req, res, next) => {
          Promise.resolve(orig(req, res, next)).catch(next);
        };
      }
    });
  });
  return router6;
}

// src/modules/auth/auth.route.ts
var router = (0, import_express.Router)();
router.post("/login", loginRequest);
router.post("/otp/request", requestOtp2);
router.post("/otp/verify", verifyOtp2);
router.post("/refresh", refresh);
router.use(authenticate);
router.post("/logout", logout2);
var auth_route_default = wrapRouter(router);

// src/config/register-module.ts
var import_fs = __toESM(require("fs"));

// src/modules/health/health.route.ts
var import_express2 = require("express");
var router2 = (0, import_express2.Router)();
router2.get(
  "/",
  (_, res) => {
    res.json({
      status: "ok",
      uptime: Math.floor(process.uptime()),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
);
var health_route_default = router2;

// src/config/register-module.ts
var import_path2 = __toESM(require("path"));

// src/modules/project/project.route.ts
var import_express3 = require("express");

// src/modules/project/project.service.ts
var projectSelect = {
  id: true,
  position: true,
  title: true,
  category: true,
  type: true,
  year: true,
  createdAt: true,
  modifiedAt: true,
  texts: {
    select: { id: true, type: true, content: true },
    orderBy: { createdAt: "asc" }
  },
  images: {
    select: { id: true, type: true, orientation: true, imageUrl: true },
    orderBy: { createdAt: "asc" }
  }
};
async function getAllProjects() {
  return prisma.project.findMany({
    where: { deletedAt: null },
    select: projectSelect,
    orderBy: { position: "asc" }
  });
}
async function getProjectById(id) {
  const project = await prisma.project.findFirst({
    where: { id, deletedAt: null },
    select: projectSelect
  });
  if (!project) throw httpError(404, "Project not found");
  return project;
}
async function createProject(dto) {
  const existing = await prisma.project.findFirst({ where: { title: dto.title } });
  if (existing) throw httpError(409, "A project with this title already exists");
  return prisma.project.create({
    data: {
      position: dto.position,
      title: dto.title,
      category: dto.category,
      type: dto.type,
      year: dto.year,
      texts: dto.texts?.length ? { create: dto.texts.map((content) => ({ type: "regular", content })) } : void 0,
      images: dto.images?.length ? { create: dto.images.map(({ imageUrl, type, orientation }) => ({ imageUrl, type, orientation })) } : void 0
    },
    select: projectSelect
  });
}
async function updateProject(id, dto) {
  await getProjectById(id);
  return prisma.$transaction(async (tx) => {
    if (dto.texts !== void 0) {
      await tx.projectText.deleteMany({ where: { projectId: id } });
    }
    if (dto.images !== void 0) {
      await tx.projectImage.deleteMany({ where: { projectId: id } });
    }
    return tx.project.update({
      where: { id },
      data: {
        ...dto.position !== void 0 && { position: dto.position },
        ...dto.title !== void 0 && { title: dto.title },
        ...dto.category !== void 0 && { category: dto.category },
        ...dto.type !== void 0 && { type: dto.type },
        ...dto.year !== void 0 && { year: dto.year },
        ...dto.texts !== void 0 && {
          texts: { create: dto.texts.map((content) => ({ type: "regular", content })) }
        },
        ...dto.images !== void 0 && {
          images: { create: dto.images.map(({ imageUrl, type, orientation }) => ({ imageUrl, type, orientation })) }
        }
      },
      select: projectSelect
    });
  });
}
async function deleteProject(id) {
  await getProjectById(id);
  return prisma.project.update({
    where: { id },
    data: { deletedAt: /* @__PURE__ */ new Date() },
    select: { id: true, title: true }
  });
}

// src/modules/project/project.dto.ts
var import_joi2 = __toESM(require("joi"));
var imageSchema = import_joi2.default.object({
  imageUrl: import_joi2.default.string().uri().required(),
  type: import_joi2.default.string().valid("thumbnail", "normal").required(),
  orientation: import_joi2.default.string().valid("landscape", "portrait").required()
});
var createProjectSchema = import_joi2.default.object({
  position: import_joi2.default.number().integer().min(0).required(),
  title: import_joi2.default.string().max(255).required(),
  category: import_joi2.default.string().max(100).required(),
  type: import_joi2.default.string().max(100).required(),
  year: import_joi2.default.string().length(4).pattern(/^\d{4}$/).required(),
  texts: import_joi2.default.array().items(import_joi2.default.string().min(1)).optional(),
  images: import_joi2.default.array().items(imageSchema).optional()
});
var updateProjectSchema = import_joi2.default.object({
  position: import_joi2.default.number().integer().min(0).optional(),
  title: import_joi2.default.string().max(255).optional(),
  category: import_joi2.default.string().max(100).optional(),
  type: import_joi2.default.string().max(100).optional(),
  year: import_joi2.default.string().length(4).pattern(/^\d{4}$/).optional(),
  texts: import_joi2.default.array().items(import_joi2.default.string().min(1)).optional(),
  images: import_joi2.default.array().items(imageSchema).optional()
}).min(1);
var projectTextSchema = import_joi2.default.object({
  id: import_joi2.default.string().uuid(),
  type: import_joi2.default.string().valid("headline", "regular"),
  content: import_joi2.default.string()
});
var projectImageSchema = import_joi2.default.object({
  id: import_joi2.default.string().uuid(),
  type: import_joi2.default.string().valid("thumbnail", "normal"),
  orientation: import_joi2.default.string().valid("landscape", "portrait"),
  imageUrl: import_joi2.default.string().uri()
});
var projectSchema = import_joi2.default.object({
  id: import_joi2.default.string().uuid(),
  position: import_joi2.default.number().integer(),
  title: import_joi2.default.string(),
  category: import_joi2.default.string(),
  type: import_joi2.default.string(),
  year: import_joi2.default.string(),
  createdAt: import_joi2.default.date(),
  modifiedAt: import_joi2.default.date(),
  texts: import_joi2.default.array().items(projectTextSchema),
  images: import_joi2.default.array().items(projectImageSchema)
});
var getAllProjectsResponseSchema = import_joi2.default.array().items(projectSchema);
var deleteProjectResponseSchema = import_joi2.default.object({
  id: import_joi2.default.string().uuid(),
  title: import_joi2.default.string()
});

// src/modules/project/project.controller.ts
async function getAllProjectsHandler(_req, res) {
  const projects = await getAllProjects();
  ok(res, "List of all projects", projects);
}
async function getProjectByIdHandler(req, res) {
  const project = await getProjectById(req.params.id);
  ok(res, "Project retrieved successfully", project);
}
async function createProjectHandler(req, res) {
  const { error, value } = createProjectSchema.validate(req.body);
  if (error) {
    badRequest(res, error.details[0].message);
    return;
  }
  const project = await createProject(value);
  created(res, "Project created successfully", project);
}
async function updateProjectHandler(req, res) {
  const { error, value } = updateProjectSchema.validate(req.body);
  if (error) {
    badRequest(res, error.details[0].message);
    return;
  }
  const project = await updateProject(req.params.id, value);
  ok(res, "Project updated successfully", project);
}
async function deleteProjectHandler(req, res) {
  const project = await deleteProject(req.params.id);
  ok(res, "Project deleted successfully", project);
}

// src/modules/project/project.route.ts
var router3 = (0, import_express3.Router)();
router3.get("/", getAllProjectsHandler);
router3.get("/:id", getProjectByIdHandler);
router3.use(authenticate);
router3.post("/", authorize("ADMIN"), createProjectHandler);
router3.put("/:id", authorize("ADMIN"), updateProjectHandler);
router3.delete("/:id", authorize("ADMIN"), deleteProjectHandler);
var project_route_default = wrapRouter(router3);

// src/modules/role/role.route.ts
var import_express4 = require("express");

// src/utils/pagination.ts
var import_joi3 = __toESM(require("joi"));
var paginationSchema = import_joi3.default.object({
  page: import_joi3.default.number().integer().min(1).default(1),
  limit: import_joi3.default.number().integer().min(1).max(100).default(10)
});
function toPrismaPage(query) {
  return {
    skip: (query.page - 1) * query.limit,
    take: query.limit
  };
}
function paginate(items, total, query) {
  return {
    items,
    meta: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit)
    }
  };
}

// src/modules/role/role.service.ts
var roleSelect = {
  id: true,
  name: true,
  title: true,
  createdAt: true,
  updatedAt: true
};
async function getAllRoles(query) {
  const { skip, take } = toPrismaPage(query);
  const where = {
    deletedAt: null,
    ...query.q ? {
      OR: [
        { name: { contains: query.q, mode: "insensitive" } },
        { title: { contains: query.q, mode: "insensitive" } }
      ]
    } : {}
  };
  const [items, total] = await Promise.all([
    prisma.role.findMany({ where, select: roleSelect, skip, take, orderBy: { name: "asc" } }),
    prisma.role.count({ where })
  ]);
  return paginate(items, total, query);
}
async function getRoleById(id) {
  const role = await prisma.role.findFirst({
    where: { id, deletedAt: null },
    select: roleSelect
  });
  if (!role) throw httpError(404, "Role not found");
  return role;
}
async function createRole(dto) {
  const existing = await prisma.role.findFirst({ where: { name: dto.name } });
  if (existing) throw httpError(409, "A role with this name already exists");
  return prisma.role.create({
    data: { name: dto.name, title: dto.title },
    select: roleSelect
  });
}
async function updateRole(id, dto) {
  await getRoleById(id);
  if (dto.name) {
    const conflict = await prisma.role.findFirst({
      where: { name: dto.name, NOT: { id } }
    });
    if (conflict) throw httpError(409, "A role with this name already exists");
  }
  return prisma.role.update({
    where: { id },
    data: dto,
    select: roleSelect
  });
}
async function deleteRole(id) {
  await getRoleById(id);
  return prisma.role.update({
    where: { id },
    data: { deletedAt: /* @__PURE__ */ new Date() },
    select: { id: true, name: true }
  });
}

// src/modules/role/role.dto.ts
var import_joi4 = __toESM(require("joi"));
var getRolesQuerySchema = paginationSchema.keys({
  q: import_joi4.default.string().trim().optional()
});
var createRoleSchema = import_joi4.default.object({
  name: import_joi4.default.string().max(100).required(),
  title: import_joi4.default.string().max(255).optional()
});
var updateRoleSchema = import_joi4.default.object({
  name: import_joi4.default.string().max(100).optional(),
  title: import_joi4.default.string().max(255).optional()
}).min(1);
var roleSchema = import_joi4.default.object({
  id: import_joi4.default.string().uuid(),
  name: import_joi4.default.string(),
  title: import_joi4.default.string().allow(null),
  createdAt: import_joi4.default.date(),
  updatedAt: import_joi4.default.date()
});
var getAllRolesResponseSchema = import_joi4.default.object({
  items: import_joi4.default.array().items(roleSchema),
  meta: import_joi4.default.object({
    total: import_joi4.default.number().integer(),
    page: import_joi4.default.number().integer(),
    limit: import_joi4.default.number().integer(),
    totalPages: import_joi4.default.number().integer()
  })
});
var deleteRoleResponseSchema = import_joi4.default.object({
  id: import_joi4.default.string().uuid(),
  name: import_joi4.default.string()
});

// src/modules/role/role.controller.ts
async function getAllRolesHandler(req, res) {
  const { error, value } = getRolesQuerySchema.validate(req.query);
  if (error) {
    badRequest(res, error.details[0].message);
    return;
  }
  const result = await getAllRoles(value);
  ok(res, "List of all roles", result);
}
async function getRoleByIdHandler(req, res) {
  const role = await getRoleById(req.params.id);
  ok(res, "Role retrieved successfully", role);
}
async function createRoleHandler(req, res) {
  const { error, value } = createRoleSchema.validate(req.body);
  if (error) {
    badRequest(res, error.details[0].message);
    return;
  }
  const role = await createRole(value);
  created(res, "Role created successfully", role);
}
async function updateRoleHandler(req, res) {
  const { error, value } = updateRoleSchema.validate(req.body);
  if (error) {
    badRequest(res, error.details[0].message);
    return;
  }
  const role = await updateRole(req.params.id, value);
  ok(res, "Role updated successfully", role);
}
async function deleteRoleHandler(req, res) {
  const role = await deleteRole(req.params.id);
  ok(res, "Role deleted successfully", role);
}

// src/modules/role/role.route.ts
var router4 = (0, import_express4.Router)();
router4.get("/", getAllRolesHandler);
router4.use(authenticate);
router4.get("/:id", authorize("ADMIN"), getRoleByIdHandler);
router4.post("/", authorize("ADMIN"), createRoleHandler);
router4.put("/:id", authorize("ADMIN"), updateRoleHandler);
router4.delete("/:id", authorize("ADMIN"), deleteRoleHandler);
var role_route_default = wrapRouter(router4);

// src/config/register-module.ts
var import_swagger_ui_express = __toESM(require("swagger-ui-express"));

// src/modules/user/user.service.ts
var userSelect = {
  id: true,
  email: true,
  username: true,
  role: { select: { id: true, name: true } },
  lastLoginAt: true,
  createdAt: true
};
async function getAllUsers(query) {
  const { skip, take } = toPrismaPage(query);
  const where = {
    deletedAt: null,
    ...query.q ? {
      OR: [
        { email: { contains: query.q, mode: "insensitive" } },
        { username: { contains: query.q, mode: "insensitive" } }
      ]
    } : {},
    ...query.roleId ? { roleId: query.roleId } : {}
  };
  const [items, total] = await Promise.all([
    prisma.user.findMany({ where, select: userSelect, skip, take, orderBy: { createdAt: "desc" } }),
    prisma.user.count({ where })
  ]);
  return paginate(items, total, query);
}
async function getUserById(id) {
  const user = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: userSelect
  });
  if (!user) throw httpError(404, "User not found");
  return user;
}
async function createUser(dto) {
  const existing = await prisma.user.findFirst({
    where: { email: dto.email }
  });
  if (existing) throw httpError(409, "Email already in use");
  const hashed = await hashPassword(dto.password);
  return prisma.user.create({
    data: {
      email: dto.email,
      username: dto.username,
      password: hashed,
      roleId: dto.roleId
    },
    select: userSelect
  });
}
async function updateUser(id, dto) {
  await getUserById(id);
  const data = { ...dto };
  if (dto.password) {
    data.password = await hashPassword(dto.password);
  }
  return prisma.user.update({
    where: { id },
    data,
    select: userSelect
  });
}
async function deleteUser(id) {
  await getUserById(id);
  return prisma.user.update({
    where: { id },
    data: { deletedAt: /* @__PURE__ */ new Date() },
    select: { id: true, email: true, username: true }
  });
}

// src/modules/user/user.dto.ts
var import_joi5 = __toESM(require("joi"));
var createUserSchema = import_joi5.default.object({
  email: import_joi5.default.string().email().required().messages({
    "string.email": "Invalid email format.",
    "any.required": "Email is required."
  }),
  username: import_joi5.default.string().max(255).required().messages({
    "string.empty": "Username cannot be empty.",
    "any.required": "Username is required."
  }),
  password: import_joi5.default.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters.",
    "string.empty": "Password cannot be empty.",
    "any.required": "Password is required."
  }),
  roleId: import_joi5.default.string().optional()
});
var getUsersQuerySchema = paginationSchema.keys({
  q: import_joi5.default.string().trim().optional(),
  roleId: import_joi5.default.string().uuid().optional()
});
var updateUserSchema = import_joi5.default.object({
  email: import_joi5.default.string().email().optional().messages({
    "string.email": "Invalid email format."
  }),
  username: import_joi5.default.string().max(255).optional().messages({
    "string.empty": "Username cannot be empty."
  }),
  password: import_joi5.default.string().min(6).optional().messages({
    "string.min": "Password must be at least 6 characters."
  }),
  roleId: import_joi5.default.string().optional()
}).min(1);
var userSchema = import_joi5.default.object({
  id: import_joi5.default.string().uuid(),
  email: import_joi5.default.string().email(),
  username: import_joi5.default.string(),
  role: import_joi5.default.object({ id: import_joi5.default.string(), name: import_joi5.default.string() }).allow(null),
  lastLoginAt: import_joi5.default.date().allow(null),
  createdAt: import_joi5.default.date()
});
var getAllUsersResponseSchema = import_joi5.default.object({
  items: import_joi5.default.array().items(userSchema),
  meta: import_joi5.default.object({
    total: import_joi5.default.number().integer(),
    page: import_joi5.default.number().integer(),
    limit: import_joi5.default.number().integer(),
    totalPages: import_joi5.default.number().integer()
  })
});
var deleteUserResponseSchema = import_joi5.default.object({
  id: import_joi5.default.string().uuid(),
  email: import_joi5.default.string().email(),
  username: import_joi5.default.string()
});

// src/modules/user/user.controller.ts
async function getAllUsersHandler(req, res) {
  const { error, value } = getUsersQuerySchema.validate(req.query);
  if (error) {
    badRequest(res, error.details[0].message);
    return;
  }
  const result = await getAllUsers(value);
  ok(res, "List of all users", result);
}
async function getUserByIdHandler(req, res) {
  const id = req.params.id;
  const user = await getUserById(id);
  ok(res, "User retrieved successfully", user);
}
async function createUserHandler(req, res) {
  const { error, value } = createUserSchema.validate(req.body);
  if (error) {
    badRequest(res, error.details[0].message);
    return;
  }
  const user = await createUser(value);
  created(res, "User created successfully", user);
}
async function updateUserHandler(req, res) {
  const id = req.params.id;
  const { error, value } = updateUserSchema.validate(req.body);
  if (error) {
    badRequest(res, error.details[0].message);
    return;
  }
  const user = await updateUser(id, value);
  ok(res, "User updated successfully", user);
}
async function deleteUserHandler(req, res) {
  const id = req.params.id;
  const user = await deleteUser(id);
  ok(res, "User deleted successfully", user);
}

// src/modules/user/user.route.ts
var import_express5 = require("express");
var router5 = (0, import_express5.Router)();
router5.get("/", getAllUsersHandler);
router5.use(authenticate);
router5.post("/", authorize("ADMIN"), createUserHandler);
router5.get("/:id", authorize("ADMIN"), getUserByIdHandler);
router5.put("/:id", authorize("ADMIN"), updateUserHandler);
router5.delete("/:id", authorize("ADMIN"), deleteUserHandler);
var user_route_default = wrapRouter(router5);

// src/config/register-module.ts
var swaggerOutputPath = import_path2.default.join(process.cwd(), "src/docs/swagger-output.json");
var register_module_default = (app2) => {
  if (import_fs.default.existsSync(swaggerOutputPath)) {
    const spec = JSON.parse(import_fs.default.readFileSync(swaggerOutputPath, "utf-8"));
    app2.use("/docs", import_swagger_ui_express.default.serve, import_swagger_ui_express.default.setup(spec, {
      customSiteTitle: "Faiz's Portfolio API",
      swaggerOptions: { persistAuthorization: true }
    }));
  } else {
    app2.get(
      "/docs",
      (_, res) => res.send("Run pnp run docs to generate API documentation, then restart the server.")
    );
  }
  app2.use("/health", health_route_default);
  app2.use("/users", user_route_default);
  app2.use("/auth", auth_route_default);
  app2.use("/roles", role_route_default);
  app2.use("/projects", project_route_default);
};

// src/index.ts
var app = (0, import_express6.default)();
app.use(import_express6.default.json());
app.use(cors);
register_module_default(app);
var PORT2 = process.env.PORT || 3e3;
app.listen(PORT2, () => {
  console.log(`Server is running on <http://localhost:${PORT2}> \u{1F680}`);
});
var index_default = app;
