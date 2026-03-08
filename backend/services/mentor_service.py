from __future__ import annotations

from openai import OpenAI
from services.gemini_service import generate_with_gemini


def _fallback_reply(message: str) -> str:
    lower = message.lower()
    if "interview" in lower:
        return "Do 3 mock interviews this week, answer with STAR format, and review one weak area daily."
    if "resume" in lower:
        return "Tailor your resume to one role, include impact metrics, and add 2 strong project bullets."
    if "roadmap" in lower or "plan" in lower:
        return "Focus on your top 3 missing skills, with one mini-project every two weeks."
    return "Break your goal into weekly outputs and track consistency with short daily sessions."


def generate_mentor_reply_with_ai(
    api_key: str,
    model: str,
    message: str,
    gemini_api_key: str = "",
    gemini_model: str = "gemini-1.5-flash",
) -> str:
    if not message.strip():
        return "Please share your question so I can help."

    system_prompt = (
        "You are an AI Career Assistant for SkillPath.\n"
        "Your purpose is to help students and job seekers with career guidance, learning roadmaps, "
        "resume building, interview preparation, and skill development.\n\n"
        "Response style rules:\n"
        "- Be friendly, supportive, professional.\n"
        "- Use simple language and clear structure.\n"
        "- Prefer short bullet points over long paragraphs.\n"
        "- Give practical steps, not theory.\n"
        "- Motivate users if they are confused or stuck.\n\n"
        "Response behavior by query type:\n"
        "- Career paths: suggest roles, required skills, and a roadmap.\n"
        "- Skills: identify gaps, recommend resources, suggest projects.\n"
        "- Resume: provide ATS and section-wise improvement tips.\n"
        "- Interviews: give common questions and preparation strategies.\n"
        "- Confusion: ask simple clarifying questions and give a step-by-step plan.\n"
        "- Unrelated topic: politely steer back to career topics.\n\n"
        "Avoid jargon, irrelevant topics, negative tone, and verbose explanations.\n"
        "End with a supportive next-step line such as:\n"
        "- 'Let me know if you'd like a roadmap for this.'\n"
        "- 'I can help you prepare step-by-step.'"
    )
    full_prompt = f"{system_prompt}\n\nStudent message:\n{message}"

    gemini_reply = generate_with_gemini(
        api_key=gemini_api_key,
        model=gemini_model,
        prompt=full_prompt,
        temperature=0.5,
    )
    if gemini_reply:
        return gemini_reply

    if not api_key:
        return _fallback_reply(message)
    client = OpenAI(api_key=api_key)

    try:
        response = client.chat.completions.create(
            model=model,
            temperature=0.5,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
        )
        content = (response.choices[0].message.content or "").strip()
        return content or _fallback_reply(message)
    except Exception:
        return _fallback_reply(message)
