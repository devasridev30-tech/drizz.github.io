import { motion } from 'framer-motion'

export const COUNTRIES = [
  { name: 'India', flag: '🇮🇳', query: 'Delhi' },
  { name: 'Japan', flag: '🇯🇵', query: 'Tokyo' },
  { name: 'France', flag: '🇫🇷', query: 'Paris' },
  { name: 'Italy', flag: '🇮🇹', query: 'Rome' },
  { name: 'USA', flag: '🇺🇸', query: 'New York' },
  { name: 'UK', flag: '🇬🇧', query: 'London' },
  { name: 'UAE', flag: '🇦🇪', query: 'Dubai' },
  { name: 'Thailand', flag: '🇹🇭', query: 'Bangkok' },
  { name: 'Australia', flag: '🇦🇺', query: 'Sydney' },
  { name: 'Brazil', flag: '🇧🇷', query: 'Rio de Janeiro' },
  { name: 'Spain', flag: '🇪🇸', query: 'Madrid' },
  { name: 'Egypt', flag: '🇪🇬', query: 'Cairo' },
]

export default function CountryPicker({ onSelect, active }) {
  return (
    <div className="country-row">
      {COUNTRIES.map((c, i) => (
        <motion.button
          key={c.name}
          type="button"
          className={`country-chip ${active === c.query ? 'active' : ''}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.02 * i, duration: 0.35 }}
          whileHover={{ y: -3, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(c.query)}
        >
          <span className="flag">{c.flag}</span> {c.name}
        </motion.button>
      ))}
    </div>
  )
}
