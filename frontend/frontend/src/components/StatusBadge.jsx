import { statusLabel } from "../utils/task.js";

const styles = {
  todo: "border-amber-200 bg-amber-50 text-amber-800",
  "in-progress": "border-indigo-200 bg-indigo-50 text-indigo-800",
  done: "border-emerald-200 bg-emerald-50 text-emerald-800"
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold ${styles[status]}`}>
      {statusLabel(status)}
    </span>
  );
}
