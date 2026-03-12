import { motion } from 'framer-motion'

const LEVEL_CONFIG = {
  'Low': { color: '#4ade80', width: '25%' },
  'Medium': { color: '#fbbf24', width: '50%' },
  'High': { color: '#f97316', width: '75%' },
  'Very High': { color: '#ef4444', width: '100%' },
  'Unknown': { color: '#94a3b8', width: '0%' },
}

export default function ComplexityMeter({ complexity }) {
  const level = complexity?.level || 'Unknown'
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG.Unknown
  const notation = complexity?.notation || 'N/A'

  return (
    <div className="glass rounded-xl p-3 flex flex-col justify-center border border-white/10">
      <div className="text-[10px] text-text-muted mb-1.5">Complexity</div>
      <div className="font-display font-bold text-sm mb-1" style={{ color: config.color }}>{level}</div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: config.color }}
          initial={{ width: '0%' }}
          animate={{ width: config.width }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
        />
      </div>
      <div className="text-[10px] font-mono text-text-muted mt-1">{notation}</div>
    </div>
  )
}
