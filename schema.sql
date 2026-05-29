CREATE DATABASE IF NOT EXISTS task_management;

USE task_management;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT chk_users_name_not_empty CHECK (CHAR_LENGTH(TRIM(name)) >= 2),
    CONSTRAINT chk_users_email_not_empty CHECK (CHAR_LENGTH(TRIM(email)) > 0),
    CONSTRAINT chk_users_password_not_empty CHECK (CHAR_LENGTH(password) >= 8)
);

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_tasks_title_not_empty CHECK (CHAR_LENGTH(TRIM(title)) >= 3)
);

CREATE INDEX idx_tasks_status ON tasks (status);
CREATE INDEX idx_tasks_created_at ON tasks (created_at);

INSERT INTO users (name, email, password)
VALUES
    ('Admin User', 'admin@example.com', '$2a$12$m6Xb3J8mM1P7h3Q7xE4sBe9S9kZ6fvYtT8rZQf4AYf5Y3C4QfYJjK'),
    ('Project Manager', 'manager@example.com', '$2a$12$m6Xb3J8mM1P7h3Q7xE4sBe9S9kZ6fvYtT8rZQf4AYf5Y3C4QfYJjK'),
    ('Team Member', 'member@example.com', '$2a$12$m6Xb3J8mM1P7h3Q7xE4sBe9S9kZ6fvYtT8rZQf4AYf5Y3C4QfYJjK')
ON DUPLICATE KEY UPDATE
    name = VALUES(name);

INSERT INTO tasks (title, description, status)
VALUES
    ('Provision Docker environment', 'Create Dockerfiles and Compose services for the task platform.', 'completed'),
    ('Configure CI pipeline', 'Validate Node.js services and Docker builds with GitHub Actions.', 'in_progress'),
    ('Review production secrets', 'Replace example credentials before deployment.', 'pending'),
    ('Document service endpoints', 'Add usage examples for API, Auth, and Worker services.', 'pending')
ON DUPLICATE KEY UPDATE
    title = VALUES(title);
