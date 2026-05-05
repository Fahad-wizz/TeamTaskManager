import { Filter, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api, queryString } from "../api/client.js";
import { EmptyState } from "../components/EmptyState.jsx";
import { TaskCard } from "../components/TaskCard.jsx";
import { useAuth } from "../state/AuthContext.jsx";
import { statuses, statusLabel } from "../utils/task.js";

const blankTask = {
  title: "",
  description: "",
  projectId: "",
  assignedTo: "",
  dueDate: ""
};

export function TasksPage() {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(blankTask);
  const [filters, setFilters] = useState({ status: "", search: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedProject = useMemo(
    () => projects.find((project) => project._id === form.projectId),
    [projects, form.projectId]
  );

  async function loadTasks(nextFilters = filters) {
    const data = await api(`/tasks${queryString(nextFilters)}`);
    setTasks(data.tasks);
  }

  async function loadProjects() {
    const data = await api("/projects");
    setProjects(data.projects);
    if (data.projects[0] && !form.projectId) {
      setForm((current) => ({
        ...current,
        projectId: data.projects[0]._id,
        assignedTo: data.projects[0].members[0]?._id || ""
      }));
    }
  }

  useEffect(() => {
    Promise.all([loadTasks(), loadProjects()]).catch((err) => setError(err.message));
  }, []);

  function updateForm(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "projectId") {
        const project = projects.find((item) => item._id === value);
        next.assignedTo = project?.members[0]?._id || "";
      }
      return next;
    });
  }

  async function createTask(event) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const data = await api("/tasks", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setTasks((current) => [data.task, ...current]);
      setForm((current) => ({
        ...blankTask,
        projectId: current.projectId,
        assignedTo: current.assignedTo
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(taskId, status) {
    setError("");
    try {
      const data = await api(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      setTasks((current) => current.map((task) => (task._id === taskId ? data.task : task)));
    } catch (err) {
      setError(err.message);
    }
  }

  function applyFilter(field, value) {
    const next = { ...filters, [field]: value };
    setFilters(next);
    loadTasks(next).catch((err) => setError(err.message));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-950">Tasks</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {isAdmin ? "Create assignments and monitor delivery." : "Update your assigned work."}
        </p>
      </div>

      {error && <p className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}

      {isAdmin && (
        <form onSubmit={createTask} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-zinc-700">Title</span>
              <input
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
                className="h-11 w-full rounded-lg border border-zinc-300 px-3 outline-none focus:border-zinc-950"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-zinc-700">Due date</span>
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) => updateForm("dueDate", event.target.value)}
                className="h-11 w-full rounded-lg border border-zinc-300 px-3 outline-none focus:border-zinc-950"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-zinc-700">Project</span>
              <select
                value={form.projectId}
                onChange={(event) => updateForm("projectId", event.target.value)}
                className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 outline-none focus:border-zinc-950"
                required
              >
                <option value="" disabled>Select project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>{project.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-zinc-700">Assignee</span>
              <select
                value={form.assignedTo}
                onChange={(event) => updateForm("assignedTo", event.target.value)}
                className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 outline-none focus:border-zinc-950"
                required
              >
                <option value="" disabled>Select member</option>
                {(selectedProject?.members || []).map((member) => (
                  <option key={member._id} value={member._id}>{member.name} - {member.email}</option>
                ))}
              </select>
            </label>
            <label className="block lg:col-span-2">
              <span className="mb-1 block text-sm font-medium text-zinc-700">Description</span>
              <textarea
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
                className="min-h-24 w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-950"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={saving || !projects.length}
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Plus className="h-4 w-4" />
            Create task
          </button>
        </form>
      )}

      <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[220px_1fr]">
          <label className="block">
            <span className="mb-1 flex items-center gap-1 text-sm font-medium text-zinc-700">
              <Filter className="h-4 w-4" />
              Status
            </span>
            <select
              value={filters.status}
              onChange={(event) => applyFilter("status", event.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950"
            >
              <option value="">All statuses</option>
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 flex items-center gap-1 text-sm font-medium text-zinc-700">
              <Search className="h-4 w-4" />
              Search
            </span>
            <input
              value={filters.search}
              onChange={(event) => applyFilter("search", event.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
              placeholder="Task title"
            />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        {tasks.length ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              actions={
                <select
                  value={task.status}
                  onChange={(event) => updateStatus(task._id, event.target.value)}
                  className="h-10 min-w-36 rounded-lg border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-700 outline-none focus:border-zinc-950"
                  aria-label={`Update ${task.title} status`}
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>{statusLabel(status.value)}</option>
                  ))}
                </select>
              }
            />
          ))
        ) : (
          <EmptyState title="No matching tasks" detail="Adjust filters or create a task." />
        )}
      </section>
    </div>
  );
}
