import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const base = import.meta.env.BASE_URL || '/'
const CLIPS = [
  { src: `${base}videos/seashore.mp4`, label: 'Seashore' },
  { src: `${base}videos/windmill.mp4`, label: 'Out in the wind' },
  { src: `${base}videos/beach-walk.mp4`, label: 'A walk outside' },
  { src: `${base}videos/ocean-uhd.mp4`, label: 'Open water' },
]

export default function ExploreBanner() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * CLIPS.length))
  const [paused, setPaused] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setIdx((i) => (i + 1) % CLIPS.length), 9000)
    return () => clearInterval(id)
  }, [paused])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }, [idx])

  const clip = CLIPS[idx]

  return (
    <motion.div
      className="explore-banner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.4 }}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <AnimatePresence mode="sync">
        <motion.video
          key={clip.src}
          ref={videoRef}
          src={clip.src}
          muted
          loop
          playsInline
          autoPlay
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AnimatePresence>
      <div className="explore-banner-overlay">
        <AnimatePresence mode="wait">
          <motion.span
            key={clip.label}
            className="explore-banner-label"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            🎥 {clip.label}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* progress dots — click to jump, active dot pulses */}
      <div style={{ position: 'absolute', bottom: 10, right: 12, display: 'flex', gap: 6, zIndex: 2 }}>
        {CLIPS.map((c, i) => (
          <motion.button
            key={c.src}
            onClick={() => setIdx(i)}
            aria-label={`Show ${c.label}`}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              scale: i === idx ? 1.15 : 1,
              opacity: i === idx ? 1 : 0.5,
            }}
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#fff',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
