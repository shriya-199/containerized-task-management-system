import { addDays, toISODate } from './date.js';

export const categories = ['Personal', 'Study', 'Project', 'Health', 'Work', 'Finance'];
export const priorities = ['Low', 'Medium', 'High'];

export const starterTasks = [
  {
    id: 'task-1',
    title: 'Prepare DevOps project presentation',
    description: 'Explain React frontend, Docker containers, CI workflow, and demo flow.',
    category: 'Project',
    priority: 'High',
    status: 'pending',
    important: true,
    dueDate: addDays(1),
    reminderTime: '09:30',
    createdAt: new Date().toISOString(),
    comments: ['Show Docker Desktop containers during demo.']
  },
  {
    id: 'task-2',
    title: 'Revise operating system notes',
    description: 'Read scheduling, deadlock, and memory management topics.',
    category: 'Study',
    priority: 'Medium',
    status: 'pending',
    important: false,
    dueDate: addDays(2),
    reminderTime: '18:00',
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'task-3',
    title: 'Submit DBMS assignment',
    description: 'Complete ER diagram and normalization questions.',
    category: 'Study',
    priority: 'Low',
    status: 'completed',
    important: false,
    dueDate: toISODate(),
    reminderTime: '12:00',
    createdAt: new Date().toISOString(),
    comments: ['Submitted before deadline.']
  }
];

export function makeTask(input) {
  return {
    id: `task-${Date.now()}`,
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category,
    priority: input.priority,
    status: 'pending',
    important: Boolean(input.important),
    dueDate: input.dueDate,
    reminderTime: input.reminderTime,
    createdAt: new Date().toISOString(),
    comments: input.comments || []
  };
}

export function productivityScore(tasks) {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((task) => task.status === 'completed').length / tasks.length) * 100);
}

export function sortTasks(tasks, sortBy) {
  const copy = [...tasks];
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };

  if (sortBy === 'Priority') {
    return copy.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  if (sortBy === 'Alphabetical') {
    return copy.sort((a, b) => a.title.localeCompare(b.title));
  }

  return copy.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}
