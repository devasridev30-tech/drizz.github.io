import { motion } from 'framer-motion'
import { computeVisitAdvice } from '../lib/advisor'

export default function VisitAdvisor({ daily }) {
  const { verdict, best, bestDayName } = computeVisitAdvice(daily)

  return (
    <motion.div
      className={`advisor advisor-${verdict.tone}`}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }}
    >
      <motion.div
        className="advisor-icon"
        animate={{ y: [0, -6, 0], rotate: [0, -4, 4, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.25, rotate: 0 }}
      >
        {verdict.tone === 'good' ? '☀️' : verdict.tone === 'ok' ? '⛅' : '🌧️'}
      </motion.div>
      <div>
        <motion.div className="advisor-verdict" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.4 }}>
          {verdict.label}
        </motion.div>
        <motion.div className="advisor-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.4 }}>
          Best day this week to visit: <strong>{bestDayName}</strong> — around {Math.round(best.tmax)}°/{Math.round(best.tmin)}°, {Math.round(best.pop)}% chance of rain.
        </motion.div>
      </div>
    </motion.div>
  )
}
