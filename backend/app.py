from __future__ import annotations

from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from io import BytesIO
from threading import Lock, Thread
from time import sleep
from uuid import uuid4
from werkzeug.security import check_password_hash, generate_password_hash

from config import Config
from models import Database
from services.analysis_service import analyze_user_skills, get_all_skills
from services.mentor_service import generate_mentor_reply_with_ai
from services.pdf_parser import extract_text_from_pdf
from services.recommender_service import recommend_careers
from services.roadmap_service import generate_roadmap_with_ai
from services.skill_extractor import extract_skills
from utils.pdf_report import build_report_pdf


app = Flask(__name__)
CORS(app)
db = Database(
    mysql_host=Config.MYSQL_HOST,
    mysql_port=Config.MYSQL_PORT,
    mysql_user=Config.MYSQL_USER,
    mysql_password=Config.MYSQL_PASSWORD,
    mysql_db=Config.MYSQL_DB,
    sqlserver_host=Config.SQLSERVER_HOST,
    sqlserver_port=Config.SQLSERVER_PORT,
    sqlserver_user=Config.SQLSERVER_USER,
    sqlserver_password=Config.SQLSERVER_PASSWORD,
    sqlserver_db=Config.SQLSERVER_DB,
    sqlserver_driver=Config.SQLSERVER_DRIVER,
)
job_store = {}
job_lock = Lock()


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/health/db")
def health_db():
    db._ensure_connection()
    return jsonify({"status": "ok", "db": db.diagnostics()})


@app.post("/auth/register")
def auth_register():
    payload = request.get_json(force=True, silent=True) or {}
    name = str(payload.get("name", "")).strip() or "Learner"
    email = str(payload.get("email", "")).strip().lower()
    password = str(payload.get("password", "")).strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters."}), 400
    if db.mode == "none":
        return jsonify({"error": "Database is not configured."}), 500

    existing = db.get_user_by_email(email)
    if existing:
        return jsonify({"error": "User already exists. Please login."}), 409

    user_id = db.create_user(name, email, generate_password_hash(password))
    db.save_event("auth_register", {"userId": user_id, "email": email})
    return jsonify({"ok": True, "user": {"id": user_id, "name": name, "email": email}})


@app.post("/auth/login")
def auth_login():
    payload = request.get_json(force=True, silent=True) or {}
    email = str(payload.get("email", "")).strip().lower()
    password = str(payload.get("password", "")).strip()
    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400
    if db.mode == "none":
        return jsonify({"error": "Database is not configured."}), 500

    user = db.get_user_by_email(email)
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid email or password."}), 401

    db.save_event("auth_login", {"userId": user["id"], "email": user["email"]})
    return jsonify({"ok": True, "user": {"id": user["id"], "name": user["name"], "email": user["email"]}})


@app.get("/users")
def list_users():
    users = db.list_users(limit=200)
    return jsonify({"users": users})


@app.get("/students")
def list_students():
    query = str(request.args.get("q", "")).strip()
    students = db.list_students(query=query, limit=300)
    if not students and not query:
        seed = [
            ("Ananya R", "CSE001", 1830),
            ("Rohit K", "CSE002", 1710),
            ("Meera P", "CSE003", 1645),
            ("Kiran S", "CSE004", 1480),
        ]
        for name, roll_number, xp in seed:
            try:
                db.create_student(name, roll_number, xp)
            except Exception:
                pass
        students = db.list_students(query="", limit=300)
    return jsonify({"students": students})


@app.post("/students")
def create_student():
    payload = request.get_json(force=True, silent=True) or {}
    name = str(payload.get("name", "")).strip()
    roll_number = str(payload.get("rollNumber", "")).strip().upper()
    xp = int(payload.get("xp", 0) or 0)

    if not name or not roll_number:
        return jsonify({"error": "Name and roll number are required."}), 400
    if xp < 0:
        return jsonify({"error": "XP cannot be negative."}), 400

    try:
        student_id = db.create_student(name=name, roll_number=roll_number, xp=xp)
        if not student_id:
            return jsonify({"error": "Unable to create student."}), 500
        return jsonify({"ok": True, "id": student_id})
    except Exception:
        return jsonify({"error": "Roll number already exists or data is invalid."}), 409


@app.delete("/students/<int:student_id>")
def delete_student(student_id: int):
    ok = db.delete_student(student_id)
    if not ok:
        return jsonify({"error": "Student not found."}), 404
    return jsonify({"ok": True})


