import { motion } from 'framer-motion'

export default function QualityScore({ score }) {
  const color = score >= 80 ? '#4ade80' : score >= 60 ? '#fbbf24' : score >= 40 ? '#f97316' : '#ef4444'
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor'

  const circumference = 2 * Math.PI * 26
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="glass rounded-xl p-3 flex flex-col items-center justify-center border border-white/10">
      <div className="relative w-14 h-14">
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          <motion.circle
            cx="30" cy="30" r="26"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-display font-bold" style={{ color }}>{score}</span>
        </div>
      </div>
      <div className="text-[10px] font-mono mt-1" style={{ color }}>{label}</div>
      <div className="text-[10px] text-text-muted">Quality</div>
    </div>
  )
}
