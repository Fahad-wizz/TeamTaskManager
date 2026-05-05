import { AlertTriangle, CheckCircle2, Clock3, ListChecks } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { EmptyState } from "../components/EmptyState.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { TaskCard } from "../components/TaskCard.jsx";

export function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/dashboard")
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</p>;
  if (!data) return <p className="text-zinc-600">Loading dashboard...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-950">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">Your current delivery picture.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ListChecks} label="Total tasks" value={data.stats.totalTasks} />
        <StatCard icon={CheckCircle2} label="Completed" value={data.stats.completedTasks} tone="emerald" />
        <StatCard icon={Clock3} label="Pending" value={data.stats.pendingTasks} tone="amber" />
        <StatCard icon={AlertTriangle} label="Overdue" value={data.stats.overdueTasks} tone="rose" />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-950">My tasks</h2>
        </div>
        <div className="space-y-3">
          {data.myTasks.length ? (
            data.myTasks.map((task) => <TaskCard key={task._id} task={task} />)
          ) : (
            <EmptyState title="No tasks yet" detail="Assigned work will appear here." />
          )}
        </div>
      </section>
    </div>
  );
}
