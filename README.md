# TaskFlow

TaskFlow is a modern SaaS task management platform that helps individuals and teams organize projects with Kanban boards, calendars, analytics, drag-and-drop task management, and a clean, productivity-focused interface.

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS & Shadcn UI (Radix Primitives)
- Zustand (Local UI State)
- TanStack React Query (Server State)
- Firebase Authentication

**Backend:**
- Python 3.13 + FastAPI
- SQLAlchemy + Alembic
- PostgreSQL (Supabase)
- Firebase Admin SDK (JWT Validation)

## Architecture Flowchart

```mermaid
graph TD
    %% Frontend Components
    subgraph Frontend [React / Vite Frontend]
        UI[User Interface]
        Zustand[Zustand UI State]
        ReactQuery[TanStack React Query]
        Axios[Axios + Auth Interceptor]
        
        UI <--> Zustand
        UI <--> ReactQuery
        ReactQuery <--> Axios
    end

    %% Authentication
    subgraph Auth [Firebase Authentication]
        FirebaseAuth[Firebase Auth Service]
    end

    %% Backend Components
    subgraph Backend [FastAPI Backend]
        API[FastAPI Endpoints]
        Middleware[Auth Dependency]
        SQLAlchemy[SQLAlchemy ORM]
        
        API <--> Middleware
        API <--> SQLAlchemy
    end

    %% Database
    subgraph Database [Database]
        Supabase[(Supabase PostgreSQL)]
    end

    %% Flow Connections
    UI -- "Login / Signup" --> FirebaseAuth
    FirebaseAuth -- "Returns JWT" --> UI
    Axios -- "HTTP Requests with Bearer JWT" --> API
    Middleware -- "Verifies JWT" --> FirebaseAuth
    SQLAlchemy -- "CRUD Operations" --> Supabase
```

## Local Development Setup

### 1. Prerequisites
- Node.js (v20+)
- Python (3.11+)
- Firebase Project
- Supabase PostgreSQL Database

### 2. Backend Setup
Navigate to the `backend` directory:
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file in the `backend` directory:
```env
DATABASE_URL="postgresql+psycopg://postgres.YOUR_PROJECT:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres"
```
Place your Firebase Admin SDK JSON file in `backend/firebase-service-account.json`.

**Run Migrations & Server:**
```bash
alembic upgrade head
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
Navigate to the `frontend` directory:
```bash
cd frontend
npm install
```

**Environment Variables:**
Create a `.env` file in the `frontend` directory:
```env
VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_AUTH_DOMAIN="..."
VITE_FIREBASE_PROJECT_ID="..."
VITE_FIREBASE_STORAGE_BUCKET="..."
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."
VITE_API_URL="http://localhost:8000"
```

**Run Dev Server:**
```bash
npm run dev
```

## Deployment Guide

### Deploying the Backend (Render)
1. Create a new Web Service on [Render](https://render.com) and connect your GitHub repository.
2. Set the Root Directory to `backend`.
3. Set the Build Command to `pip install -r requirements.txt`.
4. Set the Start Command to `uvicorn main:app --host 0.0.0.0 --port 10000`.
5. Add your Environment Variables:
   - `DATABASE_URL`: Your Supabase connection string.
   - `FIREBASE_SERVICE_ACCOUNT_JSON`: Paste the raw JSON string from your `firebase-service-account.json` file. (The app will automatically detect this env variable if the file is missing).

### Deploying the Frontend (Vercel)
1. Import your project into [Vercel](https://vercel.com).
2. Set the Root Directory to `frontend`.
3. The Build Command (`npm run build`) and Output Directory (`dist`) should be auto-detected.
4. Add all your `VITE_FIREBASE_*` environment variables.
5. Set `VITE_API_URL` to the live URL of your deployed Render backend (e.g., `https://taskflow-api.onrender.com`).
6. Deploy!
