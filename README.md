# AI Skill Gap Analyzer & Career Roadmap Generator

A complete end-to-end hackathon-ready web app that:
- analyzes a student's current skills (manual input + resume PDF),
- computes role match percentage,
- identifies missing/strong skills,
- generates a structured 3-month AI roadmap,
- and exports the result as a PDF report.

## Tech Stack
- Frontend: React + Vite, Tailwind CSS, Framer Motion, Chart.js, Lucide React
- Backend: Flask REST API, spaCy, PyMuPDF, OpenAI API
- Database: MongoDB Atlas
- Deployment: Vercel (frontend) + Render (backend)

## Folder Structure
```text
SkillPath/
├─ backend/
│  ├─ app.py
│  ├─ config.py
│  ├─ models.py
│  ├─ requirements.txt
│  ├─ Procfile
│  ├─ .env.example
│  ├─ data/
│  │  └─ careers.json
│  ├─ services/
│  │  ├─ analysis_service.py
│  │  ├─ pdf_parser.py
│  │  ├─ roadmap_service.py
│  │  └─ skill_extractor.py
│  └─ utils/
│     └─ pdf_report.py
├─ frontend/
│  ├─ src/
│  │  ├─ api/client.js
│  │  ├─ components/
│  │  │  ├─ Layout.jsx
│  │  │  ├─ LoadingOverlay.jsx
│  │  │  ├─ MatchChart.jsx
│  │  │  └─ RoadmapTimeline.jsx
│  │  ├─ data/demoData.js
│  │  ├─ pages/
│  │  │  ├─ HomePage.jsx
│  │  │  ├─ SkillInputPage.jsx
│  │  │  └─ ResultsDashboard.jsx
│  │  ├─ App.jsx
│  │  ├─ index.css
│  │  └─ main.jsx
│  ├─ package.json
│  ├─ tailwind.config.js
│  ├─ postcss.config.js
│  ├─ vite.config.js
│  ├─ vercel.json
│  └─ .env.example
├─ render.yaml
├─ .gitignore
└─ README.md
```

## Core Features Implemented
- Home page with premium SaaS hero UI + gradient/glassmorphism
- Skill input page:
  - manual skills textarea
  - real-time skill autocomplete suggestions
  - career dropdown
  - resume PDF upload + NLP skill extraction
  - demo data button
  - animated loading state with real-time progress
- Backend processing:
  - PDF text extraction using PyMuPDF
  - skill extraction using spaCy PhraseMatcher + regex fallback
  - role-based gap analysis from `careers.json`
- AI roadmap generation:
  - OpenAI JSON output format
  - 3-month timeline + weekly plans + projects
  - fallback roadmap when API key is missing
- Dashboard:
  - circular match chart
  - missing skills tags
  - strength areas
  - roadmap timeline
  - course recommendation cards
  - report download as PDF
- Dark/Light theme toggle
- MongoDB persistence for analysis + roadmap sessions
- Realtime analysis job engine (background worker + polling)

## Database Schema (MongoDB)
Collection: `sessions`
```json
{
  "_id": "ObjectId",
  "type": "analysis | roadmap",
  "input": {},
  "analysis": {},
  "roadmap": {},
  "createdAt": "ISODate"
}
```

## Backend API
Base URL: `http://localhost:5000`

1. `POST /upload-resume`
- Form-data: `resume` (PDF file)
- Returns: `resumeText`, `extractedSkills`

2. `GET /skills/suggest?q=<text>&limit=8`
- Returns: best matching skills from dataset (for live autocomplete)

3. `POST /start-analysis-job`
- JSON body:
```json
{
  "career": "AI Engineer",
  "skills": "Python, SQL, Docker",
  "resumeText": "optional extracted text"
}
```
- Returns: `jobId`

4. `GET /job-status/<jobId>`
- Returns real-time state:
```json
{
  "jobId": "string",
  "status": "queued | running | completed | failed",
  "progress": 0,
  "message": "string",
  "result": {
    "analysis": {},
    "roadmap": {}
  }
}
```

5. `POST /analyze-skills`
- JSON body:
```json
{
  "career": "AI Engineer",
  "skills": "Python, SQL, Docker",
  "resumeText": "optional extracted text"
}
```
- Returns: `analysis`, `sessionId`

6. `POST /generate-roadmap`
- JSON body:
```json
{
  "analysis": {}
}
```
- Returns: `roadmap`, `sessionId`

7. `POST /download-report`
- JSON body:
```json
{
  "analysis": {},
  "roadmap": {}
}
```
- Returns: downloadable PDF file.

## Local Setup

### 1) Backend
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
pip install -r requirements.txt
copy .env.example .env
python app.py
```

### 2) Frontend
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173` and calls backend using `VITE_API_BASE_URL`.

## Environment Variables

Backend (`backend/.env`)
```env
FLASK_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
MONGODB_DB=skillpath
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o-mini
```

Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000
```

## Deployment Guide

### Deploy Backend on Render
1. Push repository to GitHub.
2. Create a new Render Web Service.
3. Root directory: `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `gunicorn app:app`
6. Add env vars:
   - `MONGODB_URI`
   - `MONGODB_DB`
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
7. Deploy and copy the backend URL.

Alternative: use the provided `render.yaml` for Blueprint deploy.

### Deploy Frontend on Vercel
1. Import GitHub repo in Vercel.
2. Set project root to `frontend`.
3. Add env var:
   - `VITE_API_BASE_URL=https://your-render-backend.onrender.com`
4. Deploy.

`frontend/vercel.json` includes SPA rewrite support.

## Notes for Hackathon Demo
- If OpenAI key is not set, roadmap still works via fallback generator.
- Resume upload only accepts PDF format.
- Career datasets are easy to extend by editing `backend/data/careers.json`.
# CodeNova-SkillPath
