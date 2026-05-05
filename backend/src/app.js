import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { authRoutes } from "./routes/auth.routes.js";
import { dashboardRoutes } from "./routes/dashboard.routes.js";
import { projectRoutes } from "./routes/project.routes.js";
import { taskRoutes } from "./routes/task.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { getDbStatus } from "./config/db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiPrefixes = ["/auth", "/projects", "/tasks", "/dashboard", "/users", "/health"];

function isApiPath(path) {
  return apiPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

function attachFrontend(app) {
  const frontendDist =
    process.env.FRONTEND_DIST || resolve(__dirname, "../../frontend/dist");

  if (!existsSync(frontendDist)) return;

  app.use(express.static(frontendDist));
  app.get("*", (req, res, next) => {
    if (isApiPath(req.path)) return next();
    res.sendFile(join(frontendDist, "index.html"));
  });
}

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN?.split(",") || "http://localhost:5173",
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "team-task-manager-api",
      database: getDbStatus()
    });
  });

  app.use(
    "/auth",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 80,
      standardHeaders: true,
      legacyHeaders: false
    }),
    authRoutes
  );

  app.use("/projects", projectRoutes);
  app.use("/tasks", taskRoutes);
  app.use("/dashboard", dashboardRoutes);
  app.use("/users", userRoutes);

  attachFrontend(app);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
