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
    due_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_tasks_title_not_empty CHECK (CHAR_LENGTH(TRIM(title)) >= 3)
);

CREATE INDEX idx_tasks_status ON tasks (status);
CREATE INDEX idx_tasks_due_date ON tasks (due_date);
CREATE INDEX idx_tasks_created_at ON tasks (created_at);

INSERT INTO users (name, email, password)
VALUES
    ('Admin User', 'admin@example.com', '$2a$12$m6Xb3J8mM1P7h3Q7xE4sBe9S9kZ6fvYtT8rZQf4AYf5Y3C4QfYJjK'),
    ('Project Manager', 'manager@example.com', '$2a$12$m6Xb3J8mM1P7h3Q7xE4sBe9S9kZ6fvYtT8rZQf4AYf5Y3C4QfYJjK'),
    ('Team Member', 'member@example.com', '$2a$12$m6Xb3J8mM1P7h3Q7xE4sBe9S9kZ6fvYtT8rZQf4AYf5Y3C4QfYJjK')
ON DUPLICATE KEY UPDATE
    name = VALUES(name);

INSERT INTO tasks (title, description, status, due_date)
VALUES
    ('Complete data structures assignment', 'Solve stack and queue questions for college submission.', 'pending', CURDATE()),
    ('Revise operating system notes', 'Read process scheduling and deadlock notes before class.', 'in_progress', DATE_ADD(CURDATE(), INTERVAL 1 DAY)),
    ('Submit DevOps project report', 'Prepare README, screenshots, and viva points.', 'completed', DATE_ADD(CURDATE(), INTERVAL 2 DAY)),
    ('Prepare morning routine checklist', 'Write daily tasks and deadlines for tomorrow.', 'pending', DATE_ADD(CURDATE(), INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE
    title = VALUES(title);
