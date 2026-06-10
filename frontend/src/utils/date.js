export function toISODate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function formatDate(value) {
  if (!value) return 'No due date';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(`${value}T00:00:00`));
}

export function isOverdue(task) {
  if (!task?.dueDate || task.status === 'completed') return false;
  return task.dueDate < toISODate();
}
