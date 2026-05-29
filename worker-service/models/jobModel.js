const db = require('./db');

async function ensureWorkerTables() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
      due_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_tasks_status (status),
      INDEX idx_tasks_due_date (due_date),
      INDEX idx_tasks_created_at (created_at)
    )
  `);

  const [columns] = await db.execute(`
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'tasks'
      AND COLUMN_NAME = 'due_date'
  `);

  if (columns.length === 0) {
    await db.execute('ALTER TABLE tasks ADD COLUMN due_date DATE AFTER status');
    await db.execute('CREATE INDEX idx_tasks_due_date ON tasks (due_date)');
  }

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

async function getOpenTasks() {
  const [rows] = await db.execute(`
    SELECT id, title, description, status, due_date AS dueDate, created_at AS createdAt, updated_at AS updatedAt
    FROM tasks
    WHERE status <> 'completed'
    ORDER BY due_date IS NULL, due_date ASC, created_at ASC
  `);
  return rows;
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
  getOpenTasks,
  recordJobRun,
  findLatestJobRun
};
