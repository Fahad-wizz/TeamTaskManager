import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { authRoutes } from "./routes/auth.routes.js";
import { dashboardRoutes } from "./routes/dashboard.routes.js";
import { projectRoutes } from "./routes/project.routes.js";
import { taskRoutes } from "./routes/task.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import { errorHandler, notFound } from "./middleware/error.js";

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
    res.json({ status: "ok", service: "team-task-manager-api" });
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

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
