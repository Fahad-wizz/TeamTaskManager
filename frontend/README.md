# Team Task Manager

A production-oriented full-stack Team Task Manager with JWT authentication, MongoDB persistence, project membership, task assignment, analytics, and backend-enforced RBAC.

Live URL: add your Railway frontend URL here after deployment.

## Features

- Signup and login with bcrypt password hashing and JWT auth.
- Admin and member roles with backend middleware enforcement.
- Admins can create projects, add/remove members, and create assigned tasks.
- Members can view their assigned tasks and update task status only.
- Dashboard analytics for total, completed, pending, and overdue tasks.
- Overdue task highlighting, status filters, role-based UI, analytics cards, and task title search.
- Railway-ready backend and frontend start/build setup.

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React, Vite, Tailwind CSS
- Auth: JWT, bcrypt
- Deployment: Railway, Docker-compatible services

## Project Structure

```text
backend/
  src/controllers
  src/middleware
  src/models
  src/routes
  src/validators
frontend/
  src/components
  src/pages
  src/state
  src/utils
scripts/
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment files.

Backend `.env`:

```bash
MONGO_URI=mongodb://127.0.0.1:27017/team-task-manager
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_ORIGIN=http://localhost:5173
PORT=5000
```

Frontend `.env`:

```bash
VITE_API_URL=http://localhost:5000
```

3. Start the full app from the repository root:

```bash
npm start
```

The root start script builds the frontend if needed, starts the backend API, and serves the frontend preview.

For development, run each workspace separately:

```bash
npm run dev --workspace backend
npm run dev --workspace frontend
```

## Demo Flow

1. Sign up as the first admin user.
2. Sign up as a member user in another browser/session.
3. Admin creates a project.
4. Admin adds the member by email.
5. Admin creates a task assigned to that member.
6. Member logs in and updates the task status.
7. Dashboard and task counts reflect the latest task state.

Note: the first user can become admin automatically. After that, public admin signup is blocked unless `ALLOW_ADMIN_SIGNUP=true` is set on the backend.

## API Endpoints

### Auth

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`

### Projects

- `POST /projects` - admin only
- `GET /projects` - scoped to owned/member projects
- `POST /projects/add-member` - admin owner only
- `DELETE /projects/:projectId/members/:userId` - admin owner only

### Tasks

- `POST /tasks` - admin owner only
- `GET /tasks` - admins see owned project tasks, members see assigned tasks
- `PATCH /tasks/:id` - status update only

### Dashboard

- `GET /dashboard`

Returns:

```json
{
  "stats": {
    "totalTasks": 0,
    "completedTasks": 0,
    "pendingTasks": 0,
    "overdueTasks": 0
  },
  "myTasks": []
}
```

## Railway Deployment

Create two Railway services from this repository.

### Backend Service

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Variables:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `CLIENT_ORIGIN` set to the deployed frontend URL
  - `PORT` supplied by Railway

### Frontend Service

- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Variables:
  - `VITE_API_URL` set to the deployed backend URL
  - `PORT` supplied by Railway

## Security Notes

- Passwords are hashed with bcrypt before persistence.
- JWT tokens are verified by auth middleware before protected routes.
- Role checks are enforced by backend middleware.
- Ownership checks prevent admins from managing projects they did not create.
- Members can only view and update tasks assigned to them.
