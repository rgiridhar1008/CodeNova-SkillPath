from __future__ import annotations

import json
from typing import Any

from openai import OpenAI
from services.gemini_service import generate_with_gemini


def _fallback_roadmap(career: str, missing_skills: list[str]) -> dict[str, Any]:
    prioritized = missing_skills[:6]
    return {
        "summary": f"A 3-month execution-focused plan to close your {career} skill gaps.",
        "months": [
            {
                "month": "Month 1",
                "focus": "Fundamentals and setup",
                "weeklyPlan": [
                    "Week 1: Baseline assessment and environment setup.",
                    f"Week 2: Learn core concepts of {prioritized[0] if prioritized else 'the role fundamentals'}.",
                    f"Week 3: Practice {prioritized[1] if len(prioritized) > 1 else 'hands-on exercises'}.",
                    "Week 4: Build a mini project and document lessons learned."
                ]
            },
            {
                "month": "Month 2",
                "focus": "Applied projects",
                "weeklyPlan": [
                    "Week 5: Intermediate concepts and architecture patterns.",
                    "Week 6: Build project milestone 1.",
                    "Week 7: Add testing, monitoring, or evaluation.",
                    "Week 8: Refactor and present your solution."
                ]
            },
            {
                "month": "Month 3",
                "focus": "Portfolio and interview readiness",
                "weeklyPlan": [
                    "Week 9: Capstone project planning.",
                    "Week 10: Implement capstone and gather feedback.",
                    "Week 11: Polish portfolio and resume.",
                    "Week 12: Mock interviews and final review."
                ]
            }
        ],
        "projects": [
            f"Portfolio project 1 targeting {career} fundamentals.",
            f"Portfolio project 2 covering {', '.join(prioritized[:3]) or 'core competencies'}.",
            "Capstone: production-style end-to-end project with documentation."
        ]
    }


def generate_roadmap_with_ai(
    api_key: str,
    model: str,
    career: str,
    matched_skills: list[str],
    missing_skills: list[str],
    strength_areas: list[str],
    gemini_api_key: str = "",
    gemini_model: str = "gemini-1.5-flash",
) -> dict[str, Any]:
    prompt = f"""
You are a senior career mentor. Generate a strict JSON roadmap for this student.

Career Target: {career}
Matched Skills: {matched_skills}
Missing Skills: {missing_skills}
Strength Areas: {strength_areas}

Return valid JSON only with this schema:
{{
  "summary": "string",
  "months": [
    {{
      "month": "Month 1",
      "focus": "string",
      "weeklyPlan": ["Week 1 ...", "Week 2 ...", "Week 3 ...", "Week 4 ..."]
    }},
    {{
      "month": "Month 2",
      "focus": "string",
      "weeklyPlan": ["Week 5 ...", "Week 6 ...", "Week 7 ...", "Week 8 ..."]
    }},
    {{
      "month": "Month 3",
      "focus": "string",
      "weeklyPlan": ["Week 9 ...", "Week 10 ...", "Week 11 ...", "Week 12 ..."]
    }}
  ],
  "projects": ["string", "string", "string"]
}}
Constraints:
- Practical and interview-oriented.
- Include measurable outcomes.
- Keep weekly tasks concise.
"""

    gemini_content = generate_with_gemini(
        api_key=gemini_api_key,
        model=gemini_model,
        prompt=prompt,
        temperature=0.4,
    )
    if gemini_content:
        try:
            return json.loads(gemini_content)
        except Exception:
            pass

    if not api_key:
        return _fallback_roadmap(career, missing_skills)

    client = OpenAI(api_key=api_key)
    try:
        response = client.chat.completions.create(
            model=model,
            temperature=0.4,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": "You return clean JSON only."},
                {"role": "user", "content": prompt},
            ],
        )
        content = response.choices[0].message.content
        return json.loads(content) if content else _fallback_roadmap(career, missing_skills)
    except Exception:
        return _fallback_roadmap(career, missing_skills)
