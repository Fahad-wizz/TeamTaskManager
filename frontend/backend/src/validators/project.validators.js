import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120)
  })
});

export const addMemberSchema = z.object({
  body: z.object({
    projectId: objectId,
    email: z.string().trim().email().toLowerCase().optional(),
    userId: objectId.optional()
  }).refine((body) => body.email || body.userId, {
    message: "email or userId is required"
  })
});

export const removeMemberSchema = z.object({
  params: z.object({
    projectId: objectId,
    userId: objectId
  })
});
