import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");
const status = z.enum(["todo", "in-progress", "done"]);
const dueDate = z.coerce.date().refine((date) => !Number.isNaN(date.getTime()), "Invalid due date");

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(160),
    description: z.string().trim().max(1200).optional().default(""),
    projectId: objectId,
    assignedTo: objectId,
    dueDate
  })
});

export const getTasksSchema = z.object({
  query: z.object({
    assignedTo: objectId.optional(),
    projectId: objectId.optional(),
    status: status.optional(),
    search: z.string().trim().max(120).optional()
  })
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: objectId
  }),
  body: z.object({
    status
  })
});
