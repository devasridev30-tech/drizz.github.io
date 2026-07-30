import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { searchPlaces, flagEmoji } from '../lib/api'

export default function SearchSuggest({ value, onChange, onPick, onSubmit, placeholder }) {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [hi, setHi] = useState(-1)
  const [loading, setLoading] = useState(false)
  const boxRef = useRef(null)
  const debounceRef = useRef(null)
  const reqId = useRef(0)

  useEffect(() => {
    clearTimeout(debounceRef.current)
    const q = (value || '').trim()
    if (q.length < 2) {
      setItems([])
      setOpen(false)
      setLoading(false)
      return
    }
    setLoading(true)
    const myId = ++reqId.current
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchPlaces(q, 6)
        if (myId !== reqId.current) return
        setItems(results)
        setOpen(results.length > 0)
        setHi(-1)
      } finally {
        if (myId === reqId.current) setLoading(false)
      }
    }, 280)
    return () => clearTimeout(debounceRef.current)
  }, [value])

  useEffect(() => {
    const onDocClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const pick = (item) => {
    setOpen(false)
    setItems([])
    onPick(item)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (items.length) { setOpen(true); setHi((h) => Math.min(h + 1, items.length - 1)) }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHi((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      if (open && hi >= 0 && items[hi]) {
        pick(items[hi])
      } else {
        setOpen(false)
        onSubmit()
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="search-suggest" ref={boxRef}>
      <input
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true) }}
        onKeyDown={onKeyDown}
        onFocus={() => items.length > 0 && setOpen(true)}
        placeholder={placeholder || 'Search a place… (e.g. Madurai, Lisbon, Tokyo)'}
        autoComplete="off"
        spellCheck="false"
      />
      {loading && <span className="suggest-spin" aria-hidden="true" />}
      <AnimatePresence>
        {open && items.length > 0 && (
          <motion.ul
            className="suggest-list"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {items.map((it, i) => (
              <li
                key={`${it.name}-${it.lat}-${it.lon}`}
                className={i === hi ? 'hi' : ''}
                onMouseDown={(e) => { e.preventDefault(); pick(it) }}
                onMouseEnter={() => setHi(i)}
              >
                <span className="suggest-flag">{flagEmoji(it.countryCode)}</span>
                <span className="suggest-name">{it.name}</span>
                <span className="suggest-meta">{[it.admin, it.country].filter(Boolean).join(', ')}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
