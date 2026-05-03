import "dotenv/config";

import fs from "fs";
import j2s from "joi-to-swagger";
import path from "path";

const SRC = path.join(process.cwd(), "src");
const OUTPUT = path.join(SRC, "docs/swagger-output.json");


function resolveSrcPath(importPath: string, fromFile: string): string {
  const abs = importPath.startsWith("@/")
    ? importPath.replace("@/", SRC + "/")
    : path.resolve(path.dirname(fromFile), importPath);
  return abs.endsWith(".ts") ? abs : abs + ".ts";
}

function findFiles(dir: string, suffix: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...findFiles(full, suffix));
    else if (e.name.endsWith(suffix)) out.push(full);
  }
  return out;
}

function isJoiSchema(val: unknown): boolean {
  return (
    val !== null &&
    typeof val === "object" &&
    typeof (val as any).validate === "function" &&
    typeof (val as any).describe === "function"
  );
}

// camelCase → "Readable Words"
function toWords(name: string): string {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/\bhandler\b/gi, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w, i) => (i === 0 ? w[0].toUpperCase() + w.slice(1) : w.toLowerCase()))
    .join(" ");
}

function extractBody(content: string, startIdx: number): string {
  const open = content.indexOf("{", startIdx);
  if (open === -1) return "";
  let depth = 1;
  let i = open + 1;
  let body = "";
  while (i < content.length && depth > 0) {
    if (content[i] === "{") depth++;
    else if (content[i] === "}") depth--;
    if (depth > 0) body += content[i];
    i++;
  }
  return body;
}


interface Mount {
  basePath: string;
  routeFile: string;
}

