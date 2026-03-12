#!/bin/bash
# AI Code Reviewer - Quick Start Script

echo "🤖 Starting AI Code Reviewer..."
echo ""

# Check for API key
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "⚠️  Warning: ANTHROPIC_API_KEY not set. AI analysis will use fallback mode."
  echo "   Set it with: export ANTHROPIC_API_KEY=sk-ant-api03-sEu...SQAA"
  echo ""
fi

# Start backend
echo "🐍 Starting FastAPI backend on port 8000..."
cd backend
pip install -r requirements.txt -q
python main.py &
BACKEND_PID=$!
cd ..

sleep 2

# Start frontend
echo "⚛️  Starting React frontend on port 3000..."
cd frontend
npm install --silent
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ App is running!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

wait $BACKEND_PID $FRONTEND_PID
