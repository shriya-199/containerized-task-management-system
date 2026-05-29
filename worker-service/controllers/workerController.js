const jobModel = require('../models/jobModel');

async function processPendingTasksOnce() {
  const pendingTasks = await jobModel.getPendingTasks();

  for (const task of pendingTasks) {
    await jobModel.markTaskCompleted(task.id);
  }

  await jobModel.recordJobRun('process-pending-tasks', 'completed', {
    processedCount: pendingTasks.length,
    taskIds: pendingTasks.map((task) => task.id)
  });

  return {
    processedCount: pendingTasks.length,
    tasks: pendingTasks
  };
}

async function getLastJobRun(_req, res, next) {
  try {
    const job = await jobModel.findLatestJobRun();
    return res.status(200).json({ data: job });
  } catch (error) {
    return next(error);
  }
}

async function triggerPendingTaskProcessing(_req, res, next) {
  try {
    const result = await processPendingTasksOnce();
    return res.status(202).json({ data: result });
  } catch (error) {
    await jobModel.recordJobRun('process-pending-tasks', 'failed', {
      message: error.message
    });
    return next(error);
  }
}

module.exports = {
  getLastJobRun,
  triggerPendingTaskProcessing,
  processPendingTasksOnce
};
