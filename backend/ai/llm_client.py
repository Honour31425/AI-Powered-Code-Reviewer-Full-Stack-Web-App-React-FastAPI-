import json
import os
from typing import Dict, Any

try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False

REVIEW_PROMPT = """You are a senior software engineer conducting a production code review. Analyze the following {language} code thoroughly.

Provide your analysis in the following JSON format ONLY (no markdown, no extra text):
{{
  "bugs": [{{"severity": "critical|high|medium|low","message": "description","line": null,"type": "BugType","fix": "how to fix"}}],
  "optimizations": [{{"type": "performance|readability|design|security","severity": "high|medium|low","message": "suggestion","line": null,"example": "code example"}}],
  "complexity": {{"level": "Low|Medium|High|Very High","score": 50,"notation": "O(n)","details": "explanation","lines": 0}},
  "clean_code": [{{"principle": "DRY|SOLID|KISS","message": "suggestion","example": "code"}}],
  "best_practices": [{{"category": "naming|structure|error-handling|testing|security|documentation","message": "recommendation","severity": "high|medium|low"}}],
  "quality_score": 70,
  "summary": "2-3 sentence overall assessment"
}}

Static analysis found: {static_results}

Code:
```{language}
{code}
```

Respond with ONLY the JSON object."""


class LLMClient:
    def __init__(self):
        self.model = "claude-sonnet-4-20250514"
        api_key = os.environ.get("ANTHROPIC_API_KEY", "")
        if ANTHROPIC_AVAILABLE and api_key:
            self.client = anthropic.Anthropic(api_key=api_key)
            self.enabled = True
            print("AI analysis enabled")
        else:
            self.client = None
            self.enabled = False
            print("AI analysis disabled - using static analysis only")

    async def review_code(self, code: str, language: str, static_results: Dict) -> Dict[str, Any]:
        if not self.enabled:
            return self._fallback_response(language, static_results)
        static_summary = json.dumps({"bugs_count": len(static_results.get("bugs", [])), "quality_score": static_results.get("quality_score", 70)})
        prompt = REVIEW_PROMPT.format(language=language, code=code[:8000], static_results=static_summary)
        try:
            message = self.client.messages.create(model=self.model, max_tokens=4096, messages=[{"role": "user", "content": prompt}])
            response_text = message.content[0].text.strip()
            for prefix in ["```json", "```"]:
                if response_text.startswith(prefix):
                    response_text = response_text[len(prefix):]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            return json.loads(response_text.strip())
        except Exception as e:
            print(f"AI error: {e}")
            return self._fallback_response(language, static_results)

    def _fallback_response(self, language: str, static_results: Dict) -> Dict:
        return {
            "bugs": static_results.get("bugs", []),
            "optimizations": static_results.get("optimizations", []),
            "complexity": static_results.get("complexity", {"level": "Medium", "score": 50, "notation": "O(n)", "details": "Static analysis only. Add ANTHROPIC_API_KEY for AI review.", "lines": 0}),
            "clean_code": [{"principle": "General", "message": "Consider adding documentation and comments.", "example": ""}],
            "best_practices": [{"category": "documentation", "message": "Add docstrings to explain complex logic.", "severity": "medium"}],
            "quality_score": static_results.get("quality_score", 70),
            "summary": f"Static analysis complete for {language}. Add ANTHROPIC_API_KEY to enable full AI review."
        }
