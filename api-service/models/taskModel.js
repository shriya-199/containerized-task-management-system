const db = require('./db');

async function ensureTasksTable() {
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
}

async function seedTasks() {
  const [rows] = await db.execute('SELECT COUNT(*) AS count FROM tasks');
  if (Number(rows[0].count) > 0) {
    return;
  }

  await db.execute(`
    INSERT INTO tasks (title, description, status)
    VALUES
      ('Provision Docker environment', 'Create Dockerfiles and Compose services for the task platform.', 'completed'),
      ('Configure CI pipeline', 'Validate Node.js services and Docker builds with GitHub Actions.', 'in_progress'),
      ('Review production secrets', 'Replace example credentials before deployment.', 'pending')
  `);
}

async function initializeTasksSchema() {
  await ensureTasksTable();
  await seedTasks();
}

async function create(task) {
  const [result] = await db.execute(
    `INSERT INTO tasks (title, description, status)
     VALUES (:title, :description, :status)`,
    task
  );
  return findById(result.insertId);
}

async function findAll() {
  const [rows] = await db.execute(
    `SELECT id, title, description, status, created_at AS createdAt, updated_at AS updatedAt
     FROM tasks
     ORDER BY created_at DESC`
  );
  return rows;
}

async function findById(id) {
  const [rows] = await db.execute(
    `SELECT id, title, description, status, created_at AS createdAt, updated_at AS updatedAt
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
     SET title = :title, description = :description, status = :status
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
