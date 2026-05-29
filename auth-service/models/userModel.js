const db = require('./db');

async function ensureUsersTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id CHAR(36) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(180) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('admin', 'manager', 'member') NOT NULL DEFAULT 'member',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_users_email (email)
    )
  `);
}

async function create(user) {
  await db.execute(
    `INSERT INTO users (id, name, email, password_hash, role)
     VALUES (:id, :name, :email, :passwordHash, :role)`,
    user
  );
}

async function findByEmail(email) {
  const [rows] = await db.execute(
    `SELECT id, name, email, password_hash AS passwordHash, role, created_at AS createdAt
     FROM users
     WHERE email = :email
     LIMIT 1`,
    { email }
  );
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await db.execute(
    `SELECT id, name, email, role, created_at AS createdAt
     FROM users
     WHERE id = :id
     LIMIT 1`,
    { id }
  );
  return rows[0] || null;
}

module.exports = {
  ensureUsersTable,
  create,
  findByEmail,
  findById
};
