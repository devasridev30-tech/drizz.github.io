import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const base = import.meta.env.BASE_URL || '/'
const CLIPS = [
  { src: `${base}videos/rain-wood.mp4`, label: 'Rain on the deck' },
  { src: `${base}videos/blue-sky.mp4`, label: 'Clear sky, drifting clouds' },
  { src: `${base}videos/seashore.mp4`, label: 'Seashore, incoming tide' },
  { src: `${base}videos/rain-raindrops.mp4`, label: 'Rain, up close' },
]

export default function HeroBackground() {
  const [idx, setIdx] = useState(0)
  const videoRefs = useRef([])

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % CLIPS.length), 8000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const v = videoRefs.current[idx]
    if (v) {
      v.currentTime = 0
      v.play().catch(() => {})
    }
  }, [idx])

  return (
    <div className="hero-bg" aria-hidden="true">
      {CLIPS.map((c, i) => (
        <motion.video
          key={c.src}
          ref={(el) => (videoRefs.current[i] = el)}
          className="hero-bg-slide active"
          src={c.src}
          muted
          loop
          playsInline
          autoPlay={i === 0}
          preload="auto"
          initial={false}
          animate={{ opacity: i === idx ? 1 : 0, scale: i === idx ? 1 : 1.05 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ))}
      <div className="hero-bg-overlay" />
      <AnimatePresence mode="wait">
        <motion.div
          key={CLIPS[idx]?.label}
          className="hero-bg-caption"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5 }}
        >
          🎥 {CLIPS[idx]?.label}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
