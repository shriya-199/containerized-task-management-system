# TaskFlow AI

TaskFlow AI is a premium React.js todo management application built for a DevOps class project. It includes a modern SaaS dashboard, routing, task CRUD, localStorage persistence, dark/light theme, analytics charts, animations, Docker setup, and GitHub Actions verification.

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React.js, Vite, JavaScript |
| Styling | Tailwind CSS |
| Routing | React Router DOM |
| State | Context API |
| Persistence | LocalStorage |
| Animations | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| Frontend Container | Nginx |
| Backend Demo Service | Node.js, Express.js |
| DevOps | Docker, Docker Compose, GitHub Actions |

## Features

- Landing, login, signup, dashboard, tasks, calendar, analytics, settings pages
- Add, edit, delete, complete, restore, and mark important tasks
- Search, suggestions, filter, sort, grid/list views
- Drag and drop task reordering
- Dark/light theme
- Toast notifications
- Modal forms and delete confirmation
- Error boundary, empty states, skeleton component
- Monthly calendar task view
- Analytics charts for productivity, categories, and priorities
- LocalStorage persistence for user, tasks, and theme

## Folder Structure

```text
frontend/
|-- src/
|   |-- assets/
|   |-- components/
|   |-- context/
|   |-- hooks/
|   |-- layouts/
|   |-- pages/
|   |-- routes/
|   |-- utils/
|   |-- App.jsx
|   |-- main.jsx
|   `-- styles.css
|-- Dockerfile
|-- index.html
|-- nginx.conf
|-- package.json
|-- postcss.config.js
|-- tailwind.config.js
`-- vite.config.js
```

## Run Locally Without Docker

```bash
cd "C:\Users\hp\OneDrive\Desktop\containerized-task-management-system\frontend"
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Run With Docker Compose

```bash
cd "C:\Users\hp\OneDrive\Desktop\containerized-task-management-system"
docker-compose up --build -d
```

Open:

```text
http://localhost:8081
```

Useful commands:

```bash
docker-compose ps
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose down
```

## Containers

```text
daily-task-manager-frontend
daily-task-manager-backend
```

## Images

```text
containerized-task-management-system-frontend:latest
containerized-task-management-system-backend:latest
```

## GitHub Actions

Workflow file:

```text
.github/workflows/ci.yml
```

The workflow validates Docker Compose, builds Docker images, starts containers, checks backend health, verifies the TaskFlow AI frontend, prints container status, and tears down containers.

## Demo Flow

1. Open `http://localhost:8081`
2. Show landing page and click Live Demo
3. Explain dashboard cards and productivity chart
4. Add a task from Quick Add or All Tasks
5. Edit task, complete task, mark important, delete task
6. Show Calendar and Analytics pages
7. Toggle dark/light theme
8. Show Docker containers with `docker-compose ps`
9. Show GitHub Actions workflow as CI/CD automation

## One-Line Explanation

TaskFlow AI is a containerized React task management app where users manage daily work through a premium dashboard, while Docker and GitHub Actions demonstrate the DevOps part of the project.
