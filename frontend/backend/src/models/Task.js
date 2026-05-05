import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 160,
      index: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1200,
      default: ""
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
      index: true
    },
    dueDate: {
      type: Date,
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

taskSchema.index({ title: "text", description: "text" });

export const Task = mongoose.model("Task", taskSchema);
