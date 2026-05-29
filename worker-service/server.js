const express = require('express');
const helmet = require('helmet');
const dotenv = require('dotenv');
const {
  ensureWorkerTables,
  getPendingTasks,
  markTaskCompleted,
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

async function processPendingTasks() {
  if (isProcessing) {
    console.log('[worker-service] previous job is still running; skipping this cycle');
    return;
  }

  isProcessing = true;
  const startedAt = new Date();

  try {
    console.log(`[worker-service] polling for pending tasks at ${startedAt.toISOString()}`);
    const pendingTasks = await getPendingTasks();

    if (pendingTasks.length === 0) {
      console.log('[worker-service] no pending tasks found');
      await recordJobRun('process-pending-tasks', 'completed', {
        processedCount: 0,
        message: 'No pending tasks found'
      });
      return;
    }

    console.log(`[worker-service] found ${pendingTasks.length} pending task(s)`);

    for (const task of pendingTasks) {
      console.log(`[worker-service] processing task id=${task.id}, title="${task.title}"`);
      await markTaskCompleted(task.id);
      console.log(`[worker-service] completed task id=${task.id}`);
    }

    await recordJobRun('process-pending-tasks', 'completed', {
      processedCount: pendingTasks.length,
      taskIds: pendingTasks.map((task) => task.id)
    });
  } catch (error) {
    console.error('[worker-service] failed to process pending tasks:', error);
    await recordJobRun('process-pending-tasks', 'failed', {
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

  await processPendingTasks();

  setInterval(() => {
    processPendingTasks();
  }, intervalMs);

  app.listen(port, () => {
    console.log(`[worker-service] health endpoint listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('[worker-service] failed to start:', error);
  process.exit(1);
});
