import { Application } from "express";
import auth from "@/modules/auth/auth.route";
import fs from "fs";
import healthRoute from "@/modules/health/health.route";
import path from "path";
import projectRoute from "@/modules/project/project.route";
import swaggerUi from "swagger-ui-express";
import userRoute from "@/modules/user/user.route";

const swaggerOutputPath = path.join(process.cwd(), "src/docs/swagger-output.json");

export default (app: Application) => {
  if (fs.existsSync(swaggerOutputPath)) {
    const spec = JSON.parse(fs.readFileSync(swaggerOutputPath, "utf-8"));
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec, {
      customSiteTitle: "Faiz's Portfolio API",
      swaggerOptions: { persistAuthorization: true },
    }));
  } else {
    app.get("/docs", (_, res) =>
      res.send("Run pnp run docs to generate API documentation, then restart the server."),
    );
  }

  app.use("/health", healthRoute);
  app.use("/users", userRoute);
  app.use("/auth", auth);
  app.use("/projects", projectRoute);
};
