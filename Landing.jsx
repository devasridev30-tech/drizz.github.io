import { motion } from 'framer-motion'
import HeroBackground from './HeroBackground'
import LiveClock from './LiveClock'
import logoFull from '../assets/logo-full.png'

export default function Landing({ onEnter }) {
  return (
    <div className="landing">
      <HeroBackground />

      <motion.div
        className="landing-inner"
        initial="hidden"
        animate="show"
      >
        <motion.img
          src={logoFull}
          alt="Drizz — live weather forecasting"
          className="landing-logo"
          initial={{ opacity: 0, filter: 'blur(6px)' }}
          animate={{
            opacity: [0, 0.15, 0.05, 0.5, 0.15, 0.75, 0.3, 1],
            filter: ['blur(6px)', 'blur(5px)', 'blur(5px)', 'blur(2px)', 'blur(2px)', 'blur(0.5px)', 'blur(0.5px)', 'blur(0px)'],
          }}
          transition={{ duration: 1.6, delay: 0.15, times: [0, 0.12, 0.24, 0.4, 0.52, 0.68, 0.8, 1], ease: 'linear' }}
          whileHover={{ scale: 1.025, filter: "drop-shadow(0px 8px 24px rgba(255,201,60,0.15))" }}
        />

        <motion.p
          className="landing-sub"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.6, ease: 'easeOut' }}
          whileHover={{ scale: 1.01 }}
        >
          Drizz is a weather instrument for anywhere on earth — live temperature,
          hourly outlooks, and a 7-day forecast, read like a barometer.
        </motion.p>

        <LiveClock />

        <motion.button
          className="landing-cta"
          initial={{ opacity: 0, y: 12 }}
          animate={{
            opacity: 1,
            y: 0,
            boxShadow: [
              "0 0 0 0px rgba(232,169,76,0)",
              "0 0 0 8px rgba(232,169,76,0.15)",
              "0 0 0 0px rgba(232,169,76,0)"
            ]
          }}
          transition={{
            opacity: { delay: 2.1, duration: 0.5 },
            y: { delay: 2.1, duration: 0.5 },
            boxShadow: {
              delay: 2.6,
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          whileHover={{ scale: 1.04, boxShadow: '0 0 0 4px rgba(232,169,76,0.35)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onEnter}
        >
          Check the sky →
        </motion.button>

        <motion.div
          className="landing-scroll-cue"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ opacity: { delay: 2.4, duration: 0.6 }, y: { delay: 2.6, duration: 1.8, repeat: Infinity, ease: 'easeInOut' } }}
        >
          ⌄
        </motion.div>
      </motion.div>
    </div>
  )
}
