import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowRight, Zap, Shield, Brain, Code2, GitBranch, Terminal, ChevronRight, Star, Sparkles } from 'lucide-react'

const TYPED_STRINGS = [
  'Detect Bugs Instantly',
  'Optimize Performance',
  'Improve Code Quality',
  'Analyze Complexity',
]

const SAMPLE_CODE = `def find_duplicates(arr):
    seen = []
    duplicates = []
    
    # O(n²) - can be optimized!
    for i in range(len(arr)):
        for j in range(i+1, len(arr)):
            if arr[i] == arr[j]:
                if arr[i] not in duplicates:
                    duplicates.append(arr[i])
    
    return duplicates

result = find_duplicates([1,2,3,2,4,3])
print(result)  # unused variable 'seen'`

const FEATURES = [
  {
    icon: <Brain size={22} />, title: 'AI-Powered Analysis', color: '#4fc3f7',
    desc: 'This AI reviews your code like a senior engineer, catching subtle bugs and anti-patterns.'
  },
  {
    icon: <Zap size={22} />, title: 'Instant Feedback', color: '#a855f7',
    desc: 'Get detailed analysis in seconds. No waiting, no signup required for basic usage.'
  },
  {
    icon: <Shield size={22} />, title: 'Bug Detection', color: '#4ade80',
    desc: 'Catches critical bugs, memory leaks, undefined behavior and security vulnerabilities.'
  },
  {
    icon: <Terminal size={22} />, title: 'AST Static Analysis', color: '#fbbf24',
    desc: 'Python AST parsing detects unused variables, mutable defaults, and nested loops.'
  },
  {
    icon: <GitBranch size={22} />, title: 'Complexity Scoring', color: '#f87171',
    desc: 'Cyclomatic complexity analysis with Big O notation for time and space complexity.'
  },
  {
    icon: <Code2 size={22} />, title: 'Multi-Language', color: '#4fc3f7',
    desc: 'Supports Python, JavaScript, TypeScript, Java, C++, Go, Rust and more.'
  },
]

const LANGUAGES = ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go', 'Rust', 'Ruby', 'PHP', 'C']

export default function LandingPage() {
  const navigate = useNavigate()
  const [typedIndex, setTypedIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = TYPED_STRINGS[typedIndex]
    let timeout

    if (!isDeleting && displayText.length < current.length) {
      timeout = setTimeout(() => setDisplayText(current.slice(0, displayText.length + 1)), 80)
    } else if (!isDeleting && displayText.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 40)
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false)
      setTypedIndex((i) => (i + 1) % TYPED_STRINGS.length)
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, typedIndex])

  return (
    <div className="min-h-screen bg-void bg-grid text-text-primary overflow-hidden">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, #4fc3f7, transparent)' }} />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }} />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4fc3f7, #a855f7)' }}>
            <Code2 size={16} color="white" />
          </div>
          <span className="font-display font-semibold text-lg text-text-primary">CodeReview<span className="neon-text-blue">.ai</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
          <a href="#features" className="hover:text-neon-blue transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-neon-blue transition-colors">How it works</a>
          <a href="#languages" className="hover:text-neon-blue transition-colors">Languages</a>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/review')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-void"
          style={{ background: 'linear-gradient(135deg, #4fc3f7, #a855f7)' }}
        >
          Try Now <ArrowRight size={14} />
        </motion.button>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-6 glass border border-neon-blue/20 text-neon-blue"
            >
              <Sparkles size={12} />
              Made by BHAVYA 
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] mb-4"
            >
              AI Powered<br />
              <span className="gradient-text">Code Review</span><br />
              Assistant
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="h-10 flex items-center mb-4"
            >
              <span className="text-xl md:text-2xl font-mono text-neon-blue">
                {displayText}<span className="animate-pulse">|</span>
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="text-text-secondary text-lg leading-relaxed mb-10 max-w-lg"
            >
              Paste your code and get instant AI-powered analysis. Detect bugs, optimize performance, understand complexity, and learn clean code principles — all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(79, 195, 247, 0.4)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/review')}
                className="flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-void text-base"
                style={{ background: 'linear-gradient(135deg, #4fc3f7, #a855f7)' }}
              >
                Start Reviewing Code
                <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-text-secondary border border-white/10 hover:border-neon-blue/30 hover:text-neon-blue transition-all"
              >
                <Zap size={16} />
                See it in Action
              </motion.button>
            </motion.div>

          <motion.a
  href="https://github.com/Honour31425/AI-Powered-Code-Reviewer-Full-Stack-Web-App-React-FastAPI-"
  target="_blank"
  rel="noopener noreferrer"
  whileHover={{ scale: 1.04 }}
  whileTap={{ scale: 0.97 }}
  className="flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-text-secondary border border-white/10 hover:border-neon-blue/30 hover:text-neon-blue transition-all"
>
  <Star size={16} />
  View on GitHub
