import { useEffect, useRef, useState } from 'react'

// A trimmed-down version of the "Flicker Text" effect: letters flare in and
// out a few times before settling into their final, fully-lit state. Used to
// animate the brand title on the loading/landing screen.
export default function FlickerText({
  text,
  duration = 1.6,
  flickerCount = 9,
  onDone,
  style,
}) {
  const [settled, setSettled] = useState(false)
  const [lit, setLit] = useState(() => new Set())
  const timersRef = useRef([])

  useEffect(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setSettled(false)

    const chars = text.split('')
    const nonSpace = chars.reduce((acc, c, i) => {
      if (c.trim() !== '') acc.push(i)
      return acc
    }, [])

    const totalMs = duration * 1000
    const step = totalMs / flickerCount

    for (let i = 0; i < flickerCount; i++) {
      const t = i * step
      // each flare lights a growing share of letters, so it reads as
      // "coming together" rather than pure random noise
      const progress = i / flickerCount
      timersRef.current.push(
        setTimeout(() => {
          const minShare = 0.15 + progress * 0.6
          const count = Math.max(
            1,
            Math.round(nonSpace.length * (minShare + Math.random() * 0.25))
          )
          const shuffled = [...nonSpace].sort(() => Math.random() - 0.5)
          setLit(new Set(shuffled.slice(0, count)))
        }, t)
      )
    }

    timersRef.current.push(
      setTimeout(() => {
        setSettled(true)
        setLit(new Set(nonSpace))
        onDone && onDone()
      }, totalMs)
    )

    return () => timersRef.current.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, duration, flickerCount])

  return (
    <span style={style}>
      {text.split('').map((ch, i) => {
        const isLit = settled || lit.has(i)
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: ch.trim() === '' ? 1 : isLit ? 1 : 0.1,
              filter: isLit ? 'none' : 'blur(0.5px)',
              transition: 'opacity 0.09s linear, filter 0.09s linear',
            }}
          >
            {ch}
          </span>
        )
      })}
    </span>
  )
}
