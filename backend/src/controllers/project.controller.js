import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

const projectPopulate = [
  { path: "createdBy", select: "name email role" },
  { path: "members", select: "name email role" }
];

export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({
    name: req.validated.body.name,
    createdBy: req.user._id,
    members: [req.user._id]
  });

  await project.populate(projectPopulate);
  res.status(201).json({ project });
});

export const getProjects = asyncHandler(async (req, res) => {
  const accessFilter =
    req.user.role === "admin"
      ? { $or: [{ createdBy: req.user._id }, { members: req.user._id }] }
      : { members: req.user._id };

  const projects = await Project.find(accessFilter)
    .populate(projectPopulate)
    .sort({ updatedAt: -1 });

  res.json({ projects });
});

export const addMember = asyncHandler(async (req, res) => {
  const { projectId, email, userId } = req.validated.body;
  const project = await Project.findOne({ _id: projectId, createdBy: req.user._id });

  if (!project) {
    throw new HttpError(404, "Project not found or not owned by you");
  }

  const member = userId ? await User.findById(userId) : await User.findOne({ email });

  if (!member) {
    throw new HttpError(404, "User not found");
  }

  if (!project.members.some((id) => id.equals(member._id))) {
    project.members.push(member._id);
    await project.save();
  }

  await project.populate(projectPopulate);
  res.json({ project });
});

export const removeMember = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.validated.params;
  const project = await Project.findOne({ _id: projectId, createdBy: req.user._id });

  if (!project) {
    throw new HttpError(404, "Project not found or not owned by you");
  }

  if (project.createdBy.equals(userId)) {
    throw new HttpError(400, "Project owner cannot be removed");
  }

  const openTasks = await Task.countDocuments({
    projectId,
    assignedTo: userId,
    status: { $ne: "done" }
  });

  if (openTasks > 0) {
    throw new HttpError(409, "Complete or reassign this member's open tasks first");
  }

  project.members = project.members.filter((memberId) => !memberId.equals(userId));
  await project.save();
  await project.populate(projectPopulate);

  res.json({ project });
});