function parseMounts(): Mount[] {
  const file = path.join(SRC, "config/register-module.ts");
  const src = fs.readFileSync(file, "utf-8");
  const out: Mount[] = [];

  for (const [, basePath, varName] of src.matchAll(
    /app\.use\(\s*["']([^"']+)["']\s*,\s*(\w+)/g,
  )) {
    if (basePath === "/docs") continue;
    const imp = src.match(
      new RegExp(
        `import\\s+(?:\\*\\s+as\\s+)?${varName}\\s+from\\s+["']([^"']+)["']`,
      ),
    );
    if (imp) out.push({ basePath, routeFile: resolveSrcPath(imp[1], file) });
  }
  return out;
}


interface HandlerInfo {
  requestSchema?: string;
  successCode: number;
}

function parseControllerHandlers(controllerFile: string): Map<string, HandlerInfo> {
  const map = new Map<string, HandlerInfo>();
  if (!fs.existsSync(controllerFile)) return map;

  const src = fs.readFileSync(controllerFile, "utf-8");

  for (const m of src.matchAll(
    /(?:export\s+(?:async\s+)?function|export\s+const)\s+(\w+)/g,
  )) {
    const funcName = m[1];
    const body = extractBody(src, m.index! + m[0].length);
    const requestSchema = body.match(/(\w+)\.validate\(\s*req\.body\s*\)/)?.[1];
    const successCode = /\bR\.created\b/.test(body) ? 201 : 200;
    map.set(funcName, { requestSchema, successCode });
  }
  return map;
}


interface ParsedRoute {
  method: string;
  fullPath: string;
  handlerName: string;
  requiresAuth: boolean;
}

const SKIP_TOKENS = new Set([
  "authenticate", "authorize", "wrapRouter", "Router", "router", "use",
]);

const PARAM_TOKENS = new Set(["req", "res", "next", "_", "__", "___"]);

function parseRoutes(mount: Mount): ParsedRoute[] {
  if (!fs.existsSync(mount.routeFile)) return [];

  const src = fs.readFileSync(mount.routeFile, "utf-8").replace(/\/\*[\s\S]*?\*\//g, "");

  const authPos = src.search(/router\.use\(\s*authenticate/);
  const out: ParsedRoute[] = [];

  for (const m of src.matchAll(
    /router\.(get|post|put|delete|patch)\s*\(\s*["']([^"']+)["']/g,
  )) {
    const method = m[1].toUpperCase();
    const routePath = m[2];
    const requiresAuth = authPos !== -1 && m.index! > authPos;

    const openParen = src.indexOf("(", m.index!);
    let depth = 1;
    let i = openParen + 1;
    let body = "";
    while (i < src.length && depth > 0) {
      if (src[i] === "(") depth++;
      else if (src[i] === ")") depth--;
      if (depth > 0) body += src[i];
      i++;
    }

    const bodyForTokens = body.includes("=>") ? body.split("=>")[0] : body;

    const tokens = [...bodyForTokens.matchAll(/\b([A-Za-z_$][\w$]*(?:\.[\w$]+)?)\b/g)]
      .map((t) => t[1])
      .filter((t) => !SKIP_TOKENS.has(t.split(".")[0]) && !PARAM_TOKENS.has(t));

    const lastToken = tokens.length > 0 ? tokens[tokens.length - 1] : "";
    const handlerName = lastToken.includes(".") ? lastToken.split(".")[1] : lastToken;

    const suffix = routePath === "/" ? "" : routePath;
    out.push({
      method,
      fullPath: mount.basePath.replace(/\/$/, "") + suffix,
      handlerName,
      requiresAuth,
    });
  }

  return out;
}

function findControllerFile(routeFile: string): string | null {
  const src = fs.readFileSync(routeFile, "utf-8");
  const m = src.match(/import[^'"]+["']([^'"]*controller[^'"]*)["']/);
  return m ? resolveSrcPath(m[1], routeFile) : null;
}


async function main() {
  const schemaMap = new Map<string, unknown>();
  for (const f of findFiles(path.join(SRC, "modules"), ".dto.ts")) {
    const mod = await import(f);
    for (const [key, val] of Object.entries(mod)) {
      if (isJoiSchema(val)) schemaMap.set(key, val);
    }
  }

  const paths: Record<string, Record<string, unknown>> = {};
  const tagSet = new Set<string>();

  for (const mount of parseMounts()) {
    const ctrlFile = findControllerFile(mount.routeFile);
    const handlerInfoMap = ctrlFile ? parseControllerHandlers(ctrlFile) : new Map<string, HandlerInfo>();

    for (const { method, fullPath, handlerName, requiresAuth } of parseRoutes(mount)) {
      const tagRaw = mount.basePath.split("/").filter(Boolean)[0] ?? "General";
      const tag = tagRaw[0].toUpperCase() + tagRaw.slice(1);
      tagSet.add(tag);

      const handlerInfo = handlerInfoMap.get(handlerName);
      const successCode = handlerInfo?.successCode ?? 200;

      const op: Record<string, unknown> = {
        tags: [tag],
        summary: handlerName ? toWords(handlerName) : `${method} ${fullPath}`,
        responses: {
          [successCode]: { description: successCode === 201 ? "Created" : "Success" },
          400: { description: "Bad request" },
          ...(requiresAuth
            ? { 401: { description: "Unauthorized" }, 403: { description: "Forbidden" } }
            : {}),
        },
      };

      if (requiresAuth) op.security = [{ bearerAuth: [] }];

      const pathParams = [...fullPath.matchAll(/:(\w+)/g)].map((p) => p[1]);
      if (pathParams.length > 0) {
        op.parameters = pathParams.map((name) => ({
          in: "path",
          name,
          required: true,
          schema: { type: "string" },
        }));
      }

      const requestSchemaName = handlerInfo?.requestSchema;
      if (requestSchemaName) {
        const joiSchema = schemaMap.get(requestSchemaName);
        if (joiSchema) {
          const { swagger } = j2s(joiSchema as any);
          op.requestBody = {
            required: true,
            content: { "application/json": { schema: swagger } },
          };
        }
      }

      const base = handlerName.replace(/Handler$/, "");
      const responseJoiSchema = schemaMap.get(`${base}ResponseSchema`);
      if (responseJoiSchema) {
        const { swagger: dataSwagger } = j2s(responseJoiSchema as any);
        (op.responses as any)[successCode] = {
          description: successCode === 201 ? "Created" : "Success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  message: { type: "string" },
                  data: dataSwagger,
                },
              },
            },
          },
        };
      }

      if (!paths[fullPath]) paths[fullPath] = {};
      paths[fullPath][method.toLowerCase()] = op;
    }
  }

  const spec = {
    openapi: "3.0.0",
    info: {
      title: "Faiz's Portfolio API",
      version: "1.0.0",
      description:
        "REST API for Faiz's Portfolio backend",
      contact: { name: "Faiz", email: "agustianto.d19@gmail.com" },
    },
    servers: [{ url: process.env.API_URL || "http://localhost:3000" }],
    tags: [...tagSet].map((name) => ({ name })),
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT access token from POST /auth/otp/verify",
        },
      },
    },
    paths,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(spec, null, 2));
  console.log(`Docs generated → ${OUTPUT}`);
  console.log(`Routes: ${Object.keys(paths).length} paths across ${tagSet.size} tags`);
}

main().catch((e) => {
  console.error("Generation failed:", e.message);
  process.exit(1);
});
