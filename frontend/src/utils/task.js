export const statuses = [
  { value: "todo", label: "To do" },
  { value: "in-progress", label: "In progress" },
  { value: "done", label: "Done" }
];

export function statusLabel(status) {
  return statuses.find((item) => item.value === status)?.label || status;
}

export function isOverdue(task) {
  return task.status !== "done" && new Date(task.dueDate) < new Date();
}

export function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));
}
