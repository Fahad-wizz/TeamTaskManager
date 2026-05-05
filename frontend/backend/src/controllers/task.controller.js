import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

const taskPopulate = [
  { path: "projectId", select: "name createdBy members" },
  { path: "assignedTo", select: "name email role" }
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getOwnedProjectIds(userId) {
  const projects = await Project.find({ createdBy: userId }).select("_id");
  return projects.map((project) => project._id);
}

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, projectId, assignedTo, dueDate } = req.validated.body;
  const project = await Project.findOne({ _id: projectId, createdBy: req.user._id });

  if (!project) {
    throw new HttpError(404, "Project not found or not owned by you");
  }

  if (!project.members.some((memberId) => memberId.equals(assignedTo))) {
    throw new HttpError(400, "Assigned user must be a project member");
  }

  const assignee = await User.findById(assignedTo);

  if (!assignee) {
    throw new HttpError(404, "Assigned user not found");
  }

  const task = await Task.create({
    title,
    description,
    projectId,
    assignedTo,
    dueDate
  });

  await task.populate(taskPopulate);
  res.status(201).json({ task });
});

export const getTasks = asyncHandler(async (req, res) => {
  const { assignedTo, projectId, status, search } = req.validated.query;
  const filter = {};

  if (req.user.role === "admin") {
    const ownedProjectIds = await getOwnedProjectIds(req.user._id);
    filter.projectId = projectId ? projectId : { $in: ownedProjectIds };

    if (projectId && !ownedProjectIds.some((id) => id.equals(projectId))) {
      throw new HttpError(403, "You can only view tasks in projects you own");
    }

    if (assignedTo) filter.assignedTo = assignedTo;
  } else {
    filter.assignedTo = req.user._id;
    if (projectId) {
      const project = await Project.findOne({ _id: projectId, members: req.user._id });
      if (!project) throw new HttpError(403, "You can only view tasks in your projects");
      filter.projectId = projectId;
    }
  }

  if (status) filter.status = status;

  if (search) {
    filter.title = { $regex: escapeRegex(search), $options: "i" };
  }

  const tasks = await Task.find(filter)
    .populate(taskPopulate)
    .sort({ dueDate: 1, createdAt: -1 });

  res.json({ tasks });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const { status } = req.validated.body;
  const task = await Task.findById(id);

  if (!task) {
    throw new HttpError(404, "Task not found");
  }

  if (req.user.role === "member" && !task.assignedTo.equals(req.user._id)) {
    throw new HttpError(403, "Members can only update tasks assigned to them");
  }

  if (req.user.role === "admin") {
    const project = await Project.findOne({ _id: task.projectId, createdBy: req.user._id });
    if (!project) throw new HttpError(403, "You can only update tasks in projects you own");
  }

  task.status = status;
  await task.save();
  await task.populate(taskPopulate);

  res.json({ task });
});
