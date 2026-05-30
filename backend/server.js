const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let tasks = [
  {
    id: 1,
    title: 'Complete DBMS assignment',
    date: new Date().toISOString().slice(0, 10),
    priority: 'High',
    completed: false
  },
  {
    id: 2,
    title: 'Revise operating system notes',
    date: getTomorrow(),
    priority: 'Medium',
    completed: false
  },
  {
    id: 3,
    title: 'Submit DevOps project report',
    date: new Date().toISOString().slice(0, 10),
    priority: 'Low',
    completed: true
  }
];

function getTomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function isValidPriority(priority) {
  return ['Low', 'Medium', 'High'].includes(priority);
}

app.get('/health', (_req, res) => {
  res.status(200).json({
    service: 'daily-task-manager-backend',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/tasks', (_req, res) => {
  res.status(200).json({ data: tasks });
});

app.post('/tasks', (req, res) => {
  const { title, date, priority } = req.body;
  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push('Task title must be at least 3 characters.');
  }

  if (!date) {
    errors.push('Task date is required.');
  }

  if (!isValidPriority(priority)) {
    errors.push('Priority must be Low, Medium, or High.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const task = {
    id: Date.now(),
    title: title.trim(),
    date,
    priority,
    completed: false
  };

  tasks.unshift(task);
  return res.status(201).json({ data: task });
});

app.patch('/tasks/:id/toggle', (req, res) => {
  const taskId = Number(req.params.id);
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  task.completed = !task.completed;
  return res.status(200).json({ data: task });
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const originalLength = tasks.length;

  tasks = tasks.filter((task) => task.id !== taskId);

  if (tasks.length === originalLength) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  return res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} not found.`
  });
});

app.listen(port, () => {
  console.log(`Daily Task Manager backend running on port ${port}`);
});
