import { AlertTriangle, CalendarDays, UserRound } from "lucide-react";
import { formatDate, isOverdue } from "../utils/task.js";
import { StatusBadge } from "./StatusBadge.jsx";

export function TaskCard({ task, actions }) {
  const overdue = isOverdue(task);

  return (
    <article
      className={`rounded-lg border bg-white p-4 shadow-sm ${
        overdue ? "border-rose-300 bg-rose-50" : "border-zinc-200"
      }`}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-semibold text-zinc-950">{task.title}</h3>
            <StatusBadge status={task.status} />
            {overdue && (
              <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-white px-2 py-1 text-xs font-semibold text-rose-700">
                <AlertTriangle className="h-3.5 w-3.5" />
                Overdue
              </span>
            )}
          </div>
          {task.description && <p className="mt-2 line-clamp-2 text-sm text-zinc-600">{task.description}</p>}
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-zinc-500">
            <span>{task.projectId?.name || "Project"}</span>
            <span className="inline-flex items-center gap-1">
              <UserRound className="h-4 w-4" />
              {task.assignedTo?.name || "Unassigned"}
            </span>
            <span className={`inline-flex items-center gap-1 ${overdue ? "font-semibold text-rose-700" : ""}`}>
              <CalendarDays className="h-4 w-4" />
              {formatDate(task.dueDate)}
            </span>
          </div>
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </article>
  );
}
