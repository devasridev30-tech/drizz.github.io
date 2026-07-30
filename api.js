export async function searchPlaces(name, count = 6) {
  const q = (name || '').trim()
  if (q.length < 2) return []
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=${count}&language=en&format=json`
  const res = await fetch(url)
  if (!res.ok) return []
  const json = await res.json()
  if (!json.results) return []
  return json.results.map((r) => ({
    name: r.name,
    admin: r.admin1,
    country: r.country,
    countryCode: r.country_code,
    lat: r.latitude,
    lon: r.longitude,
    tz: r.timezone,
  }))
}

export function flagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌍'
  const codePoints = [...countryCode.toUpperCase()].map((c) => 127397 + c.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

export async function geocode(name) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`
  const res = await fetch(url)
  const json = await res.json()
  if (!json.results || !json.results.length) throw new Error('No matching place found')
  const r = json.results[0]
  return { name: r.name, admin: r.admin1, country: r.country, lat: r.latitude, lon: r.longitude, tz: r.timezone }
}

export async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
    const j = await res.json()
    return { name: j.city || j.locality || 'Your location', admin: j.principalSubdivision || '', country: j.countryName || '' }
  } catch {
    return { name: 'Your location', admin: '', country: '' }
  }
}

export async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,pressure_msl,cloud_cover,is_day',
    hourly: 'temperature_2m,precipitation_probability,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max',
    timezone: 'auto',
    forecast_days: 7,
  })
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`)
  if (!res.ok) throw new Error('Forecast service unavailable')
  return res.json()
}
