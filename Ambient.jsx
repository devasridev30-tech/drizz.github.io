import { useMemo } from 'react'

export default function Ambient({ group = 'clear', isDay = true }) {
  const stars = useMemo(() => {
    if (isDay) return []
    return Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 60,
      size: Math.random() * 1.6 + 1,
      delay: Math.random() * 3,
    }))
  }, [isDay])

  const clouds = useMemo(() => {
    const cloudy = ['cloudy', 'fog', 'rain', 'drizzle', 'storm', 'sunshower'].includes(group)
    if (!cloudy) return []
    const n = group === 'fog' ? 5 : group === 'sunshower' ? 4 : 3
    return Array.from({ length: n }, () => ({
      top: 6 + Math.random() * 26,
      dur: 40 + Math.random() * 40,
      delay: -Math.random() * 80,
      scale: 0.7 + Math.random() * 0.8,
    }))
  }, [group])

  const rainDrops = useMemo(() => {
    const rainy = ['rain', 'drizzle', 'storm', 'sunshower'].includes(group)
    if (!rainy) return []
    const n = group === 'storm' ? 80 : group === 'sunshower' ? 55 : 65
    return Array.from({ length: n }, () => ({
      x: Math.random() * 100,
      len: 14 + Math.random() * 18,
      dur: 0.55 + Math.random() * 0.5,
      delay: Math.random() * 2.5,
      drift: Math.random() * 10 - 5,
    }))
  }, [group])

  return (
    <div className="ambient" aria-hidden="true">
      {isDay && (group === 'clear' || group === 'sunshower') && (
        <>
          <div className="ray" style={{ right: '26%', animationDelay: '0s' }} />
          <div className="ray" style={{ right: '18%', animationDelay: '1.2s' }} />
          {group === 'sunshower' && <div className="ray" style={{ right: '34%', animationDelay: '0.6s' }} />}
        </>
      )}

      {group === 'sunshower' && (
        <svg className="rainbow" viewBox="0 0 400 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="rbow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="20%" stopColor="#FFC93C" />
              <stop offset="40%" stopColor="#06D6A0" />
              <stop offset="60%" stopColor="#4FC3F7" />
              <stop offset="80%" stopColor="#9B5DE5" />
              <stop offset="100%" stopColor="#FF8FAB" />
            </linearGradient>
          </defs>
          <path d="M10 195 A190 190 0 0 1 390 195" fill="none" stroke="url(#rbow)" strokeWidth="12" strokeLinecap="round" />
        </svg>
      )}

      {stars.map((s, i) => (
        <div
          key={i}
          className="star"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
        />
      ))}

      {clouds.map((c, i) => (
        <svg
          key={i}
          className="cloud"
          style={{ top: `${c.top}%`, width: 120 * c.scale, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}
          viewBox="0 0 48 48"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.6"
          opacity="0.55"
        >
          <path d="M14 32a8 8 0 1 1 1.6-15.8A10 10 0 0 1 34 20a6.5 6.5 0 0 1-1 12H14z" />
        </svg>
      ))}

      {rainDrops.map((d, i) => (
        <div
          key={`rain-${i}`}
          className="raindrop"
          style={{
            left: `${d.x}%`,
            height: d.len,
            animationDuration: `${d.dur}s`,
            animationDelay: `${d.delay}s`,
            '--drift': `${d.drift}px`,
          }}
        />
      ))}
    </div>
  )
}
