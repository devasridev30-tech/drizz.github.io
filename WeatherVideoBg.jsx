import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Maps a live weather group (+ day/night) to one of the uploaded stock clips.
// Conditions with no strong visual match (cloudy, fog, snow, clear night) fall
// back to the existing gradient + Ambient effects instead of forcing a clip.
function clipFor(group, isDay) {
  const base = import.meta.env.BASE_URL || '/'
  if (group === 'storm') return { src: `${base}videos/storm-beach.mp4`, label: 'Storm conditions' }
  if (group === 'rain') return { src: `${base}videos/rain-raindrops.mp4`, label: 'Rainfall' }
  if (group === 'drizzle') return { src: `${base}videos/rain-wood.mp4`, label: 'Light drizzle' }
  if (group === 'clear' && isDay) return { src: `${base}videos/blue-sky.mp4`, label: 'Clear skies' }
  return null
}

export default function WeatherVideoBg({ group, isDay }) {
  const clip = clipFor(group, isDay)
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) videoRef.current.play().catch(() => {})
  }, [clip?.src])

  return (
    <div className="weather-video-bg" aria-hidden="true">
      <AnimatePresence mode="wait">
        {clip && (
          <motion.video
            key={clip.src}
            ref={videoRef}
            src={clip.src}
            className="weather-video-el"
            muted
            loop
            playsInline
            autoPlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>
      {clip && <div className="weather-video-overlay" />}
    </div>
  )
}