</motion.a>
          </div>

          {/* Code Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="flex-1 w-full max-w-xl"
          >
            <div className="relative">
              <div className="absolute -inset-px rounded-2xl opacity-60" style={{ background: 'linear-gradient(135deg, rgba(79,195,247,0.3), rgba(168,85,247,0.3))' }} />
              <div className="relative rounded-2xl overflow-hidden glass-dark border border-white/10">
                {/* Window bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  <span className="ml-3 text-xs font-mono text-text-muted">find_duplicates.py</span>
                  <div className="ml-auto flex items-center gap-1.5 text-xs text-neon-blue font-mono">
                    <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                    Analyzing...
                  </div>
                </div>

                {/* Code */}
                <pre className="p-5 text-xs font-mono text-text-secondary leading-relaxed overflow-x-auto">
                  {SAMPLE_CODE.split('\n').map((line, i) => (
                    <div key={i} className="flex">
                      <span className="w-6 text-text-muted select-none shrink-0">{i + 1}</span>
                      <span className={
                        line.includes('# O(n²)') ? 'text-neon-yellow' :
                        line.includes('def ') ? 'text-neon-blue' :
                        line.includes('return') || line.includes('for') || line.includes('if') ? 'text-neon-purple' :
                        line.includes('#') ? 'text-text-muted' :
                        'text-text-secondary'
                      }>{line}</span>
                    </div>
                  ))}
                </pre>

                {/* Results preview */}
                <div className="border-t border-white/5 p-4 space-y-2">
                  {[
                    { color: '#f87171', icon: '⚠', text: 'Unused variable "seen" detected (line 2)' },
                    { color: '#fbbf24', icon: '⚡', text: 'O(n²) nested loop → use set() for O(n)' },
                    { color: '#4ade80', icon: '✓', text: 'Quality Score: 62/100' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + i * 0.2 }}
                      className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg"
                      style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}
                    >
                      <span style={{ color: item.color }}>{item.icon}</span>
                      <span style={{ color: item.color }}>{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="text-sm font-mono text-neon-blue mb-3">// features</div>
          <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4">Everything You Need</h2>
          <p className="text-text-secondary max-w-lg mx-auto">A complete code analysis toolkit that combines static analysis with AI intelligence.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="glass rounded-2xl p-6 cursor-default group hover:border-opacity-40 transition-all"
              style={{ borderColor: `${f.color}20` }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                style={{ background: `${f.color}20`, color: f.color, border: `1px solid ${f.color}30` }}>
                {f.icon}
              </div>
              <h3 className="font-display font-semibold text-text-primary mb-2">{f.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="text-sm font-mono text-neon-purple mb-3">// how_it_works</div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">Simple. Fast. Smart.</h2>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 relative">
          {[
            { step: '01', title: 'Paste Your Code', desc: 'Drop in code or upload a file. Supports 10+ languages.', color: '#4fc3f7' },
            { step: '02', title: 'AI Analyzes', desc: 'AST parsing + Claude AI performs deep multi-layer analysis.', color: '#a855f7' },
            { step: '03', title: 'Get Insights', desc: 'Receive bugs, optimizations, complexity and clean code tips.', color: '#4ade80' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex-1 glass rounded-2xl p-8 relative"
            >
              <div className="text-6xl font-display font-black opacity-10 absolute top-4 right-6" style={{ color: item.color }}>
                {item.step}
              </div>
              <div className="text-4xl font-display font-black mb-3" style={{ color: item.color }}>{item.step}</div>
              <h3 className="font-display font-semibold text-xl text-text-primary mb-2">{item.title}</h3>
              <p className="text-text-secondary">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section id="languages" className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="text-sm font-mono text-neon-blue mb-3">// supported_languages</div>
          <h2 className="text-3xl font-display font-bold text-text-primary">Multi-Language Support</h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3"
        >
          {LANGUAGES.map((lang, i) => (
            <motion.span
              key={i}
              whileHover={{ scale: 1.08, borderColor: '#4fc3f780' }}
              className="px-4 py-2 rounded-lg text-sm font-mono text-text-secondary border border-white/10 glass cursor-default transition-all"
            >
              {lang}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(79,195,247,0.1), rgba(168,85,247,0.1))' }}
        >
          <div className="absolute inset-0 border border-white/10 rounded-3xl" />
          <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4">
            Ready to Write Better Code?
          </h2>
          <p className="text-text-secondary mb-8 max-w-lg mx-auto">
            Start your first code review now. No account needed. Just paste and analyze.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(79, 195, 247, 0.5)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/review')}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-semibold text-void text-lg"
            style={{ background: 'linear-gradient(135deg, #4fc3f7, #a855f7)' }}
          >
            Launch Code Reviewer
            <ChevronRight size={20} />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 md:px-12 py-8 text-center text-text-muted text-sm">
        <div className="flex items-center justify-center gap-2">
          <Code2 size={14} className="text-neon-blue" />
          <span>CodeReview.ai — Built with FastAPI + React + Claude AI</span>
        </div>
      </footer>
    </div>
  )
}
