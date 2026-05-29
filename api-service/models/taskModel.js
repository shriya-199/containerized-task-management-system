const db = require('./db');

async function ensureTasksTable() {
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
}

async function seedTasks() {
  const [rows] = await db.execute('SELECT COUNT(*) AS count FROM tasks');
  if (Number(rows[0].count) > 0) {
    return;
  }

  await db.execute(`
    INSERT INTO tasks (title, description, status, due_date)
    VALUES
      ('Complete data structures assignment', 'Solve stack and queue questions for college submission.', 'pending', CURDATE()),
      ('Revise operating system notes', 'Read process scheduling and deadlock notes before class.', 'in_progress', DATE_ADD(CURDATE(), INTERVAL 1 DAY)),
      ('Submit DevOps project report', 'Prepare README, screenshots, and viva points.', 'completed', DATE_ADD(CURDATE(), INTERVAL 2 DAY))
  `);
}

async function initializeTasksSchema() {
  await ensureTasksTable();
  await seedTasks();
}

async function create(task) {
  const [result] = await db.execute(
    `INSERT INTO tasks (title, description, status, due_date)
     VALUES (:title, :description, :status, :dueDate)`,
    task
  );
  return findById(result.insertId);
}

async function findAll() {
  const [rows] = await db.execute(
    `SELECT id, title, description, status, due_date AS dueDate, created_at AS createdAt, updated_at AS updatedAt
     FROM tasks
     ORDER BY
       CASE WHEN status = 'completed' THEN 1 ELSE 0 END,
       due_date IS NULL,
       due_date ASC,
       created_at DESC`
  );
  return rows;
}

async function findById(id) {
  const [rows] = await db.execute(
    `SELECT id, title, description, status, due_date AS dueDate, created_at AS createdAt, updated_at AS updatedAt
     FROM tasks
     WHERE id = :id
     LIMIT 1`,
    { id }
  );
  return rows[0] || null;
}

async function update(id, task) {
  const [result] = await db.execute(
    `UPDATE tasks
     SET title = :title, description = :description, status = :status, due_date = :dueDate
     WHERE id = :id`,
    { id, ...task }
  );
  return result.affectedRows > 0 ? findById(id) : null;
}

async function remove(id) {
  const [result] = await db.execute('DELETE FROM tasks WHERE id = :id', { id });
  return result.affectedRows > 0;
}

module.exports = {
  ensureTasksTable,
  seedTasks,
  initializeTasksSchema,
  create,
  findAll,
  findById,
  update,
  remove
};
