# TaskCollab — Smart Project & Task Collaboration System

A full-stack project management app with role-based access, real-time task tracking, analytics dashboard, and team collaboration.

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | demo1234 |
| Project Manager | manager@demo.com | demo1234 |
| Team Member | member@demo.com | demo1234 |

## Features

- JWT Authentication (access + refresh tokens)
- Role-Based Access (Admin / Project Manager / Team Member)
- Project CRUD with status tracking
- Task management with validation (no duplicate titles, no past deadlines, no reassigning completed tasks)
- Kanban board view per project
- Team member management
- Dashboard with KPI cards + charts (Recharts)
- Activity log
- Search & filter (by status, priority, member, deadline)
- Comments on tasks
- Dark / Light mode
- Responsive design (mobile + desktop)

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt  
**Frontend:** React (Vite), Tailwind CSS, React Query, Recharts, React Router

## Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/your-username/taskcollab.git
cd taskcollab
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your MongoDB URI and JWT secrets in .env
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL to your backend URL
npm run dev
```

### 4. MongoDB Atlas Setup
1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Get connection string
4. Add to backend `.env` as `MONGODB_URI`

### 5. Seed Demo Users (optional)
```bash
cd backend
node src/utils/seed.js
```

## Environment Variables

### Backend `.env`
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
```

## Deployment

**Backend → Render.com**
1. Push backend to GitHub
2. New Web Service on Render
3. Build command: `npm install`
4. Start command: `node src/index.js`
5. Add environment variables

**Frontend → Vercel**
1. Import frontend repo on Vercel
2. Set `VITE_API_URL` to Render backend URL
3. Deploy

**Database → MongoDB Atlas (free tier)**
