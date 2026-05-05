import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  let scope = {};

  if (req.user.role === "admin") {
    const projects = await Project.find({ createdBy: req.user._id }).select("_id");
    scope = { projectId: { $in: projects.map((project) => project._id) } };
  } else {
    scope = { assignedTo: req.user._id };
  }

  const [totalTasks, completedTasks, pendingTasks, overdueTasks, myTasks] = await Promise.all([
    Task.countDocuments(scope),
    Task.countDocuments({ ...scope, status: "done" }),
    Task.countDocuments({ ...scope, status: { $ne: "done" } }),
    Task.countDocuments({ ...scope, status: { $ne: "done" }, dueDate: { $lt: now } }),
    Task.find(scope)
      .populate([
        { path: "projectId", select: "name" },
        { path: "assignedTo", select: "name email role" }
      ])
      .sort({ dueDate: 1 })
      .limit(8)
  ]);

  res.json({
    stats: {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks
    },
    myTasks
  });
});
