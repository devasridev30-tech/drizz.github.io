import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchPlaceMedia } from '../lib/wiki'

export default function PlaceMedia({ place }) {
  const [state, setState] = useState({ status: 'idle' })

  useEffect(() => {
    if (!place?.name) return
    let cancelled = false
    setState({ status: 'loading' })
    fetchPlaceMedia(place.name)
      .then((data) => { if (!cancelled) setState({ status: 'ready', data }) })
      .catch(() => { if (!cancelled) setState({ status: 'empty' }) })
    return () => { cancelled = true }
  }, [place?.name])

  return (
    <AnimatePresence mode="wait">
      {state.status === 'loading' && (
        <motion.div key="loading" className="media-card media-loading" exit={{ opacity: 0 }}>
          <div className="shimmer" />
          <span>Fetching a photo of {place.name}…</span>
        </motion.div>
      )}
      {state.status === 'ready' && (
        <motion.div
          key="ready"
          className="media-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {(state.data.thumbnail?.source || state.data.originalimage?.source) && (
            <motion.img
              src={state.data.thumbnail?.source || state.data.originalimage?.source}
              alt={state.data.title}
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          )}
          <div className="media-body">
            <h3>{state.data.title}</h3>
            <p>{state.data.extract}</p>
            {state.data.content_urls?.desktop?.page && (
              <a href={state.data.content_urls.desktop.page} target="_blank" rel="noreferrer">
                Read more on Wikipedia →
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
