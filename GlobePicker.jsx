import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Globe from 'react-globe.gl'
import { reverseGeocode } from '../lib/api'

const EARTH_TEXTURE = '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
const BG_TEXTURE = '//unpkg.com/three-globe/example/img/night-sky.png'

export default function GlobePicker({ onPick, place }) {
  const globeRef = useRef(null)
  const wrapRef = useRef(null)
  const [size, setSize] = useState({ w: 600, h: 380 })
  const [marker, setMarker] = useState(null) // { lat, lng }
  const [locating, setLocating] = useState(false)

  // Keep the globe canvas sized to its responsive container
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width
      setSize({ w: Math.round(width), h: Math.round(width * 0.6) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Gentle auto-spin until the person interacts, framed roughly over the Indian Ocean
  useEffect(() => {
    const g = globeRef.current
    if (!g) return
    g.pointOfView({ lat: 10, lng: 70, altitude: 2.3 }, 0)
    const controls = g.controls()
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.55
    controls.enableZoom = true
  }, [])

  const handleClick = useCallback(async ({ lat, lng }) => {
    setMarker({ lat, lng })
    const controls = globeRef.current?.controls()
    if (controls) controls.autoRotate = false
    setLocating(true)
    try {
      const rg = await reverseGeocode(lat, lng)
      onPick({ name: rg.name, admin: rg.admin, country: rg.country, lat, lon: lng })
    } finally {
      setLocating(false)
    }
  }, [onPick])

  return (
    <div className="map-picker">
      <motion.div
        className="map-picker-label"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        Or spin the globe and click anywhere
      </motion.div>

      <motion.div
        className="globe-frame"
        ref={wrapRef}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Globe
          ref={globeRef}
          width={size.w}
          height={size.h}
          globeImageUrl={EARTH_TEXTURE}
          backgroundImageUrl={BG_TEXTURE}
          backgroundColor="rgba(0,0,0,0)"
          onGlobeClick={handleClick}
          pointsData={marker ? [marker] : []}
          pointLat="lat"
          pointLng="lng"
          pointColor={() => '#FF6B6B'}
          pointAltitude={0.012}
          pointRadius={0.55}
          ringsData={marker ? [marker] : []}
          ringLat="lat"
          ringLng="lng"
          ringColor={() => (t) => `rgba(255,107,107,${1 - t})`}
          ringMaxRadius={4}
          ringPropagationSpeed={2.2}
          ringRepeatPeriod={900}
          atmosphereColor="#7ec8f2"
          atmosphereAltitude={0.18}
        />

        <AnimatePresence>
          {locating && (
            <motion.div
              className="map-picker-loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              Locating…
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence mode="wait">
        {place && (
          <motion.div
            key={`${place.name}-${place.admin}`}
            className="map-picker-current"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          >
            📍 {[place.name, place.admin].filter(Boolean).join(', ')}
            {place.country ? ` · ${place.country}` : ''}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
