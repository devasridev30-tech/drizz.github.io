import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { THEMES } from '../lib/themes'

export default function ThemeSwitcher({ theme, onChange }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="theme-switcher">
      <motion.button
        className="theme-switcher-btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        whileHover={{ scale: 1.04, y: -1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      >
        <motion.span
          className="theme-switcher-swatch"
          style={{
            background: `linear-gradient(135deg, ${THEMES.find(t => t.id === theme)?.swatch[0]}, ${THEMES.find(t => t.id === theme)?.swatch[1]})`,
          }}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        />
        Select theme
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="theme-switcher-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="theme-switcher-menu"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              {THEMES.map((t, i) => (
                <motion.button
                  key={t.id}
                  className={`theme-option ${theme === t.id ? 'active' : ''}`}
                  onClick={() => { onChange(t.id); setOpen(false) }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i, duration: 0.2 }}
                  whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.06)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.span
                    className="theme-option-swatch"
                    style={{ background: `linear-gradient(135deg, ${t.swatch[0]}, ${t.swatch[1]})` }}
                    whileHover={{ scale: 1.2, rotate: 15 }}
                  />
                  <span className="theme-option-name">{t.name}</span>
                  {theme === t.id && (
                    <motion.span
                      className="theme-option-check"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
