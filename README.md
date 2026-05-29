# Containerized Task Management System

![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.20.4-green)
![Express](https://img.shields.io/badge/Express.js-4.18.2-lightgrey)
![MySQL](https://img.shields.io/badge/MySQL-8.0.36-orange)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)

## Project Overview

Containerized Task Management System is a production-style daily task management app. A user can log daily tasks, set deadlines, update progress, and mark tasks as completed.

The system includes a frontend app, Task API service, Auth service, background Worker service, MySQL database, and Adminer for database administration. It is designed to run locally with Docker Compose and validate automatically through GitHub Actions.

## Architecture

```text
Client / API Consumer
        |
        | HTTP
        v
+----------------+       +----------------+
|  API Service   |       |  Auth Service  |
|  Port: 3000    |       |  Port: 3001    |
+-------+--------+       +-------+--------+
        |                        |
        | MySQL                  | MySQL
        v                        v
              +----------------+
              |     MySQL      |
              |   Port: 3306   |
              +-------+--------+
                      ^
                      |
              +-------+--------+
              | Worker Service |
              |  Port: 3002    |
              +----------------+

              +----------------+
              |    Adminer     |
              |  Port: 8080    |
              +----------------+
```

The API service manages task CRUD operations and deadlines. The Auth service manages user registration, password hashing, and JWT login. The Worker service polls MySQL every 10 seconds and logs open or overdue tasks for background monitoring.

## Tech Stack

| Category | Technology |
| --- | --- |
| Runtime | Node.js `18.20.4` |
| Web Framework | Express.js `4.18.2` |
| Database | MySQL `8.0.36` |
| DB Driver | mysql2 |
| Authentication | JSON Web Tokens, bcrypt |
| Containers | Docker, Docker Compose |
| Database UI | Adminer |
| CI/CD | GitHub Actions |
| Frontend | Static HTML, CSS, JavaScript, Nginx |

## Features

- Microservice-style project structure
- Daily task CRUD REST APIs
- Deadline tracking for each task
- Manual task completion from the frontend
- User registration and login
- JWT token generation
- bcrypt password hashing
- MySQL schema creation from services
- Background worker monitoring for open and overdue tasks
- Dockerfiles for every Node.js service
- Docker Compose orchestration with bridge networking
- Persistent MySQL volume
- Adminer database management UI
- GitHub Actions pipeline for build, test, container startup, and health checks
- Environment-driven configuration with `.env.example`
- Frontend dashboard for health checks, auth demo, task creation, and live task listing

## Folder Structure

```text
containerized-task-management-system/
|-- .github/
|   `-- workflows/
|       `-- ci.yml
|-- api-service/
|   |-- controllers/
|   |   `-- taskController.js
|   |-- models/
|   |   |-- db.js
|   |   `-- taskModel.js
|   |-- routes/
|   |   `-- taskRoutes.js
|   |-- .env.example
|   |-- Dockerfile
|   |-- package.json
|   `-- server.js
|-- auth-service/
|   |-- controllers/
|   |   `-- authController.js
|   |-- models/
|   |   |-- db.js
|   |   `-- userModel.js
|   |-- routes/
|   |   `-- authRoutes.js
|   |-- .env.example
|   |-- Dockerfile
|   |-- package.json
|   `-- server.js
|-- worker-service/
|   |-- controllers/
|   |   `-- workerController.js
|   |-- models/
|   |   |-- db.js
|   |   `-- jobModel.js
|   |-- routes/
|   |   `-- workerRoutes.js
|   |-- .env.example
|   |-- Dockerfile
|   |-- package.json
|   `-- server.js
|-- frontend/
|   |-- Dockerfile
|   |-- app.js
|   |-- index.html
|   `-- styles.css
|-- .dockerignore
|-- .env.example
|-- .gitignore
|-- docker-compose.yml
|-- schema.sql
`-- README.md
```

## Installation Steps

### Prerequisites

Install the following tools:

- Docker `24.0.7` or compatible
- Docker Compose `2.24.0` or compatible
- Node.js `18.20.4` for local service development
- Git

### Clone the Repository

```bash
git clone <repository-url>
cd containerized-task-management-system
```

### Configure Environment

```bash
cp .env.example .env
```

Update `.env` values before using the project outside local development, especially:

```env
MYSQL_ROOT_PASSWORD=root_password
DB_PASSWORD=task_password
JWT_SECRET=replace-with-a-long-random-production-secret
```

## Docker Setup

Build and start all services:

```bash
docker-compose up --build
```

Run in detached mode:

```bash
docker-compose up --build -d
```

View running containers:

```bash
docker-compose ps
```

View service logs:

```bash
docker-compose logs -f api-service
docker-compose logs -f auth-service
docker-compose logs -f worker-service
```

Stop the stack:

```bash
docker-compose down
```

Stop the stack and remove MySQL data:

```bash
docker-compose down --volumes
```

### Services and Ports

| Service | Container Name | Port |
| --- | --- | --- |
| API Service | `task-api-service` | `3000` |
| Auth Service | `task-auth-service` | `3001` |
| Worker Service | `task-worker-service` | `3002` |
| Frontend | `task-frontend` | `8081` |
| MySQL | `task-mysql` | `3306` |
| Adminer | `task-adminer` | `8080` |

### Frontend Dashboard

Open the visual dashboard:

```text
http://localhost:8081
```

Use it during a demo to show service health, register/login, create tasks, and show live task status changes after the Worker service processes pending tasks.

### Adminer Access

Open Adminer:

```text
http://localhost:8080
```

Use these connection values:

| Field | Value |
| --- | --- |
| System | `MySQL` |
| Server | `mysql` |
| Username | `task_user` |
| Password | `task_password` |
| Database | `task_management` |

## API Endpoints

### Health Checks

| Service | Method | Endpoint |
| --- | --- | --- |
| API Service | GET | `http://localhost:3000/health` |
| Auth Service | GET | `http://localhost:3001/health` |
| Worker Service | GET | `http://localhost:3002/health` |

### Auth Service

#### Register User

```bash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123"
  }'
```

#### Login User

```bash
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

### API Service

#### Get All Tasks

```bash
curl http://localhost:3000/tasks
```

#### Create Task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Prepare deployment checklist",
    "description": "Document release tasks and rollback steps.",
    "status": "pending"
  }'
```

#### Update Task

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Prepare deployment checklist",
    "description": "Document release tasks, owners, and rollback steps.",
    "status": "in_progress"
  }'
```

#### Delete Task

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

## GitHub Actions Workflow

The CI/CD pipeline is defined in:

```text
.github/workflows/ci.yml
```

The workflow runs on every push to the `main` branch and performs the following checks:

1. Checks out the repository.
2. Installs Node.js 18.
3. Installs dependencies for API, Auth, and Worker services.
4. Runs service tests if present.
5. Runs syntax validation through each service lint script.
6. Validates the Docker Compose configuration.
7. Builds Docker images.
8. Starts all containers with Docker Compose.
9. Verifies service health endpoints.
10. Confirms all expected containers are running.
11. Prints success logs or failure diagnostics.
12. Tears down the Compose stack.

## Screenshots

### Docker Containers

```text
Add screenshot: docker-compose ps output or Docker Desktop container view.
```

### Adminer Dashboard

```text
Add screenshot: Adminer connected to the task_management database.
```

### GitHub Actions Pipeline

```text
Add screenshot: Successful CI/CD workflow run.
```

### API Testing

```text
Add screenshot: Postman or terminal output for task and auth endpoints.
```

## Future Enhancements

- Add automated unit and integration tests with Jest or Vitest.
- Add database migrations with a migration tool.
- Add API authentication middleware to protect task endpoints.
- Add refresh tokens and token revocation.
- Add OpenAPI/Swagger documentation.
- Add centralized logging with structured JSON logs.
- Add metrics and tracing with Prometheus and OpenTelemetry.
- Add container image publishing to GitHub Container Registry or Docker Hub.
- Add Kubernetes manifests or Helm chart.
- Add Nginx reverse proxy with TLS termination.
- Add production secrets management with GitHub Actions secrets or a cloud secret manager.

## License

This project is intended for DevOps learning, portfolio demonstration, and production-style architecture practice.
