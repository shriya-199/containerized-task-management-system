const taskModel = require('../models/taskModel');

const allowedStatuses = new Set(['pending', 'in_progress', 'completed']);

function validateTaskPayload(payload, partial = false) {
  const errors = [];

  if (!partial || payload.title !== undefined) {
    if (!payload.title || typeof payload.title !== 'string' || payload.title.trim().length < 3) {
      errors.push('title must be at least 3 characters');
    }
  }

  if (payload.status !== undefined && !allowedStatuses.has(payload.status)) {
    errors.push('status must be one of pending, in_progress, completed');
  }

  if (payload.dueDate !== undefined && payload.dueDate !== null && payload.dueDate !== '') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.dueDate)) {
      errors.push('dueDate must use YYYY-MM-DD format');
    }
  }

  return errors;
}

async function createTask(req, res, next) {
  try {
    const errors = validateTaskPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const task = {
      title: req.body.title.trim(),
      description: req.body.description || '',
      status: req.body.status || 'pending',
      dueDate: req.body.dueDate || null
    };

    const createdTask = await taskModel.create(task);
    return res.status(201).json({ data: createdTask });
  } catch (error) {
    return next(error);
  }
}

async function getTasks(_req, res, next) {
  try {
    const tasks = await taskModel.findAll();
    return res.status(200).json({ data: tasks });
  } catch (error) {
    return next(error);
  }
}

async function getTaskById(req, res, next) {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json({ data: task });
  } catch (error) {
    return next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const errors = validateTaskPayload(req.body, true);
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const existingTask = await taskModel.findById(req.params.id);
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updates = {
      title: req.body.title ? req.body.title.trim() : existingTask.title,
      description: req.body.description !== undefined ? req.body.description : existingTask.description,
      status: req.body.status || existingTask.status,
      dueDate: req.body.dueDate !== undefined ? req.body.dueDate || null : existingTask.dueDate
    };

    const updatedTask = await taskModel.update(req.params.id, updates);
    return res.status(200).json({ data: updatedTask });
  } catch (error) {
    return next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const deleted = await taskModel.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
