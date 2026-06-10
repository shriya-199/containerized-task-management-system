const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const dataDir = path.join(__dirname, 'data');
const databaseFile = path.join(dataDir, 'tasks.json');

app.use(cors());
app.use(express.json());

function getTomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function sampleTasks() {
  return [
    {
      id: 1,
      title: 'Complete DBMS assignment',
      description: 'Finish ER diagram and normalization questions.',
      date: new Date().toISOString().slice(0, 10),
      priority: 'High',
      category: 'Study',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Revise operating system notes',
      description: 'Revise process scheduling and deadlock topics.',
      date: getTomorrow(),
      priority: 'Medium',
      category: 'Study',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Submit DevOps project report',
      description: 'Prepare screenshots, commands, and project explanation.',
      date: new Date().toISOString().slice(0, 10),
      priority: 'Low',
      category: 'Project',
      completed: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

function ensureDatabase() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(databaseFile)) {
    fs.writeFileSync(databaseFile, JSON.stringify(sampleTasks(), null, 2));
  }
}

function readTasks() {
  ensureDatabase();
  return JSON.parse(fs.readFileSync(databaseFile, 'utf8'));
}

function writeTasks(tasks) {
  ensureDatabase();
  fs.writeFileSync(databaseFile, JSON.stringify(tasks, null, 2));
}

function isValidPriority(priority) {
  return ['Low', 'Medium', 'High'].includes(priority);
}

function normalizeTask(task) {
  const now = new Date().toISOString();

  return {
    id: Number(task.id),
    title: String(task.title || '').trim(),
    description: String(task.description || '').trim(),
    date: task.date || '',
    priority: task.priority || 'Medium',
    category: task.category || 'Personal',
    completed: Boolean(task.completed),
    createdAt: task.createdAt || now,
    updatedAt: task.updatedAt || now
  };
}

function validateTaskInput({ title, date, priority }) {
  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push('Task title must be at least 3 characters.');
  }

  if (!date) {
    errors.push('Task deadline is required.');
  }

  if (!isValidPriority(priority)) {
    errors.push('Priority must be Low, Medium, or High.');
  }

  return errors;
}

app.get('/health', (_req, res) => {
  res.status(200).json({
    service: 'daily-task-manager-backend',
    status: 'healthy',
    database: 'json-file',
    timestamp: new Date().toISOString()
  });
});

app.get('/tasks', (_req, res) => {
  const tasks = readTasks().map(normalizeTask);
  res.status(200).json({ data: tasks });
});

app.post('/tasks', (req, res) => {
  const { title, description, date, priority, category } = req.body;
  const errors = validateTaskInput({ title, date, priority });

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const tasks = readTasks().map(normalizeTask);
  const now = new Date().toISOString();
  const task = {
    id: Date.now(),
    title: title.trim(),
    description: String(description || '').trim(),
    date,
    priority,
    category: category || 'Personal',
    completed: false,
    createdAt: now,
    updatedAt: now
  };

  tasks.unshift(task);
  writeTasks(tasks);
  return res.status(201).json({ data: task });
});

app.put('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const { title, description, date, priority, category } = req.body;
  const errors = validateTaskInput({ title, date, priority });

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const tasks = readTasks().map(normalizeTask);
  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  const updatedTask = {
    ...tasks[taskIndex],
    title: title.trim(),
    description: String(description || '').trim(),
    date,
    priority,
    category: category || 'Personal',
    updatedAt: new Date().toISOString()
  };

  tasks[taskIndex] = updatedTask;
  writeTasks(tasks);
  return res.status(200).json({ data: updatedTask });
});

app.patch('/tasks/:id/toggle', (req, res) => {
  const taskId = Number(req.params.id);
  const tasks = readTasks().map(normalizeTask);
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  task.completed = !task.completed;
  task.updatedAt = new Date().toISOString();
  writeTasks(tasks);
  return res.status(200).json({ data: task });
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);
  let tasks = readTasks().map(normalizeTask);
  const originalLength = tasks.length;

  tasks = tasks.filter((task) => task.id !== taskId);

  if (tasks.length === originalLength) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  writeTasks(tasks);
  return res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} not found.`
  });
});

ensureDatabase();

app.listen(port, () => {
  console.log(`Daily Task Manager backend running on port ${port}`);
  console.log(`Using JSON database file: ${databaseFile}`);
});
