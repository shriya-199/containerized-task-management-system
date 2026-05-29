const express = require('express');
const helmet = require('helmet');
const dotenv = require('dotenv');
const {
  ensureWorkerTables,
  getOpenTasks,
  recordJobRun
} = require('./models/jobModel');

dotenv.config();

const app = express();
const port = process.env.WORKER_SERVICE_PORT || 3002;
const intervalMs = Number(process.env.WORKER_INTERVAL_MS || 10000);
let isProcessing = false;

app.use(helmet());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({
    service: 'worker-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

app.use((error, _req, res, _next) => {
  console.error('[worker-service] unhandled error:', error);
  res.status(error.statusCode || 500).json({
    message: error.message || 'Internal server error'
  });
});

function formatDueDate(value) {
  if (!value) {
    return '';
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  const rawValue = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(rawValue)) {
    return rawValue.slice(0, 10);
  }

  const parsedDate = new Date(rawValue);
  return Number.isNaN(parsedDate.getTime()) ? rawValue : parsedDate.toISOString().slice(0, 10);
}

function isOverdue(task) {
  if (!task.dueDate) {
    return false;
  }

  const today = new Date().toISOString().slice(0, 10);
  const dueDate = formatDueDate(task.dueDate);
  return dueDate < today;
}

async function monitorOpenTasks() {
  if (isProcessing) {
    console.log('[worker-service] previous job is still running; skipping this cycle');
    return;
  }

  isProcessing = true;
  const startedAt = new Date();

  try {
    console.log(`[worker-service] checking open daily tasks at ${startedAt.toISOString()}`);
    const openTasks = await getOpenTasks();

    if (openTasks.length === 0) {
      console.log('[worker-service] no open tasks found');
      await recordJobRun('monitor-open-tasks', 'completed', {
        openTaskCount: 0,
        overdueTaskCount: 0,
        message: 'No open tasks found'
      });
      return;
    }

    const overdueTasks = openTasks.filter(isOverdue);
    console.log(`[worker-service] open tasks: ${openTasks.length}, overdue tasks: ${overdueTasks.length}`);

    for (const task of openTasks) {
      const dueDate = task.dueDate ? formatDueDate(task.dueDate) : 'no deadline';
      const overdueLabel = isOverdue(task) ? 'OVERDUE' : 'active';
      console.log(`[worker-service] ${overdueLabel} task id=${task.id}, title="${task.title}", due=${dueDate}, status=${task.status}`);
    }

    await recordJobRun('monitor-open-tasks', 'completed', {
      openTaskCount: openTasks.length,
      overdueTaskCount: overdueTasks.length,
      taskIds: openTasks.map((task) => task.id)
    });
  } catch (error) {
    console.error('[worker-service] failed to monitor open tasks:', error);
    await recordJobRun('monitor-open-tasks', 'failed', {
      message: error.message
    }).catch((recordError) => {
      console.error('[worker-service] failed to record job failure:', recordError);
    });
  } finally {
    isProcessing = false;
  }
}

async function startServer() {
  await ensureWorkerTables();
  console.log('[worker-service] database schema is ready');
  console.log(`[worker-service] background worker interval set to ${intervalMs}ms`);

  await monitorOpenTasks();

  setInterval(() => {
    monitorOpenTasks();
  }, intervalMs);

  app.listen(port, () => {
    console.log(`[worker-service] health endpoint listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('[worker-service] failed to start:', error);
  process.exit(1);
});
