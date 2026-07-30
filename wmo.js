const CODES = {
  0: ['clear', 'Clear sky'], 1: ['clear', 'Mainly clear'], 2: ['cloudy', 'Partly cloudy'], 3: ['cloudy', 'Overcast'],
  45: ['fog', 'Fog'], 48: ['fog', 'Rime fog'],
  51: ['drizzle', 'Light drizzle'], 53: ['drizzle', 'Drizzle'], 55: ['drizzle', 'Dense drizzle'],
  56: ['drizzle', 'Freezing drizzle'], 57: ['drizzle', 'Freezing drizzle'],
  61: ['rain', 'Slight rain'], 63: ['rain', 'Rain'], 65: ['rain', 'Heavy rain'],
  66: ['rain', 'Freezing rain'], 67: ['rain', 'Freezing rain'],
  71: ['snow', 'Slight snow'], 73: ['snow', 'Snow'], 75: ['snow', 'Heavy snow'], 77: ['snow', 'Snow grains'],
  80: ['rain', 'Rain showers'], 81: ['rain', 'Rain showers'], 82: ['rain', 'Violent showers'],
  85: ['snow', 'Snow showers'], 86: ['snow', 'Snow showers'],
  95: ['storm', 'Thunderstorm'], 96: ['storm', 'Thunderstorm, hail'], 99: ['storm', 'Thunderstorm, hail'],
}

export function wmo(code, isDay) {
  const [group, label] = CODES[code] || ['cloudy', 'Unknown']
  return { group, label, isDay }
}

export function iconSvg(group, isDay, size = 36) {
  const wrap = (inner) =>
    `<svg viewBox="0 0 48 48" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`

  if (group === 'clear') {
    return isDay
      ? wrap(`<circle cx="24" cy="24" r="9"/>${[0, 45, 90, 135, 180, 225, 270, 315]
          .map((a) => {
            const r1 = 17, r2 = 22, rad = (a * Math.PI) / 180
            return `<line x1="${24 + r1 * Math.cos(rad)}" y1="${24 + r1 * Math.sin(rad)}" x2="${24 + r2 * Math.cos(rad)}" y2="${24 + r2 * Math.sin(rad)}"/>`
          })
          .join('')}`)
      : wrap(`<path d="M31 8a15 15 0 1 0 9 27 12 12 0 0 1-9-27z"/>`)
  }
  if (group === 'cloudy') {
    return wrap(`${isDay ? '<circle cx="16" cy="16" r="6" opacity="0.6"/>' : ''}<path d="M14 32a8 8 0 1 1 1.6-15.8A10 10 0 0 1 34 20a6.5 6.5 0 0 1-1 12H14z"/>`)
  }
  if (group === 'fog') {
    return wrap(`<path d="M10 18a8 8 0 0 1 15-4 6 6 0 0 1 7 5.8"/><line x1="8" y1="26" x2="40" y2="26"/><line x1="12" y1="32" x2="36" y2="32"/><line x1="8" y1="38" x2="40" y2="38"/>`)
  }
  if (group === 'drizzle' || group === 'rain') {
    return wrap(`<path d="M14 26a8 8 0 1 1 1.6-15.8A10 10 0 0 1 34 14a6.5 6.5 0 0 1-1 12H14z"/><line x1="16" y1="34" x2="14" y2="40"/><line x1="24" y1="34" x2="22" y2="40"/><line x1="32" y1="34" x2="30" y2="40"/>`)
  }
  if (group === 'snow') {
    return wrap(`<path d="M14 24a8 8 0 1 1 1.6-15.8A10 10 0 0 1 34 12a6.5 6.5 0 0 1-1 12H14z"/><g stroke-width="1.6"><line x1="17" y1="34" x2="17" y2="42"/><line x1="13.5" y1="38" x2="20.5" y2="38"/><line x1="24" y1="34" x2="24" y2="42"/><line x1="20.5" y1="38" x2="27.5" y2="38"/><line x1="31" y1="34" x2="31" y2="42"/><line x1="27.5" y1="38" x2="34.5" y2="38"/></g>`)
  }
  if (group === 'storm') {
    return wrap(`<path d="M14 22a8 8 0 1 1 1.6-15.8A10 10 0 0 1 34 10a6.5 6.5 0 0 1-1 12H14z"/><path d="M23 30l-5 9h6l-4 8" stroke-width="2.2"/>`)
  }
  return wrap(`<circle cx="24" cy="24" r="10"/>`)
}

export const SKY_THEMES = {
  clear: { day: ['#6ec6ff', '#a685e2', '#ffd59e'], night: ['#2b1055', '#7597de', '#ff9ecf'] },
  cloudy: { day: ['#a0c4ff', '#bdb2ff', '#ffc6ff'], night: ['#2c2a5e', '#5c4d8c', '#a685c2'] },
  fog: { day: ['#cfe8f3', '#e8f1f2', '#fff6e5'], night: ['#4b5563', '#6b7280', '#9ca3af'] },
  drizzle: { day: ['#8ecae6', '#219ebc', '#a2d2ff'], night: ['#1c3d5a', '#2f6690', '#5f9ea0'] },
  rain: { day: ['#457b9d', '#3a86ff', '#8ecae6'], night: ['#132743', '#1d3557', '#3a6ea5'] },
  snow: { day: ['#e0f7fa', '#b2ebf2', '#fff9fb'], night: ['#5c6b86', '#829199', '#c9d6df'] },
  storm: { day: ['#6a2c70', '#b83b5e', '#f08a5d'], night: ['#240046', '#5a189a', '#9d4edd'] },
}
