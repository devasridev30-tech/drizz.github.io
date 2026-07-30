function scoreDay(tmax, tmin, pop) {
  const mid = (tmax + tmin) / 2
  const tempScore = Math.max(0, 100 - Math.abs(mid - 22) * 4)
  const popScore = 100 - pop
  return tempScore * 0.55 + popScore * 0.45
}

export function computeVisitAdvice(daily) {
  const scores = daily.time.map((t, i) => ({
    i,
    date: t,
    tmax: daily.temperature_2m_max[i],
    tmin: daily.temperature_2m_min[i],
    pop: daily.precipitation_probability_max[i],
    score: scoreDay(daily.temperature_2m_max[i], daily.temperature_2m_min[i], daily.precipitation_probability_max[i]),
  }))

  const today = scores[0]
  const best = scores.reduce((a, b) => (b.score > a.score ? b : a))

  let verdict
  if (today.score >= 72) verdict = { label: 'Great time to visit right now', tone: 'good' }
  else if (today.score >= 50) verdict = { label: 'A decent time to visit', tone: 'ok' }
  else verdict = { label: 'Conditions are rough today', tone: 'poor' }

  const bestDayName = best.i === 0 ? 'today' : new Date(best.date).toLocaleDateString([], { weekday: 'long' })

  return { verdict, today, best, bestDayName }
}
