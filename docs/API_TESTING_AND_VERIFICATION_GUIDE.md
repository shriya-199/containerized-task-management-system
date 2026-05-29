# API Testing and Verification Guide

This guide explains how to run, test, verify, troubleshoot, and present the Containerized Task Management System.

## 1. Commands to Run the Project

### Start All Containers

```bash
docker-compose up --build
```

### Start in Detached Mode

```bash
docker-compose up --build -d
```

### Verify Running Containers

```bash
docker-compose ps
```

Expected containers:

- `task-api-service`
- `task-auth-service`
- `task-worker-service`
- `task-mysql`
- `task-adminer`

## 2. Commands to Stop Containers

### Stop Containers

```bash
docker-compose down
```

### Stop Containers and Remove MySQL Volume

```bash
docker-compose down --volumes
```

Use `--volumes` only when you want to delete database data.

## 3. Commands to Rebuild Containers

### Rebuild and Start

```bash
docker-compose up --build
```

### Rebuild Without Cache

```bash
docker-compose build --no-cache
docker-compose up
```

### Rebuild a Single Service

```bash
docker-compose build api-service
docker-compose up -d api-service
```

## 4. Commands to Check Logs

### All Logs

```bash
docker-compose logs -f
```

### API Service Logs

```bash
docker-compose logs -f api-service
```

### Auth Service Logs

```bash
docker-compose logs -f auth-service
```

### Worker Service Logs

```bash
docker-compose logs -f worker-service
```

### MySQL Logs

```bash
docker-compose logs -f mysql
```

## 5. Commands to Check MySQL Container

### Check MySQL Container Status

```bash
docker inspect -f "{{.State.Status}}" task-mysql
```

Expected output:

```text
running
```

### Connect to MySQL Container

```bash
docker exec -it task-mysql mysql -u task_user -p task_management
```

Password:

```text
task_password
```

### Show Tables

```sql
SHOW TABLES;
```

Expected tables:

```text
tasks
users
job_runs
```

### Check Task Data

```sql
SELECT id, title, status, created_at FROM tasks;
```

### Check User Data

```sql
SELECT id, name, email, created_at FROM users;
```

### Exit MySQL

```sql
EXIT;
```

## 6. API Testing Guide

Base URLs:

| Service | Base URL |
| --- | --- |
| API Service | `http://localhost:3000` |
| Auth Service | `http://localhost:3001` |
| Worker Service | `http://localhost:3002` |
| Adminer | `http://localhost:8080` |

### Health Checks

#### API Service

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "service": "api-service",
  "status": "healthy",
  "timestamp": "2026-05-29T00:00:00.000Z"
}
```

#### Auth Service

```bash
curl http://localhost:3001/health
```

Expected response:

```json
{
  "service": "auth-service",
  "status": "healthy",
  "timestamp": "2026-05-29T00:00:00.000Z"
}
```

#### Worker Service

```bash
curl http://localhost:3002/health
```

Expected response:

```json
{
  "service": "worker-service",
  "status": "healthy",
  "timestamp": "2026-05-29T00:00:00.000Z"
}
```

### Auth Service API Testing

#### Register User

```bash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Demo User",
    "email": "demo@example.com",
    "password": "password123"
  }'
```

Expected response:

```json
{
  "data": {
    "id": "generated-user-id",
    "name": "Demo User",
    "email": "demo@example.com",
    "role": "member"
  }
}
```

#### Login User

```bash
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "password123"
  }'
```

Expected response:

```json
{
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "generated-user-id",
      "name": "Demo User",
      "email": "demo@example.com",
      "role": "member"
    }
  }
}
```

### Task API Testing

#### Get All Tasks

```bash
curl http://localhost:3000/tasks
```

Expected response:

```json
{
  "data": [
    {
      "id": 1,
      "title": "Provision Docker environment",
      "description": "Create Dockerfiles and Compose services for the task platform.",
      "status": "completed"
    }
  ]
}
```

#### Create Task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Docker deployment",
    "description": "Verify containers, logs, health checks, and database connectivity.",
    "status": "pending"
  }'
```

Expected response:

```json
{
  "data": {
    "id": 5,
    "title": "Test Docker deployment",
    "description": "Verify containers, logs, health checks, and database connectivity.",
    "status": "pending"
  }
}
```

#### Update Task

```bash
curl -X PUT http://localhost:3000/tasks/5 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Docker deployment",
    "description": "Verified Docker Compose stack successfully.",
    "status": "in_progress"
  }'
```

Expected response:

```json
{
  "data": {
    "id": 5,
    "title": "Test Docker deployment",
    "description": "Verified Docker Compose stack successfully.",
    "status": "in_progress"
  }
}
```

#### Delete Task

```bash
curl -X DELETE http://localhost:3000/tasks/5
```

Expected response:

```text
HTTP 204 No Content
```

## 7. Docker Verification Steps

1. Start the project:

```bash
docker-compose up --build -d
```

2. Confirm containers are running:

```bash
docker-compose ps
```

3. Verify health endpoints:

```bash
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
```

4. Check MySQL health:

```bash
docker inspect -f "{{json .State.Health.Status}}" task-mysql
```

Expected output:

```text
"healthy"
```

5. Check Worker logs:

```bash
docker-compose logs worker-service
```

Expected log examples:

```text
[worker-service] database schema is ready
[worker-service] background worker interval set to 10000ms
[worker-service] polling for pending tasks
[worker-service] found 1 pending task(s)
[worker-service] completed task id=5
```

## 8. GitHub Actions Verification Steps

1. Push code to the `main` branch:

```bash
git add .
git commit -m "Add containerized task management system"
git push origin main
```

