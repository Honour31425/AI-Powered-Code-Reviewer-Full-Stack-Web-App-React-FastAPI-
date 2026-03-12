# 🤖 AI Code Reviewer

A production-grade full-stack AI Code Review web application built with **React + Vite + FastAPI + Claude AI**.

## Features

- 🔍 **AI-Powered Analysis** — Claude AI reviews code like a senior engineer
- 🐛 **Bug Detection** — Catches bugs, mutable defaults, bare excepts, unused variables  
- ⚡ **Performance Optimization** — Detects O(n²) loops, inefficient patterns
- 📊 **Complexity Analysis** — Cyclomatic complexity + Big O notation
- 🧹 **Clean Code** — SOLID, DRY, KISS principles feedback
- 📁 **File Upload** — Drag & drop source files
- 📥 **Download Report** — Export analysis as Markdown
- 🌐 **10+ Languages** — Python, JS, TS, Java, C++, Go, Rust and more
- 🎨 **Dark Developer UI** — VS Code-inspired glassmorphism design

## Tech Stack

**Frontend:**
- React 18 + Vite
- TailwindCSS
- Framer Motion (animations)
- Monaco Editor (VS Code editor)
- React Router

**Backend:**
- Python FastAPI
- Python AST (static analysis)
- Anthropic Claude API (AI analysis)
- Uvicorn

## Getting Started

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
export ANTHROPIC_API_KEY=your_key_here
python main.py
```

Backend runs on: http://localhost:8000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:3000

### Environment Variables

**Backend:** Set `ANTHROPIC_API_KEY` environment variable.

**Frontend:** Create `frontend/.env`:
```
VITE_API_URL=http://localhost:8000/api/v1
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/review` | Review code (JSON body) |
| POST | `/api/v1/review/upload` | Review uploaded file |
| GET | `/api/v1/languages` | Get supported languages |
| GET | `/health` | Health check |

### Request Example

```json
POST /api/v1/review
{
  "code": "def hello():\n    x = 1\n    print('hello')",
  "language": "python"
}
```

### Response Example

```json
{
  "bugs": [{"severity": "low", "message": "Variable 'x' unused", "line": 2, "type": "UnusedVariable"}],
  "optimizations": [],
  "complexity": {"level": "Low", "score": 2, "notation": "O(n)", "details": "..."},
  "clean_code": [{"principle": "KISS", "message": "..."}],
  "best_practices": [],
  "quality_score": 85,
  "summary": "Clean, simple function..."
}
```

## Project Structure

```
ai-code-reviewer/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ResultsPanel.jsx    # Tabbed results display
│   │   │   ├── QualityScore.jsx    # Circular score meter
│   │   │   └── ComplexityMeter.jsx # Complexity bar
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx     # Hero + features page
│   │   │   └── ReviewDashboard.jsx # Main editor + results
│   │   └── services/
│   │       └── api.js              # Axios API client
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── backend/
    ├── main.py                     # FastAPI app
    ├── api/routes.py               # API endpoints
    ├── analyzer/code_analyzer.py   # AST static analysis
    ├── ai/llm_client.py            # Claude AI integration
    └── requirements.txt
```

## License

MIT — Feel free to use for portfolio or production projects.
