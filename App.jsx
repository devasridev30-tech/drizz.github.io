import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Landing from './components/Landing'
import Dashboard from './components/Dashboard'
import ThemeSwitcher from './components/ThemeSwitcher'
import { useTheme } from './lib/useTheme'
import './App.css'

export default function App() {
  const [view, setView] = useState('landing')
  const [theme, setTheme] = useTheme()

  return (
    <>
      <ThemeSwitcher theme={theme} onChange={setTheme} />
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.5, ease: 'easeInOut' } }}
          >
            <Landing onEnter={() => setView('dashboard')} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          >
            <Dashboard onBack={() => setView('landing')} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
