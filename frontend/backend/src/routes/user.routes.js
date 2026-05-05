import { Router } from "express";
import { searchUsers } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";

export const userRoutes = Router();

userRoutes.get("/", requireAuth, requireRole("admin"), searchUsers);
