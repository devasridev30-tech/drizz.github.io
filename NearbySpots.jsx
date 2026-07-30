import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchNearby, prettyTag, mapLink } from '../lib/overpass'

export default function NearbySpots({ place }) {
  const [state, setState] = useState({ status: 'idle' })

  useEffect(() => {
    if (!place?.lat) return
    let cancelled = false
    setState({ status: 'loading' })
    fetchNearby(place.lat, place.lon)
      .then((data) => { if (!cancelled) setState({ status: 'ready', data }) })
      .catch(() => { if (!cancelled) setState({ status: 'empty' }) })
    return () => { cancelled = true }
  }, [place?.lat, place?.lon])

  if (state.status === 'idle') return null

  return (
    <div className="nearby-grid">
      <div className="nearby-col">
        <div className="section-title">🏛️ Tourist spots nearby</div>
        {state.status === 'loading' && <div className="nearby-loading">Scouting the area…</div>}
        {state.status === 'ready' && state.data.attractions.length === 0 && (
          <div className="nearby-loading">No landmarks found nearby</div>
        )}
        {state.status === 'ready' &&
          state.data.attractions.map((a, i) => (
            <motion.a
              key={a.id}
              className="nearby-item"
              href={mapLink(a.lat, a.lon, a.tags.name)}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.4 }}
              whileHover={{ x: 4 }}
            >
              <span className="nearby-name">{a.tags.name}</span>
              <span className="nearby-tag tag-spot">{prettyTag(a.tags.tourism)}</span>
            </motion.a>
          ))}
      </div>

      <div className="nearby-col">
        <div className="section-title">🛍️ Famous shops nearby</div>
        {state.status === 'loading' && <div className="nearby-loading">Scouting the area…</div>}
        {state.status === 'ready' && state.data.shops.length === 0 && (
          <div className="nearby-loading">No notable shops found nearby</div>
        )}
        {state.status === 'ready' &&
          state.data.shops.map((s, i) => (
            <motion.a
              key={s.id}
              className="nearby-item"
              href={mapLink(s.lat, s.lon, s.tags.name)}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.4 }}
              whileHover={{ x: -4 }}
            >
              <span className="nearby-name">{s.tags.name}</span>
              <span className="nearby-tag tag-shop">{prettyTag(s.tags.shop)}</span>
            </motion.a>
          ))}
      </div>
    </div>
  )
}