def _update_job(job_id: str, **fields):
    with job_lock:
        if job_id in job_store:
            job_store[job_id].update(fields)


def _run_analysis_job(job_id: str, payload: dict):
    try:
        career = payload.get("career", "").strip()
        skills = payload.get("skills", "")
        resume_text = payload.get("resumeText", "")
        if not career:
            _update_job(job_id, status="failed", progress=100, message="Career is required.")
            return

        _update_job(job_id, status="running", progress=15, message="Analyzing your current skills...")
        sleep(0.25)
        analysis = analyze_user_skills(career, skills, resume_text)

        _update_job(job_id, progress=58, message="Calculating match score and skill gaps...")
        sleep(0.25)
        db.save_session({"type": "analysis", "analysis": analysis, "input": payload})

        _update_job(job_id, progress=76, message="Generating AI roadmap...")
        roadmap = generate_roadmap_with_ai(
            api_key=Config.OPENAI_API_KEY,
            model=Config.OPENAI_MODEL,
            career=analysis.get("career", ""),
            matched_skills=analysis.get("matchedSkills", []),
            missing_skills=analysis.get("missingSkills", []),
            strength_areas=analysis.get("strengthAreas", []),
            gemini_api_key=Config.GEMINI_API_KEY,
            gemini_model=Config.GEMINI_MODEL,
        )
        db.save_session({"type": "roadmap", "analysis": analysis, "roadmap": roadmap})

        _update_job(
            job_id,
            status="completed",
            progress=100,
            message="Done! Redirecting to your dashboard.",
            result={"analysis": analysis, "roadmap": roadmap},
        )
    except Exception as e:
        _update_job(job_id, status="failed", progress=100, message=str(e))


@app.post("/upload-resume")
def upload_resume():
    file = request.files.get("resume")
    if not file:
        return jsonify({"error": "No resume file uploaded."}), 400
    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Only PDF files are supported."}), 400

    text = extract_text_from_pdf(file.stream)
    skills = extract_skills(text, get_all_skills())
    db.save_event("upload_resume", {"filename": file.filename, "extractedSkills": skills[:15]})
    return jsonify({"resumeText": text, "extractedSkills": skills})


@app.post("/resume-analyzer")
def resume_analyzer():
    file = request.files.get("resume")
    if not file:
        return jsonify({"error": "No resume file uploaded."}), 400

    if file.filename.lower().endswith(".pdf"):
        text = extract_text_from_pdf(file.stream)
    else:
        try:
            text = file.stream.read().decode("utf-8", errors="ignore")
        except Exception:
            return jsonify({"error": "Unsupported file format. Upload PDF or DOC text export."}), 400

    all_skills = get_all_skills()
    extracted = extract_skills(text, all_skills)
    recommendations = recommend_careers(extracted, limit=1)
    missing = recommendations[0]["missingSkills"] if recommendations else []
    score = min(100, max(35, len(extracted) * 4))

    response = {
        "resumeScore": score,
        "extractedSkills": extracted,
        "missingSkillsVsIndustry": missing,
        "tips": [
            "Add measurable outcomes in project bullets.",
            "Mirror role-specific keywords from job descriptions.",
            "Keep summary aligned to one target career path.",
        ],
    }
    db.save_event("resume_analyzer", {"filename": file.filename, "response": response})
    return jsonify(response)


@app.get("/skills/suggest")
def suggest_skills():
    query = request.args.get("q", "").strip().lower()
    limit = min(int(request.args.get("limit", 8)), 20)
    if not query:
        return jsonify({"suggestions": []})
    suggestions = [skill for skill in get_all_skills() if query in skill.lower()][:limit]
    return jsonify({"suggestions": suggestions})


@app.get("/career-recommendations")
def career_recommendations():
    skills_raw = request.args.get("skills", "")
    user_skills = [s.strip() for s in skills_raw.split(",") if s.strip()]
    if not user_skills:
        db.save_event("career_recommendations", {"skills": [], "recommendations": []})
        return jsonify({"recommendations": []})
    recs = recommend_careers(user_skills, limit=3)
    db.save_event("career_recommendations", {"skills": user_skills, "recommendations": recs})
    return jsonify({"recommendations": recs})


