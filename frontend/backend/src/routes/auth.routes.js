import { Router } from "express";
import { login, me, signup } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, signupSchema } from "../validators/auth.validators.js";

export const authRoutes = Router();

authRoutes.post("/signup", validate(signupSchema), signup);
authRoutes.post("/login", validate(loginSchema), login);
authRoutes.get("/me", requireAuth, me);