2. Open the repository on GitHub.

3. Go to the `Actions` tab.

4. Select `Containerized Task Management CI/CD`.

5. Verify these stages pass:

- Checkout repository
- Set up Node.js 18
- Install service dependencies
- Run API/Auth/Worker tests and lint checks
- Validate Docker Compose configuration
- Build Docker images
- Start containers
- Verify health endpoints
- Verify containers are running
- Tear down Docker Compose stack

Expected success log:

```text
CI/CD pipeline completed successfully. Images built and containers verified.
```

## 9. Expected Output Screenshots Description

Use these screenshots in documentation, reports, or viva presentation.

### Docker Compose Running

Screenshot should show `docker-compose ps` with all containers in running state:

- `task-api-service`
- `task-auth-service`
- `task-worker-service`
- `task-mysql`
- `task-adminer`

### API Health Check

Screenshot should show terminal output from:

```bash
curl http://localhost:3000/health
```

Expected visible fields:

- `service: api-service`
- `status: healthy`
- `timestamp`

### Auth Login Response

Screenshot should show successful `/login` response with:

- JWT token
- User details
- HTTP 200 status

### Task CRUD Output

Screenshot should show:

- Task created with POST `/tasks`
- Task listed with GET `/tasks`
- Task updated with PUT `/tasks/:id`
- Task deleted with DELETE `/tasks/:id`

### Worker Logs

Screenshot should show worker logs proving background processing:

```text
polling for pending tasks
processing task id=...
completed task id=...
```

### Adminer Database View

Screenshot should show Adminer connected to:

- Server: `mysql`
- Database: `task_management`
- Tables: `users`, `tasks`, `job_runs`

### GitHub Actions Success

Screenshot should show a successful workflow run with all CI/CD steps green.

## 10. Common Errors and Fixes

### Error: Port Already in Use

Example:

```text
Bind for 0.0.0.0:3000 failed: port is already allocated
```

Fix:

```bash
docker-compose down
```

Or change the port in `.env`:

```env
API_SERVICE_PORT=3100
```

### Error: MySQL Container Not Healthy

Fix:

```bash
docker-compose logs mysql
docker-compose restart mysql
```

If the database volume is corrupted during development:

```bash
docker-compose down --volumes
docker-compose up --build
```

### Error: Access Denied for MySQL User

Fix:

Check `.env` values:

```env
DB_USER=task_user
DB_PASSWORD=task_password
DB_NAME=task_management
```

Then recreate the database volume:

```bash
docker-compose down --volumes
docker-compose up --build
```

### Error: Service Cannot Connect to MySQL

Cause:

Inside Docker Compose, services must use the Compose service name `mysql`, not `localhost`.

Fix:

```env
DB_HOST=mysql
```

### Error: JWT Login Fails

Possible causes:

- User does not exist.
- Password is incorrect.
- Password has fewer than 8 characters during registration.

Fix:

Register a user first:

```bash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo User","email":"demo@example.com","password":"password123"}'
```

### Error: Docker Image Build Fails

Fix:

```bash
docker-compose build --no-cache
docker system prune -f
docker-compose up --build
```

### Error: GitHub Actions Fails During Health Check

Fix:

- Check container logs in the failed workflow.
- Confirm service ports match `docker-compose.yml`.
- Confirm MySQL health check passed.
- Confirm services expose `/health`.

## 11. Viva Explanation for Project Demo

### Short Introduction

This project is a containerized task management system built with Node.js, Express.js, MySQL, Docker, Docker Compose, and GitHub Actions. It demonstrates microservice architecture, container orchestration, database integration, background job processing, and CI/CD automation.

### Architecture Explanation

The application has five services:

- API Service handles task CRUD operations.
- Auth Service handles user registration, bcrypt password hashing, and JWT login.
- Worker Service runs continuously and processes pending tasks from MySQL every 10 seconds.
- MySQL stores users, tasks, and worker job records.
- Adminer provides a browser-based database management interface.

All services run in separate containers and communicate over a Docker bridge network.

### Docker Explanation

Each Node.js service has its own Dockerfile. Docker Compose builds the three service images, starts MySQL and Adminer, creates a shared bridge network, and mounts a persistent volume for MySQL data. This allows the entire project to run with one command:

```bash
docker-compose up --build
```

### Database Explanation

The database contains:

- `users` table for authentication data.
- `tasks` table for task records.
- `job_runs` table for worker execution logs.

The services use the `mysql2` package with async/await to communicate with MySQL.

### API Explanation

The API Service exposes task endpoints:

- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`
- `GET /health`

The Auth Service exposes:

- `POST /register`
- `POST /login`
- `GET /health`

### Worker Explanation

The Worker Service simulates background job processing. It polls MySQL every 10 seconds, reads pending tasks, logs them, and marks them as completed. This shows how asynchronous background processing can be containerized separately from the main API.

### CI/CD Explanation

GitHub Actions runs on every push to `main`. It installs Node.js 18, installs dependencies, runs tests and lint checks, builds Docker images, starts the Compose stack, verifies health endpoints, confirms containers are running, and prints logs on failure.

### Demo Flow

1. Start the stack:

```bash
docker-compose up --build
```

2. Show running containers:

```bash
docker-compose ps
```

3. Test health endpoints.

4. Register and log in a user.

5. Create a pending task.

6. Show Worker logs where the task is processed.

7. Open Adminer and show database tables.

8. Show the GitHub Actions workflow file and explain the CI/CD stages.

### Closing Statement

This project demonstrates a complete DevOps workflow: application development, database integration, containerization, orchestration, automated verification, and production-style documentation.
