from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from services.skill_extractor import extract_skills


CAREERS_PATH = Path(__file__).resolve().parent.parent / "data" / "careers.json"

with CAREERS_PATH.open("r", encoding="utf-8") as f:
    CAREER_DATA = json.load(f)


def get_all_skills() -> list[str]:
    skills = set()
    for details in CAREER_DATA.values():
        skills.update(details.get("skills", []))
    return sorted(skills)


def parse_manual_skills(text: str) -> list[str]:
    chunks = [part.strip() for part in text.replace("\n", ",").split(",")]
    return sorted({chunk for chunk in chunks if chunk})


def analyze_user_skills(
    selected_career: str,
    manual_skills_text: str = "",
    resume_text: str = "",
) -> dict[str, Any]:
    if selected_career not in CAREER_DATA:
        raise ValueError("Invalid career selected.")

    career_skills = set(CAREER_DATA[selected_career]["skills"])
    all_known_skills = get_all_skills()

    manual_skills = parse_manual_skills(manual_skills_text)
    resume_skills = extract_skills(resume_text, all_known_skills)
    user_skills = {s.strip() for s in (manual_skills + resume_skills) if s.strip()}

    matched = sorted(user_skills.intersection(career_skills))
    missing = sorted(career_skills.difference(user_skills))
    strengths = matched[: min(6, len(matched))]
    match_percentage = round((len(matched) / max(1, len(career_skills))) * 100, 2)

    return {
        "career": selected_career,
        "userSkills": sorted(user_skills),
        "matchedSkills": matched,
        "missingSkills": missing,
        "strengthAreas": strengths,
        "skillMatchPercentage": match_percentage,
        "careerSkills": sorted(career_skills),
        "recommendedCourses": CAREER_DATA[selected_career].get("courses", []),
    }
