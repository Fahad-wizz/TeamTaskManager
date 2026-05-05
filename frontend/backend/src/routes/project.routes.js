import { Router } from "express";
import {
  addMember,
  createProject,
  getProjects,
  removeMember
} from "../controllers/project.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import {
  addMemberSchema,
  createProjectSchema,
  removeMemberSchema
} from "../validators/project.validators.js";

export const projectRoutes = Router();

projectRoutes.use(requireAuth);
projectRoutes.get("/", getProjects);
projectRoutes.post("/", requireRole("admin"), validate(createProjectSchema), createProject);
projectRoutes.post("/add-member", requireRole("admin"), validate(addMemberSchema), addMember);
projectRoutes.delete(
  "/:projectId/members/:userId",
  requireRole("admin"),
  validate(removeMemberSchema),
  removeMember
);
