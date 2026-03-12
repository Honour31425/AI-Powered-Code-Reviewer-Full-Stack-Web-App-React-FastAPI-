import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Zap, BookOpen, Target, ChevronRight, CheckCircle2, Info } from 'lucide-react'

const SEVERITY_CONFIG = {
  critical: { color: '#ef4444', bg: '#ef444415', border: '#ef444430', label: 'CRITICAL' },
  high: { color: '#f97316', bg: '#f9731615', border: '#f9731630', label: 'HIGH' },
  medium: { color: '#fbbf24', bg: '#fbbf2415', border: '#fbbf2430', label: 'MEDIUM' },
  low: { color: '#4ade80', bg: '#4ade8015', border: '#4ade8030', label: 'LOW' },
}

const TYPE_COLOR = {
  performance: '#4fc3f7',
  readability: '#a855f7',
  design: '#fb923c',
  security: '#ef4444',
  naming: '#4ade80',
  structure: '#4fc3f7',
  'error-handling': '#fbbf24',
  testing: '#a855f7',
  documentation: '#94a3b8',
}

function IssueCard({ item, index, type }) {
  const sev = SEVERITY_CONFIG[item.severity] || SEVERITY_CONFIG.low
  const typeColor = TYPE_COLOR[item.type || item.category] || '#94a3b8'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl p-4 border transition-all hover:border-opacity-60"
      style={{ background: sev.bg, borderColor: sev.border }}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <AlertTriangle size={14} style={{ color: sev.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded"
              style={{ background: `${sev.color}25`, color: sev.color }}>
              {sev.label}
            </span>
            {(item.type || item.category) && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{ background: `${typeColor}20`, color: typeColor }}>
                {item.type || item.category}
              </span>
            )}
            {item.line && (
              <span className="text-[10px] font-mono text-text-muted">line {item.line}</span>
            )}
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{item.message}</p>
          {item.fix && (
            <div className="mt-2 flex items-start gap-1.5 text-xs text-text-muted">
              <ChevronRight size={11} className="text-neon-green shrink-0 mt-0.5" />
              <span className="text-neon-green/80">{item.fix}</span>
            </div>
          )}
          {item.example && (
            <pre className="mt-2 text-xs font-mono bg-black/30 rounded-lg p-2 text-text-muted overflow-x-auto border border-white/5">
              {item.example}
            </pre>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function OptimizationCard({ item, index }) {
  const typeColor = TYPE_COLOR[item.type] || '#94a3b8'
  const sev = SEVERITY_CONFIG[item.severity] || SEVERITY_CONFIG.low

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl p-4 border border-white/10 glass hover:border-opacity-40 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5"
          style={{ background: `${typeColor}20` }}>
          <Zap size={13} style={{ color: typeColor }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{ background: `${typeColor}20`, color: typeColor }}>
              {item.type?.toUpperCase()}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{ background: `${sev.color}20`, color: sev.color }}>
              {sev.label}
            </span>
            {item.line && (
              <span className="text-[10px] font-mono text-text-muted">line {item.line}</span>
            )}
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{item.message}</p>
          {item.example && (
            <pre className="mt-2 text-xs font-mono bg-black/30 rounded-lg p-2 text-text-muted overflow-x-auto border border-white/5">
              {item.example}
            </pre>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function CleanCodeCard({ item, index }) {
  const colors = ['#4fc3f7', '#a855f7', '#4ade80', '#fbbf24', '#f87171']
  const color = colors[index % colors.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl p-4 border border-white/10 glass"
    >
      <div className="flex items-start gap-3">
        <BookOpen size={14} style={{ color }} className="shrink-0 mt-0.5" />
        <div className="flex-1">
          {item.principle && (
            <div className="text-[10px] font-mono font-semibold mb-1 px-1.5 py-0.5 rounded inline-block"
              style={{ background: `${color}20`, color }}>
              {item.principle}
            </div>
          )}
          <p className="text-sm text-text-secondary leading-relaxed">{item.message}</p>
          {item.example && (
            <pre className="mt-2 text-xs font-mono bg-black/30 rounded-lg p-2 text-text-muted overflow-x-auto border border-white/5">
              {item.example}
            </pre>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function BestPracticeCard({ item, index }) {
  const catColor = TYPE_COLOR[item.category] || '#94a3b8'
  const sev = SEVERITY_CONFIG[item.severity] || SEVERITY_CONFIG.low

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl p-4 border border-white/10 glass"
    >
      <div className="flex items-start gap-3">
        <Target size={14} style={{ color: catColor }} className="shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {item.category && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{ background: `${catColor}20`, color: catColor }}>
                {item.category}
              </span>
            )}
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{ background: `${sev.color}20`, color: sev.color }}>
              {sev.label}
            </span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{item.message}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function ResultsPanel({ results, activeTab }) {
  const renderEmpty = (label) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-10 h-10 rounded-xl glass flex items-center justify-center mb-3 border border-white/10">
        <CheckCircle2 size={18} className="text-neon-green" />
      </div>
      <p className="text-text-muted text-sm">No {label} found.</p>
      <p className="text-text-muted text-xs mt-1">Your code looks great here!</p>
    </div>
  )

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="space-y-3"
      >
        {activeTab === 'bugs' && (
          results.bugs?.length > 0
            ? results.bugs.map((bug, i) => <IssueCard key={i} item={bug} index={i} type="bug" />)
            : renderEmpty('bugs')
        )}
        {activeTab === 'optimizations' && (
          results.optimizations?.length > 0
            ? results.optimizations.map((opt, i) => <OptimizationCard key={i} item={opt} index={i} />)
            : renderEmpty('optimizations')
        )}
        {activeTab === 'clean_code' && (
          results.clean_code?.length > 0
            ? results.clean_code.map((cc, i) => <CleanCodeCard key={i} item={cc} index={i} />)
            : renderEmpty('clean code suggestions')
        )}
        {activeTab === 'best_practices' && (
          results.best_practices?.length > 0
            ? results.best_practices.map((bp, i) => <BestPracticeCard key={i} item={bp} index={i} />)
            : renderEmpty('best practice issues')
        )}
      </motion.div>
    </AnimatePresence>
  )
}
