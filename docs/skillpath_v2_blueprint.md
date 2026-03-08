# SkillPath V2 Blueprint

## 1. Updated Feature Architecture
- Experience Layer: Landing, Dashboard, Skill Analyzer, Career Paths, Learning Roadmap, Progress Analytics, Community, Settings, Admin.
- Intelligence Layer: Resume Analyzer, Career Recommender, Mentor Chat, Notifications Rules.
- Data Layer: User profiles, progress signals, leaderboard, resource saves, analytics snapshots.
- Platform Layer: Role guard, API caching, lazy-loaded routes, error boundaries, PWA shell.

## 2. UI Wireframe Description
- Landing: gradient hero, feature strip, trust stats, testimonials, CTA.
- Dashboard: KPI cards, quick actions, progress milestones.
- Skill Analyzer: skill input + resume upload + suggestions + job-progress overlay.
- Career Paths: recommendation list + confidence labels + radar chart.
- Roadmap: expandable weekly modules with completion tracking.
- Progress: line + bar charts for mastery and productivity.
- Community: leaderboard and group cards.
- Admin: growth metrics, trend cards, usage chart.

## 3. Component Structure
- `components/Layout.jsx`: sticky top nav + grouped sidebar.
- `components/ErrorBoundary.jsx`: global UI fail-safe.
- `components/PageSkeleton.jsx`: lazy-load fallback.
- `components/RoleGuard.jsx`: role-based route protection.
- Domain components remain under `components/` and page-level modules under `pages/`.

## 4. Suggested Tech Stack
- Frontend: React + Tailwind + Framer Motion + Chart.js + Axios.
- Backend: Flask + PyMuPDF + skill matching services + AI endpoints.
- Data: MongoDB now, Firestore integration-ready via repository abstraction.
- Infra: Vercel frontend + Render backend + PWA manifest/service worker.

## 5. Database Collections / Schema Guidance
- `users`: identity, profile, preferences, role.
- `sessions`: analysis snapshots and generated roadmaps.
- `progress`: streak, xp, milestones, weekly activity.
- `community`: leaderboard snapshots, groups, public profile toggles.
- `notifications`: schedule and alert history.
- `admin_metrics`: DAU, role trends, page usage.

## 6. API Endpoint Structure
- `POST /resume-analyzer`
- `GET /career-recommendations`
- `GET /learning-resources`
- `POST /mentor-chat`
- `GET /progress-summary`
- `GET /community/leaderboard`
- `POST /notifications/preview`
- `GET /admin/analytics`
- Existing: `/start-analysis-job`, `/job-status/:id`, `/upload-resume`, `/analyze-skills`, `/generate-roadmap`

## 7. UI Design System Guidelines
- Colors: deep blue primary, cyan/teal accents, neutral light backgrounds.
- Typography: Space Grotesk + Manrope.
- Surfaces: glass cards with blur, soft shadow, rounded corners.
- Interaction: fast hover transitions, readable focus states, mobile-first responsiveness.
- Accessibility: explicit labels, keyboard-safe controls, clear contrast.

## 8. Animations & Charts
- Loading: skeleton shimmer + progress overlay.
- Transitions: route-level lazy fallback and smooth card hover.
- Charts:
  - Radar: career fit comparison
  - Line: mastery timeline
  - Bar: weekly productivity and admin usage
  - Ring/Doughnut: readiness score
