# CodeNova SkillPath

AI-powered career development platform for students and job seekers.

## Live Links
- Frontend (Vercel): https://code-nova-skill-path.vercel.app/


## Stack Used In This Project
- Frontend: React (Vite), Tailwind CSS, Framer Motion, Chart.js, Lucide React
- Backend: Flask, PyMuPDF, spaCy, OpenAI/Gemini integration
- Database: MySQL (Railway/Local via PyMySQL), optional SQL Server support
- Deployment: Vercel (frontend), Render (backend)

## Implemented Features
- Landing/Home page with modern SaaS UI
- Register/Login with backend auth
- Protected dashboard routes
- Skill input (manual + PDF resume upload)
- Skill extraction and skill-gap analysis
- Career match percentage and missing skills
- AI roadmap generation (weekly plan + projects)
- Resume analyzer page
- AI resume builder page
- Mock interview and aptitude prep pages
- Community + leaderboard + student CRUD
- Progress analytics and notifications preview
- PDF report download
- Dark/Light mode

## Main Frontend Routes
- `/` Home
- `/login`, `/register`
- `/dashboard`
- `/skill-analyzer`
- `/career-paths`
- `/learning-roadmap`
- `/resume-analyzer`
- `/resume-builder`
- `/mock-interview`
- `/aptitude-prep`
- `/community`
- `/progress-analytics`
- `/profile`, `/settings`
- `/about`

## API Endpoints (Used)
- `GET /health`
- `GET /health/db`
- `POST /auth/register`
- `POST /auth/login`
- `GET /users`
- `GET /students`, `POST /students`, `DELETE /students/:id`
- `POST /upload-resume`
- `POST /resume-analyzer`
- `GET /skills/suggest`
- `GET /career-recommendations`
- `GET /learning-resources`
- `POST /mentor-chat`
- `GET /progress-summary`
- `GET /community/leaderboard`
- `GET /community/groups`
- `POST /community/groups`
- `POST /community/groups/:id/join`
- `GET /admin/analytics`
- `POST /notifications/preview`
- `POST /start-analysis-job`
- `GET /job-status/:jobId`
- `POST /analyze-skills`
- `POST /generate-roadmap`
- `POST /download-report`

## Local Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Required Environment Variables

Backend (`backend/.env`)
```env
FLASK_ENV=development
PORT=5000

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DB=skillpathdb

OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o-mini
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-1.5-flash
```

Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000
```

## Deployment Notes
- In Vercel, set `VITE_API_BASE_URL=https://codenova-skillpath.onrender.com`
- In Render, set MySQL env vars to Railway public values (`MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`)
- After any env change, redeploy backend/frontend

## Team
Developed by Team CodeNova.
