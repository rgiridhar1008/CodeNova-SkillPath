from __future__ import annotations

from typing import Any

from services.analysis_service import CAREER_DATA


def recommend_careers(user_skills: list[str], limit: int = 3) -> list[dict[str, Any]]:
    skills_lower = {s.lower() for s in user_skills if s.strip()}
    recommendations = []

    for career, details in CAREER_DATA.items():
        required = details.get("skills", [])
        required_lower = {s.lower() for s in required}
        matched = sorted({s for s in required if s.lower() in skills_lower})
        missing = sorted({s for s in required if s.lower() not in skills_lower})
        score = round((len(matched) / max(1, len(required))) * 100, 2)

        recommendations.append(
            {
                "career": career,
                "confidenceScore": score,
                "matchedSkills": matched,
                "missingSkills": missing[:8],
                "requiredSkills": required,
            }
        )

    recommendations.sort(key=lambda x: x["confidenceScore"], reverse=True)
    return recommendations[:limit]
