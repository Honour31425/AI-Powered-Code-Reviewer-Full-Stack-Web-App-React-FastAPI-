import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import {
  Code2, Upload, Play, ChevronDown, ArrowLeft, Download,
  Bug, Zap, BookOpen, Target, Star, AlertTriangle, Info, CheckCircle2,
  Loader2, FileCode, X, BarChart3, Sparkles
} from 'lucide-react'
import { reviewCode, reviewFile } from '../services/api.js'
import ResultsPanel from '../components/ResultsPanel.jsx'
import ComplexityMeter from '../components/ComplexityMeter.jsx'
import QualityScore from '../components/QualityScore.jsx'

const LANGUAGES = [
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'javascript', name: 'JavaScript', icon: '⚡' },
  { id: 'typescript', name: 'TypeScript', icon: '📘' },
  { id: 'java', name: 'Java', icon: '☕' },
  { id: 'cpp', name: 'C++', icon: '⚙️' },
  { id: 'go', name: 'Go', icon: '🐹' },
  { id: 'rust', name: 'Rust', icon: '🦀' },
  { id: 'ruby', name: 'Ruby', icon: '💎' },
]

const SAMPLE_CODES = {
  python: `def find_duplicates(arr):
    seen = []  # Bug: unused variable
    duplicates = []
    
    # O(n²) - can be optimized!
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j]:
                if arr[i] not in duplicates:
                    duplicates.append(arr[i])
    
    return duplicates


def calculate_total(items=[]):  # Bug: mutable default
    total = 0
    for item in items:
        total = total + item  # Can use += 
    return total


def process_data(data):
    try:
        result = data['value'] * 2
        return result
    except:  # Bug: bare except
        pass

result = find_duplicates([1, 2, 3, 2, 4, 3])
print(result)`,

  javascript: `function findDuplicates(arr) {
  var seen = [];  // Use const/let instead
  var duplicates = [];
  
  // O(n²) complexity - can be improved
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        if (!duplicates.includes(arr[i])) {
          duplicates.push(arr[i]);
        }
      }
    }
  }
  return duplicates;
}

function fetchUserData(userId) {
  // No error handling!
  fetch('/api/users/' + userId)
    .then(res => res.json())
    .then(data => {
      console.log(data);  // Debug log left in
    });
}`,
}

const TABS = [
  { id: 'bugs', label: 'Bugs', icon: <Bug size={14} /> },
  { id: 'optimizations', label: 'Optimizations', icon: <Zap size={14} /> },
  { id: 'clean_code', label: 'Clean Code', icon: <BookOpen size={14} /> },
  { id: 'best_practices', label: 'Best Practices', icon: <Target size={14} /> },
]

