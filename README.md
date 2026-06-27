# Sprintly

A full-stack task management application built with the MERN stack (MongoDB, Express, React/Next.js, Node.js). Sprintly lets users sign up, manage their tasks through a clean dashboard, track progress by status, and update their profile — all secured with JWT authentication.

![Tech Stack](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

## Features

- **Authentication** — Secure signup/login with JWT tokens and bcrypt password hashing
- **Task Management** — Full CRUD operations (create, read, update, delete tasks)
- **Status Tracking** — Organize tasks as To Do, In Progress, or Done
- **Completed Tasks View** — Dedicated page for completed tasks with restore option
- **Profile Settings** — Update name and change password
- **Protected Routes** — Both frontend and backend route protection via JWT middleware
- **Dark/Light Mode** — Theme toggle with persistent user preference
- **Responsive Dashboard** — Clean sidebar navigation with a modern purple SaaS-style design

## Tech Stack

**Frontend**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Lucide React (icons)

**Backend**
- Node.js + Express
- MongoDB with Mongoose (ODM)
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing

## Project Structure

```
sprintly/
├── backend/
│   ├── controllers/      # Business logic (auth, tasks)
│   ├── models/            # Mongoose schemas (User, Task)
│   ├── routes/            # API route definitions
│   ├── middleware/        # JWT auth middleware
│   └── server.js          # Express app entry point
└── frontend/
    └── src/
        ├── app/
        │   ├── (auth)/         # Login & Signup pages
        │   └── dashboard/      # Protected dashboard pages
        ├── components/         # Reusable UI components
        └── lib/                # API helpers & hooks
```

## API Endpoints

| Method | Endpoint                   | Description                  | Auth Required |
|--------|-----------------------------|-------------------------------|----------------|
| POST   | `/api/auth/signup`          | Register a new user          | ❌             |
| POST   | `/api/auth/login`           | Log in and receive a JWT      | ❌             |
| PUT    | `/api/auth/profile`         | Update user's name            | ✅             |
| PUT    | `/api/auth/change-password` | Change account password       | ✅             |
| GET    | `/api/tasks`                | Get all tasks for the user    | ✅             |
| POST   | `/api/tasks`                | Create a new task             | ✅             |
| GET    | `/api/tasks/:id`            | Get a single task             | ✅             |
| PUT    | `/api/tasks/:id`             | Update a task                 | ✅             |
| DELETE | `/api/tasks/:id`             | Delete a task                 | ✅             |

## Getting Started

### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas account (or local MongoDB instance)

### 1. Clone the repository
```bash
git clone https://github.com/iRifshaAshraf/sprintly.git
cd sprintly
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env.local` file in the `frontend` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## What I Learned

This project was built to strengthen hands-on experience with:
- Designing and connecting MongoDB schemas with relationships (`ref`/`populate`)
- Implementing secure authentication flows with JWT and bcrypt
- Building protected API routes with custom Express middleware
- Managing client-side auth state and protected routes in Next.js App Router
- Debugging real-world issues (e.g., DNS resolution for MongoDB Atlas connections)

## License

This project is open source and available for learning purposes.

---

Built by [Rifsha Ashraf](https://github.com/iRifshaAshraf)
