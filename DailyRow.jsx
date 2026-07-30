import { motion } from 'framer-motion'
import { wmo, iconSvg } from '../lib/wmo'

export default function DailyRow({ daily }) {
  return (
    <div className="daily-row">
      {daily.time.map((t, i) => {
        const di = wmo(daily.weather_code[i], true)
        const dname = i === 0 ? 'Today' : new Date(t).toLocaleDateString([], { weekday: 'short' })
        return (
          <motion.div
            key={t}
            className="day-card"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.4, ease: 'easeOut' }}
            whileHover={{ y: -8, borderColor: 'var(--gold)', scale: 1.04, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
          >
            <div className="dname">{dname}</div>
            <motion.div
              className="day-icon"
              whileHover={{ scale: 1.14, rotate: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 12 }}
              dangerouslySetInnerHTML={{ __html: iconSvg(di.group, true, 34) }}
            />
            <div className="hi">{Math.round(daily.temperature_2m_max[i])}°</div>
            <div className="lo">{Math.round(daily.temperature_2m_min[i])}°</div>
            <div className="pop">{daily.precipitation_probability_max[i]}% rain</div>
          </motion.div>
        )
      })}
    </div>
  )
}
