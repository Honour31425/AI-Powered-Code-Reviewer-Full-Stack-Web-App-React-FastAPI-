from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional
import json

from analyzer.code_analyzer import CodeAnalyzer
from ai.llm_client import LLMClient

router = APIRouter()
analyzer = CodeAnalyzer()
llm_client = LLMClient()

class CodeReviewRequest(BaseModel):
    code: str
    language: str = "python"
    filename: Optional[str] = None

class ReviewResponse(BaseModel):
    bugs: list
    optimizations: list
    complexity: dict
    clean_code: list
    best_practices: list
    quality_score: int
    summary: str

@router.post("/review", response_model=ReviewResponse)
async def review_code(request: CodeReviewRequest):
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")
    
    if len(request.code) > 50000:
        raise HTTPException(status_code=400, detail="Code exceeds maximum length of 50,000 characters")
    
    # Static analysis
    static_results = analyzer.analyze(request.code, request.language)
    
    # AI-powered deep review
    ai_results = await llm_client.review_code(request.code, request.language, static_results)
    
    # Merge results
    merged = {
        "bugs": ai_results.get("bugs", []) + static_results.get("bugs", []),
        "optimizations": ai_results.get("optimizations", []) + static_results.get("optimizations", []),
        "complexity": ai_results.get("complexity", static_results.get("complexity", {})),
        "clean_code": ai_results.get("clean_code", []),
        "best_practices": ai_results.get("best_practices", []),
        "quality_score": ai_results.get("quality_score", static_results.get("quality_score", 70)),
        "summary": ai_results.get("summary", "Code analysis complete.")
    }
    
    return merged

@router.post("/review/upload")
async def review_uploaded_file(file: UploadFile = File(...), language: str = "python"):
    content = await file.read()
    try:
        code = content.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="File must be a valid text file")
    
    request = CodeReviewRequest(code=code, language=language, filename=file.filename)
    return await review_code(request)

@router.get("/languages")
async def get_supported_languages():
    return {
        "languages": [
            {"id": "python", "name": "Python", "icon": "🐍"},
            {"id": "javascript", "name": "JavaScript", "icon": "⚡"},
            {"id": "typescript", "name": "TypeScript", "icon": "📘"},
            {"id": "java", "name": "Java", "icon": "☕"},
            {"id": "cpp", "name": "C++", "icon": "⚙️"},
            {"id": "c", "name": "C", "icon": "🔧"},
            {"id": "go", "name": "Go", "icon": "🐹"},
            {"id": "rust", "name": "Rust", "icon": "🦀"},
            {"id": "ruby", "name": "Ruby", "icon": "💎"},
            {"id": "php", "name": "PHP", "icon": "🐘"},
        ]
    }
