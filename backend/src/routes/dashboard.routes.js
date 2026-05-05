import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/", requireAuth, getDashboard);