@app.get("/learning-resources")
def learning_resources():
    resources = [
        {
            "title": "Machine Learning Specialization",
            "provider": "Coursera",
            "type": "Paid",
            "domain": "Tech",
            "url": "https://www.coursera.org/specializations/machine-learning-introduction",
        },
        {
            "title": "AI Engineering Roadmap Playlist",
            "provider": "YouTube",
            "type": "Free",
            "domain": "Tech",
            "url": "https://www.youtube.com/",
        },
        {
            "title": "AWS Cloud Practitioner",
            "provider": "AWS",
            "type": "Free",
            "domain": "Core",
            "url": "https://explore.skillbuilder.aws/learn",
        },
        {
            "title": "Google UX Design Certificate",
            "provider": "Coursera",
            "type": "Paid",
            "domain": "Design",
            "url": "https://www.coursera.org/professional-certificates/google-ux-design",
        },
    ]
    db.save_event("learning_resources", {"count": len(resources)})
    return jsonify({"resources": resources})


@app.post("/mentor-chat")
def mentor_chat():
    payload = request.get_json(force=True, silent=True) or {}
    message = str(payload.get("message", "")).strip()
    if not message:
        return jsonify({"error": "Message is required."}), 400

    reply = generate_mentor_reply_with_ai(
        api_key=Config.OPENAI_API_KEY,
        model=Config.OPENAI_MODEL,
        message=message,
        gemini_api_key=Config.GEMINI_API_KEY,
        gemini_model=Config.GEMINI_MODEL,
    )

    db.save_event("mentor_chat", {"message": message, "reply": reply})
    return jsonify({"reply": reply})


@app.get("/progress-summary")
def progress_summary():
    response = {
        "hoursThisWeek": 11,
        "streakDays": 7,
        "xp": 740,
        "completedTasks": 17,
        "milestones": [
            "Completed Week 4 roadmap module",
            "Published first portfolio project",
            "Finished 3 mock interview rounds",
        ],
    }
    db.save_event("progress_summary", response)
    return jsonify(response)


@app.get("/community/leaderboard")
def community_leaderboard():
    leaderboard = db.list_leaderboard(limit=20)
    if not leaderboard:
        seed = [
            ("Ananya R", 1830, 24),
            ("Rohit K", 1710, 19),
            ("Meera P", 1645, 21),
            ("You", 740, 7),
        ]
        for name, xp, streak in seed:
            db.add_leaderboard_entry(name, xp, streak)
        leaderboard = db.list_leaderboard(limit=20) or [
            {"name": "Ananya R", "xp": 1830, "streak": 24},
            {"name": "Rohit K", "xp": 1710, "streak": 19},
            {"name": "Meera P", "xp": 1645, "streak": 21},
            {"name": "You", "xp": 740, "streak": 7},
        ]
    db.save_event("community_leaderboard", {"count": len(leaderboard)})
    return jsonify({"leaderboard": leaderboard})


@app.get("/community/groups")
def community_groups():
    groups = db.list_groups(limit=50)
    if not groups:
        seed = [
            ("AI Interview Sprint", "Mock interviews and system design drills"),
            ("Data Science Build Club", "Weekly portfolio project shipping"),
            ("Cloud Certification Cohort", "AWS and DevOps exam prep"),
        ]
        for name, topic in seed:
            db.create_group(name, topic)
        groups = db.list_groups(limit=50) or [
            {"id": 1, "name": "AI Interview Sprint", "topic": "Mock interviews and system design drills", "members": 86},
            {"id": 2, "name": "Data Science Build Club", "topic": "Weekly portfolio project shipping", "members": 54},
            {"id": 3, "name": "Cloud Certification Cohort", "topic": "AWS and DevOps exam prep", "members": 61},
        ]
    db.save_event("community_groups_list", {"count": len(groups)})
    return jsonify({"groups": groups})


@app.post("/community/groups")
def create_community_group():
    payload = request.get_json(force=True, silent=True) or {}
    name = str(payload.get("name", "")).strip()
    topic = str(payload.get("topic", "")).strip()
    if not name or not topic:
        return jsonify({"error": "Group name and topic are required."}), 400
    group_id = db.create_group(name, topic)
    db.save_event("community_groups_create", {"groupId": group_id, "name": name})
    return jsonify({"groupId": group_id, "ok": bool(group_id)})


@app.post("/community/groups/<int:group_id>/join")
def join_community_group(group_id: int):
    ok = db.join_group(group_id)
    db.save_event("community_groups_join", {"groupId": group_id, "ok": ok})
    if not ok:
        return jsonify({"error": "Group not found."}), 404
    return jsonify({"ok": True})


