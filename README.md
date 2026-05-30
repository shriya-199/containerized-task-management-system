# Daily Task Manager

A basic Daily Task Management System built with plain HTML, CSS, JavaScript, Node.js, and Express.js. The app lets users add daily tasks, select a deadline date, choose priority, mark tasks as completed, and delete tasks.

This project is kept intentionally simple for a student DevOps presentation. The frontend talks to a basic Express backend and both services are containerized using Docker.

## Features

- Add daily task title
- Select task date/deadline
- Choose priority: Low, Medium, High
- View tasks as cards
- Mark task as completed
- Completed task shows line-through text
- Delete task
- Sample tasks included by default
- Uses browser localStorage, so tasks stay after refresh
- Responsive design for desktop and mobile

## Tech Stack

| Purpose | Technology |
| --- | --- |
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Backend Storage | In-memory sample task array |
| Frontend Web Server in Docker | Nginx |
| Containerization | Docker |
| Orchestration | Docker Compose |
| CI/CD | GitHub Actions |

## Folder Structure

```text
containerized-task-management-system/
|-- frontend/
|   |-- Dockerfile
|   `-- index.html
|-- backend/
|   |-- Dockerfile
|   |-- package.json
|   `-- server.js
|-- .github/
|   `-- workflows/
|       `-- ci.yml
|-- .env.example
|-- docker-compose.yml
`-- README.md
```

## Run Directly Without Docker

Backend must run first:

```bash
cd backend
npm install
npm start
```

Then open this file in browser:

```text
frontend/index.html
```

## Run With Docker Compose

Start the project:

```bash
docker-compose up --build -d
```

Open in browser:

```text
http://localhost:8081
```

Backend API:

```text
http://localhost:3000
```

Check running container:

```bash
docker-compose ps
```

Check logs:

```bash
docker-compose logs -f
```

Stop project:

```bash
docker-compose down
```

## Docker Explanation

The frontend is static, so it is served using Nginx. The backend is a Node.js Express service.

`frontend/Dockerfile`:

```Dockerfile
FROM nginx:1.27-alpine

COPY index.html /usr/share/nginx/html/index.html

EXPOSE 80
```

Docker Compose maps container port `80` to local port `8081`:

```text
localhost:8081 -> container:80
```

The backend container runs on:

```text
localhost:3000 -> container:3000
```

## GitHub Actions

Workflow file:

```text
.github/workflows/ci.yml
```

The workflow runs on push or pull request to `main`.

It performs:

1. Checkout repository
2. Validate Docker Compose file
3. Build frontend and backend Docker images
4. Start frontend and backend containers
5. Verify backend health endpoint
6. Verify the page contains `Daily Task Manager`
7. Show container status
8. Clean up containers

## Presentation Line

This is a basic Daily Task Management System where users can add tasks, set deadlines, choose priority, complete tasks, and delete tasks. It uses a simple Node.js Express backend for task APIs and DevOps tools like Docker, Docker Compose, and GitHub Actions for containerization and automation.
