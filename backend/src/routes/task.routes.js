import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTaskStatus
} from "../controllers/task.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import {
  createTaskSchema,
  getTasksSchema,
  updateTaskSchema
} from "../validators/task.validators.js";

export const taskRoutes = Router();

taskRoutes.use(requireAuth);
taskRoutes.get("/", validate(getTasksSchema), getTasks);
taskRoutes.post("/", requireRole("admin"), validate(createTaskSchema), createTask);
taskRoutes.patch("/:id", validate(updateTaskSchema), updateTaskStatus);