@app.get("/admin/analytics")
def admin_analytics():
    response = {
        "usersTotal": 12540,
        "weeklyActiveUsers": 3820,
        "topCareerPaths": ["AI Engineer", "Data Scientist", "Web Developer"],
        "skillTrends": [
            {"skill": "RAG", "growth": 34},
            {"skill": "MLOps", "growth": 29},
            {"skill": "Cloud Security", "growth": 21},
        ],
        "usageByPage": [
            {"page": "Dashboard", "views": 8820},
            {"page": "Skill Analyzer", "views": 7130},
            {"page": "Learning Hub", "views": 5220},
        ],
    }
    db.save_event("admin_analytics", response)
    return jsonify(response)


@app.post("/notifications/preview")
def notifications_preview():
    payload = request.get_json(force=True, silent=True) or {}
    stagnation_days = int(payload.get("stagnationDays", 0))
    alerts = ["Weekly roadmap review due on Sunday."]
    if stagnation_days >= 5:
        alerts.append("Skill stagnation alert: no progress in 5+ days.")
    alerts.append("Reminder: complete at least 3 focused sessions this week.")
    db.save_event("notifications_preview", {"stagnationDays": stagnation_days, "alerts": alerts})
    return jsonify({"alerts": alerts})


@app.post("/start-analysis-job")
def start_analysis_job():
    payload = request.get_json(force=True, silent=True) or {}
    job_id = uuid4().hex
    with job_lock:
        job_store[job_id] = {
            "jobId": job_id,
            "status": "queued",
            "progress": 5,
            "message": "Job queued...",
            "result": None,
        }
    Thread(target=_run_analysis_job, args=(job_id, payload), daemon=True).start()
    db.save_event("start_analysis_job", {"jobId": job_id, "input": payload})
    return jsonify({"jobId": job_id})


@app.get("/job-status/<job_id>")
def get_job_status(job_id):
    with job_lock:
        job = job_store.get(job_id)
    if not job:
        return jsonify({"error": "Job not found."}), 404
    return jsonify(job)


@app.post("/analyze-skills")
def analyze_skills():
    payload = request.get_json(force=True, silent=True) or {}
    selected_career = payload.get("career", "").strip()
    skills_input = payload.get("skills", "")
    resume_text = payload.get("resumeText", "")

    if not selected_career:
        return jsonify({"error": "Career is required."}), 400

    try:
        analysis = analyze_user_skills(selected_career, skills_input, resume_text)
        session_id = db.save_session({"type": "analysis", "analysis": analysis, "input": payload})
        db.save_event("analyze_skills", {"input": payload, "sessionId": session_id})
        return jsonify({"analysis": analysis, "sessionId": session_id})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@app.post("/generate-roadmap")
def generate_roadmap():
    payload = request.get_json(force=True, silent=True) or {}
    analysis = payload.get("analysis", {})
    if not analysis:
        return jsonify({"error": "Analysis payload is required."}), 400

    roadmap = generate_roadmap_with_ai(
        api_key=Config.OPENAI_API_KEY,
        model=Config.OPENAI_MODEL,
        career=analysis.get("career", ""),
        matched_skills=analysis.get("matchedSkills", []),
        missing_skills=analysis.get("missingSkills", []),
        strength_areas=analysis.get("strengthAreas", []),
        gemini_api_key=Config.GEMINI_API_KEY,
        gemini_model=Config.GEMINI_MODEL,
    )
    session_id = db.save_session({"type": "roadmap", "analysis": analysis, "roadmap": roadmap})
    db.save_event("generate_roadmap", {"analysisCareer": analysis.get("career"), "sessionId": session_id})
    return jsonify({"roadmap": roadmap, "sessionId": session_id})


@app.post("/download-report")
def download_report():
    payload = request.get_json(force=True, silent=True) or {}
    if not payload.get("analysis"):
        return jsonify({"error": "Analysis data is required for report generation."}), 400

    pdf_bytes = build_report_pdf(payload)
    db.save_event("download_report", {"analysisCareer": payload.get("analysis", {}).get("career", "")})
    return send_file(
        BytesIO(pdf_bytes),
        mimetype="application/pdf",
        as_attachment=True,
        download_name="skillpath-report.pdf",
    )


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=Config.PORT,
        debug=Config.FLASK_ENV == "development",
        threaded=False,
    )
