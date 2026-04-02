from google import genai
from app.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None


def recommendation_for_misses(evaluation):
    missed = evaluation.get("missed_variants", [])
    if not missed:
        return {
            "summary": "All variants detected.",
            "improvement": "Detection set is resilient for this scenario."
        }

    if not client:
        return {
            "summary": "AI key not configured.",
            "improvement": "Expand detection rules to handle obfuscation, renamed tools, and low-and-slow behavior."
        }

    prompt = f"""
You are a detection engineer.
A detection resilience test missed these variants:
{missed}

Return concise JSON with:
- summary
- improvement
- sigma_draft
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        import json
        return json.loads(response.text)
    except Exception:
        return {
            "summary": "AI request failed.",
            "improvement": "Review missed variants and broaden detection logic.",
            "sigma_draft": "title: Detection Improvement Draft"
        }