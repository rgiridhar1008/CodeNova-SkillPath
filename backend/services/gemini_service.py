from __future__ import annotations

import json
from urllib import error, parse, request


def generate_with_gemini(api_key: str, model: str, prompt: str, temperature: float = 0.5) -> str | None:
    if not api_key or not prompt.strip():
        return None

    model_name = model or "gemini-1.5-flash"
    endpoint = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{parse.quote(model_name)}:generateContent?key={parse.quote(api_key)}"
    )
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": temperature,
            "responseMimeType": "text/plain",
        },
    }
    data = json.dumps(payload).encode("utf-8")
    req = request.Request(
        endpoint,
        data=data,
        method="POST",
        headers={"Content-Type": "application/json"},
    )

    try:
        with request.urlopen(req, timeout=25) as resp:
            body = resp.read().decode("utf-8")
        parsed = json.loads(body)
        candidates = parsed.get("candidates", [])
        if not candidates:
            return None
        parts = candidates[0].get("content", {}).get("parts", [])
        text = "".join(part.get("text", "") for part in parts if isinstance(part, dict)).strip()
        return text or None
    except (error.URLError, error.HTTPError, TimeoutError, ValueError, KeyError):
        return None
