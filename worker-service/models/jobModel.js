const db = require('./db');

async function ensureWorkerTables() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_tasks_status (status),
      INDEX idx_tasks_created_at (created_at)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS job_runs (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      job_name VARCHAR(120) NOT NULL,
      status ENUM('completed', 'failed') NOT NULL,
      payload JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_job_runs_job_name (job_name),
      INDEX idx_job_runs_created_at (created_at)
    )
  `);
}

async function getPendingTasks() {
  const [rows] = await db.execute(`
    SELECT id, title, description, status, created_at AS createdAt, updated_at AS updatedAt
    FROM tasks
    WHERE status = 'pending'
    ORDER BY created_at ASC
  `);
  return rows;
}

async function markTaskCompleted(id) {
  const [result] = await db.execute(
    `UPDATE tasks
     SET status = 'completed'
     WHERE id = :id AND status = 'pending'`,
    { id }
  );
  return result.affectedRows > 0;
}

async function recordJobRun(jobName, status, payload) {
  await db.execute(
    `INSERT INTO job_runs (job_name, status, payload)
     VALUES (:jobName, :status, :payload)`,
    {
      jobName,
      status,
      payload: JSON.stringify(payload)
    }
  );
}

async function findLatestJobRun() {
  const [rows] = await db.execute(`
    SELECT id, job_name AS jobName, status, payload, created_at AS createdAt
    FROM job_runs
    ORDER BY created_at DESC
    LIMIT 1
  `);
  return rows[0] || null;
}

module.exports = {
  ensureWorkerTables,
  getPendingTasks,
  markTaskCompleted,
  recordJobRun,
  findLatestJobRun
};
