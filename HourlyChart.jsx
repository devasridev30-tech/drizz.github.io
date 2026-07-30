import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HourlyChart({ hourly, currentIso }) {
  const [hoverIdx, setHoverIdx] = useState(null)
  const w = 720, h = 150, padL = 28, padR = 10, padT = 18, padB = 26
  const startIdx = hourly.time.findIndex((t) => t >= currentIso)
  const idx0 = startIdx >= 0 ? startIdx : 0
  const temps = hourly.temperature_2m.slice(idx0, idx0 + 24)
  const pops = hourly.precipitation_probability.slice(idx0, idx0 + 24)
  const times = hourly.time.slice(idx0, idx0 + 24)
  const min = Math.min(...temps), max = Math.max(...temps)
  const range = max - min || 1
  const stepX = (w - padL - padR) / (temps.length - 1)

  const pts = temps.map((t, i) => {
    const x = padL + i * stepX
    const y = padT + (1 - (t - min) / range) * (h - padT - padB - 30)
    return { x, y, t }
  })
  const linePath = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join(' ')
  const areaPath = linePath + ` L ${pts[pts.length - 1].x.toFixed(1)} ${h - padB} L ${pts[0].x.toFixed(1)} ${h - padB} Z`
  const pathLen = 900

  const bars = pops.map((p, i) => {
    const x = padL + i * stepX
    const bh = (p / 100) * 22
    const active = hoverIdx === i
    return (
      <motion.rect
        key={i}
        x={(x - 3).toFixed(1)}
        y={(h - padB + 2 - bh).toFixed(1)}
        width="6"
        height={bh.toFixed(1)}
        fill="var(--cyan)"
        rx="1"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 0.9 : 0.5, scaleY: active ? 1.08 : 1 }}
        transition={{ opacity: { duration: 0.4, delay: 0.6 + i * 0.015 }, scaleY: { duration: 0.15 } }}
        style={{ transformOrigin: `${x}px ${h - padB + 2}px` }}
      />
    )
  })

  const labels = pts.map((p, i) => {
    if (i % 4 !== 0) return null
    const hr = new Date(times[i]).getHours()
    return (
      <text key={i} x={p.x.toFixed(1)} y={h - 4} fontSize="9" fill="var(--ink-dim)" fontFamily="IBM Plex Mono" textAnchor="middle">
        {hr}:00
      </text>
    )
  })

  const dots = pts.map((p, i) => {
    const active = hoverIdx === i
    return (
      <motion.circle
        key={i}
        cx={p.x.toFixed(1)}
        cy={p.y.toFixed(1)}
        fill="var(--gold)"
        initial={{ r: 0 }}
        animate={{ r: active ? 4.5 : i % 2 === 0 ? 2.4 : 0 }}
        transition={i % 2 === 0 && !active ? { delay: 0.8 + i * 0.02, duration: 0.3 } : { duration: 0.15 }}
      />
    )
  })

  const handleMove = (e) => {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const scale = w / rect.width
    const x = (e.clientX - rect.left) * scale
    let idx = Math.round((x - padL) / stepX)
    idx = Math.max(0, Math.min(pts.length - 1, idx))
    setHoverIdx(idx)
  }

  const hoverPt = hoverIdx !== null ? pts[hoverIdx] : null

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="hourly-svg"
      onMouseMove={handleMove}
      onMouseLeave={() => setHoverIdx(null)}
      style={{ cursor: 'crosshair', overflow: 'visible' }}
    >
      <path d={areaPath} fill="var(--coral)" opacity="0.12" />
      <path d={linePath} stroke="var(--coral)" strokeWidth="2.5" fill="none" strokeDasharray={pathLen} strokeDashoffset={pathLen}>
        <animate attributeName="stroke-dashoffset" from={pathLen} to="0" dur="1.1s" fill="freeze" calcMode="spline" keySplines="0.22 1 0.36 1" />
      </path>
      {bars}
      {dots}
      {labels}

      <AnimatePresence>
        {hoverPt && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
            <line x1={hoverPt.x} y1={padT} x2={hoverPt.x} y2={h - padB} stroke="var(--coral)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            <rect
              x={Math.min(Math.max(hoverPt.x - 24, 0), w - 48)}
              y={Math.max(hoverPt.y - 30, padT - 6)}
              width="48"
              height="20"
              rx="5"
              fill="var(--panel, #1a1a1a)"
              stroke="var(--coral)"
              strokeWidth="1"
            />
            <text
              x={Math.min(Math.max(hoverPt.x, 24), w - 24)}
              y={Math.max(hoverPt.y - 16, padT + 8)}
              fontSize="10"
              fontFamily="IBM Plex Mono"
              textAnchor="middle"
              fill="var(--coral)"
              fontWeight="600"
            >
              {Math.round(hoverPt.t)}°
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}
