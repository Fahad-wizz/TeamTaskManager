import { Plus, Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { EmptyState } from "../components/EmptyState.jsx";
import { useAuth } from "../state/AuthContext.jsx";

export function ProjectsPage() {
  const { isAdmin, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [memberEmailByProject, setMemberEmailByProject] = useState({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadProjects() {
    const data = await api("/projects");
    setProjects(data.projects);
  }

  useEffect(() => {
    loadProjects().catch((err) => setError(err.message));
  }, []);

  async function createProject(event) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const data = await api("/projects", {
        method: "POST",
        body: JSON.stringify({ name })
      });
      setProjects((current) => [data.project, ...current]);
      setName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function addMember(projectId) {
    const email = memberEmailByProject[projectId]?.trim();
    if (!email) return;

    setError("");
    try {
      const data = await api("/projects/add-member", {
        method: "POST",
        body: JSON.stringify({ projectId, email })
      });
      setProjects((current) => current.map((project) => (project._id === projectId ? data.project : project)));
      setMemberEmailByProject((current) => ({ ...current, [projectId]: "" }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeMember(projectId, memberId) {
    setError("");
    try {
      const data = await api(`/projects/${projectId}/members/${memberId}`, { method: "DELETE" });
      setProjects((current) => current.map((project) => (project._id === projectId ? data.project : project)));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-950">Projects</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {isAdmin ? "Create workspaces and manage membership." : "Projects you are part of."}
        </p>
      </div>

      {error && <p className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}

      {isAdmin && (
        <form onSubmit={createProject} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-700">Project name</span>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-11 flex-1 rounded-lg border border-zinc-300 px-3 outline-none focus:border-zinc-950"
                placeholder="Mobile launch"
                required
              />
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-70"
              >
                <Plus className="h-4 w-4" />
                Create
              </button>
            </div>
          </label>
        </form>
      )}

      <section className="grid gap-4 xl:grid-cols-2">
        {projects.length ? (
          projects.map((project) => {
            const ownsProject = String(project.createdBy?._id) === String(user._id);

            return (
              <article key={project._id} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-950">{project.name}</h2>
                    <p className="mt-1 text-sm text-zinc-500">Owner: {project.createdBy?.name || "Admin"}</p>
                  </div>
                  <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-semibold text-zinc-600">
                    {project.members.length} members
                  </span>
                </div>

                {isAdmin && ownsProject && (
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <input
                      value={memberEmailByProject[project._id] || ""}
                      onChange={(event) =>
                        setMemberEmailByProject((current) => ({
                          ...current,
                          [project._id]: event.target.value
                        }))
                      }
                      className="h-10 flex-1 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
                      placeholder="member@company.com"
                    />
                    <button
                      type="button"
                      onClick={() => addMember(project._id)}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
                    >
                      <UserPlus className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.members.map((member) => (
                    <span
                      key={member._id}
                      className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-sm text-zinc-700"
                    >
                      {member.name}
                      <span className="text-xs text-zinc-400">{member.role}</span>
                      {isAdmin && ownsProject && String(member._id) !== String(project.createdBy?._id) && (
                        <button
                          type="button"
                          onClick={() => removeMember(project._id, member._id)}
                          className="rounded-md p-1 text-zinc-400 hover:bg-rose-50 hover:text-rose-600"
                          aria-label={`Remove ${member.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </article>
            );
          })
        ) : (
          <div className="xl:col-span-2">
            <EmptyState title="No projects found" detail={isAdmin ? "Create the first project to start assigning tasks." : "Ask an admin to add you to a project."} />
          </div>
        )}
      </section>
    </div>
  );
}
