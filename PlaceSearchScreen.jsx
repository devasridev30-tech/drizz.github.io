import { motion, AnimatePresence } from 'framer-motion'
import SearchSuggest from './SearchSuggest'
import CountryPicker from './CountryPicker'
import GlobePicker from './GlobePicker'

export default function PlaceSearchScreen({
  query, onChange, onPick, onSubmit, onUseLocation, onQuickPick,
  status, error, place,
}) {
  return (
    <motion.div
      className="search-screen"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="search-screen-title"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        Where do you want to check the sky?
      </motion.div>
      <motion.div
        className="search-screen-sub"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12 }}
      >
        Search a city with the assistant, or spin the globe below to drop a pin.
      </motion.div>

      <motion.div className="search-row" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18 }}>
        <SearchSuggest value={query} onChange={onChange} onPick={onPick} onSubmit={onSubmit} />
        <motion.button whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }} onClick={onSubmit}>Search</motion.button>
        <motion.button whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }} onClick={onUseLocation}>◎ Use my location</motion.button>
      </motion.div>

      <AnimatePresence mode="wait">
        {status && (
          <motion.div
            key={status}
            className={`status ${error ? 'err' : ''}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0, x: error ? [0, -6, 6, -4, 4, 0] : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: error ? 0.4 : 0.3 }}
          >
            {status}
          </motion.div>
        )}
      </AnimatePresence>

      <CountryPicker onSelect={onQuickPick} active={query} />

      <GlobePicker onPick={onPick} place={place} />
    </motion.div>
  )
}