export default function ReviewDashboard() {
  const navigate = useNavigate()
  const [code, setCode] = useState(SAMPLE_CODES.python)
  const [language, setLanguage] = useState('python')
  const [langDropdown, setLangDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState('bugs')
  const [uploadedFile, setUploadedFile] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return
    setUploadedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setCode(e.target.result)
    reader.readAsText(file)
    toast.success(`Loaded: ${file.name}`)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/plain': ['.py', '.js', '.ts', '.java', '.cpp', '.go', '.rb', '.php', '.rs', '.c'] },
    maxFiles: 1,
  })

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to analyze')
      return
    }
    setLoading(true)
    setResults(null)
    try {
      let data
      if (uploadedFile) {
        data = await reviewFile(uploadedFile, language)
      } else {
        data = await reviewCode(code, language)
      }
      setResults(data)
      setActiveTab('bugs')
      toast.success('Analysis complete!')
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.detail || 'Analysis failed. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = () => {
    if (!results) return
    const report = generateReport(results, code, language)
    const blob = new Blob([report], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code-review-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Report downloaded!')
  }

  const currentLang = LANGUAGES.find(l => l.id === language)

  const totalIssues = results
    ? (results.bugs?.length || 0) + (results.optimizations?.length || 0)
    : 0

  return (
    <div className="min-h-screen bg-void text-text-primary flex flex-col">
      {/* Top bar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/5 glass-dark z-20 sticky top-0"
      >
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-text-muted hover:text-text-primary transition-colors text-sm">
            <ArrowLeft size={15} /> Back
          </button>
          <div className="w-px h-5 bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4fc3f7, #a855f7)' }}>
              <Code2 size={13} color="white" />
            </div>
            <span className="font-display font-semibold text-sm">CodeReview<span className="text-neon-blue">.ai</span></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {results && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleDownloadReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-secondary border border-white/10 hover:border-neon-blue/30 hover:text-neon-blue transition-all"
            >
              <Download size={12} /> Download Report
            </motion.button>
          )}
          <div className="text-xs font-mono text-text-muted px-2 py-1 rounded glass">
            {code.split('\n').length} lines
          </div>
        </div>
      </motion.header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor Panel */}
        <div className="flex flex-col w-full lg:w-1/2 border-r border-white/5">
          {/* Editor toolbar */}
          <div className="flex items-center gap-3 px-4 py-2 border-b border-white/5">
            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdown(!langDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono text-text-secondary border border-white/10 hover:border-neon-blue/30 hover:text-neon-blue transition-all glass"
              >
                <span>{currentLang?.icon}</span>
                <span>{currentLang?.name}</span>
                <ChevronDown size={12} className={`transition-transform ${langDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {langDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full mt-1 left-0 w-44 rounded-xl glass-dark border border-white/10 overflow-hidden z-30 shadow-glass"
                  >
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.id}
                        onClick={() => {
                          setLanguage(lang.id)
                          setLangDropdown(false)
                          if (SAMPLE_CODES[lang.id]) setCode(SAMPLE_CODES[lang.id])
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-mono hover:bg-white/5 transition-colors text-left ${language === lang.id ? 'text-neon-blue' : 'text-text-secondary'}`}
                      >
                        <span>{lang.icon}</span> {lang.name}
                        {language === lang.id && <CheckCircle2 size={10} className="ml-auto text-neon-blue" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* File upload */}
            <div {...getRootProps()} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-dashed cursor-pointer transition-all ${isDragActive ? 'border-neon-blue text-neon-blue' : 'border-white/20 text-text-muted hover:border-white/40'}`}>
              <input {...getInputProps()} />
              <Upload size={11} />
              <span>{uploadedFile ? uploadedFile.name : 'Upload file'}</span>
              {uploadedFile && <X size={10} onClick={(e) => { e.stopPropagation(); setUploadedFile(null) }} className="text-neon-red hover:opacity-80" />}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => {
                  setCode(SAMPLE_CODES[language] || SAMPLE_CODES.python)
                  setResults(null)
                }}
                className="text-xs text-text-muted hover:text-text-secondary px-2 py-1.5 rounded transition-colors"
              >
                Load Sample
              </button>
              <button
                onClick={() => { setCode(''); setResults(null); setUploadedFile(null) }}
                className="text-xs text-text-muted hover:text-neon-red px-2 py-1.5 rounded transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative min-h-[300px]">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={(val) => setCode(val || '')}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                renderLineHighlight: 'line',
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                wordWrap: 'on',
                automaticLayout: true,
              }}
            />
          </div>

          {/* Analyze button */}
          <div className="p-4 border-t border-white/5">
            <motion.button
              onClick={handleAnalyze}
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-void disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              style={{ background: loading ? '#4fc3f750' : 'linear-gradient(135deg, #4fc3f7, #a855f7)' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Play size={18} />
                  <span>Analyze Code</span>
                  <Sparkles size={15} />
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Right: Results Panel */}
        <div className="hidden lg:flex flex-col w-1/2 overflow-y-auto">
          <AnimatePresence mode="wait">
            {!results && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex items-center justify-center p-12 text-center"
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <BarChart3 size={28} className="text-text-muted" />
                  </div>
                  <h3 className="font-display font-semibold text-text-secondary mb-2">No Analysis Yet</h3>
                  <p className="text-text-muted text-sm max-w-xs">Paste your code in the editor and click "Analyze Code" to get AI-powered feedback.</p>
                </div>
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex items-center justify-center p-12"
              >
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-2 border-neon-blue/20" />
                    <div className="absolute inset-0 rounded-full border-t-2 border-neon-blue animate-spin" />
                    <div className="absolute inset-3 rounded-full border-t-2 border-neon-purple animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                    <Brain size={20} className="absolute inset-0 m-auto text-neon-blue" />
                  </div>
                  <h3 className="font-display font-semibold text-text-primary mb-1">AI is Reviewing...</h3>
                  <p className="text-text-muted text-sm">Running AST analysis + Claude AI review</p>
                  <div className="mt-4 space-y-1.5">
                    {['Parsing AST...', 'Detecting patterns...', 'Running AI analysis...'].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.5 }}
                        className="text-xs font-mono text-text-muted flex items-center gap-2 justify-center"
                      >
                        <div className="w-1 h-1 rounded-full bg-neon-blue animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                        {step}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {results && !loading && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col h-full"
              >
                {/* Score cards */}
                <div className="p-4 border-b border-white/5 grid grid-cols-3 gap-3">
                  <QualityScore score={results.quality_score} />
                  <ComplexityMeter complexity={results.complexity} />
                  <div className="glass rounded-xl p-3 flex flex-col items-center justify-center border border-white/10">
                    <div className="text-2xl font-display font-bold text-neon-red">{totalIssues}</div>
                    <div className="text-xs text-text-muted mt-0.5">Total Issues</div>
                  </div>
                </div>

                {/* Summary */}
                {results.summary && (
                  <div className="px-4 py-3 border-b border-white/5">
                    <div className="flex items-start gap-2 p-3 rounded-xl glass border border-neon-blue/10 text-sm text-text-secondary">
                      <Info size={14} className="text-neon-blue shrink-0 mt-0.5" />
                      <span>{results.summary}</span>
                    </div>
                  </div>
                )}

                {/* Tabs */}
                <div className="flex border-b border-white/5 px-4 gap-1">
                  {TABS.map(tab => {
                    const count = results[tab.id]?.length || 0
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-all ${activeTab === tab.id ? 'border-neon-blue text-neon-blue' : 'border-transparent text-text-muted hover:text-text-secondary'}`}
                      >
                        {tab.icon}
                        {tab.label}
                        {count > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-neon-blue/20 text-neon-blue' : 'bg-white/10 text-text-muted'}`}>
                            {count}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <ResultsPanel results={results} activeTab={activeTab} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile results (below editor) */}
      {results && (
        <div className="lg:hidden border-t border-white/5">
          <div className="p-4 grid grid-cols-3 gap-3">
            <QualityScore score={results.quality_score} />
            <ComplexityMeter complexity={results.complexity} />
            <div className="glass rounded-xl p-3 flex flex-col items-center justify-center border border-white/10">
              <div className="text-2xl font-display font-bold text-neon-red">{totalIssues}</div>
              <div className="text-xs text-text-muted mt-0.5">Issues</div>
            </div>
          </div>
          <div className="flex border-b border-white/5 px-4 gap-1 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs whitespace-nowrap font-medium border-b-2 transition-all ${activeTab === tab.id ? 'border-neon-blue text-neon-blue' : 'border-transparent text-text-muted'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          <div className="p-4 max-h-[50vh] overflow-y-auto">
            <ResultsPanel results={results} activeTab={activeTab} />
          </div>
        </div>
      )}
    </div>
  )
}

function Brain({ size, className }) {
  return <Sparkles size={size} className={className} />
}

function generateReport(results, code, language) {
  const now = new Date().toLocaleString()
  return `# AI Code Review Report
Generated: ${now}
Language: ${language}
Quality Score: ${results.quality_score}/100

## Summary
${results.summary}

## Complexity
- Level: ${results.complexity?.level}
- Notation: ${results.complexity?.notation}
- ${results.complexity?.details}

## Bugs (${results.bugs?.length || 0})
${results.bugs?.map(b => `- [${b.severity?.toUpperCase()}] ${b.message}${b.line ? ` (line ${b.line})` : ''}${b.fix ? `\n  Fix: ${b.fix}` : ''}`).join('\n') || 'No bugs detected'}

## Optimizations (${results.optimizations?.length || 0})
${results.optimizations?.map(o => `- [${o.type?.toUpperCase()}] ${o.message}`).join('\n') || 'No optimizations suggested'}

## Clean Code Suggestions
${results.clean_code?.map(c => `- **${c.principle}**: ${c.message}`).join('\n') || 'N/A'}

## Best Practices
${results.best_practices?.map(b => `- [${b.category}] ${b.message}`).join('\n') || 'N/A'}

---
*Generated by CodeReview.ai*`
}
