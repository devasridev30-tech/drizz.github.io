import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Ambient from './Ambient'
import WeatherVideoBg from './WeatherVideoBg'
import ExploreBanner from './ExploreBanner'
import Dial from './Dial'
import HourlyChart from './HourlyChart'
import DailyRow from './DailyRow'
import SearchSuggest from './SearchSuggest'
import PlaceSearchScreen from './PlaceSearchScreen'
import LiveClock from './LiveClock'
import PlaceMedia from './PlaceMedia'
import NearbySpots from './NearbySpots'
import VisitAdvisor from './VisitAdvisor'
import { geocode, reverseGeocode, fetchWeather } from '../lib/api'
import { wmo, SKY_THEMES } from '../lib/wmo'
import logoMark from '../assets/logo-mark.png'

export default function Dashboard({ onBack }) {
  const [mode, setMode] = useState('search') // 'search' | 'results'
  const [query, setQuery] = useState('')
  const [unit, setUnit] = useState('C')
  const [place, setPlace] = useState(null)
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('Search a place, or drop a pin on the map to begin')
  const [error, setError] = useState(false)
  const bodyRef = useRef(document.body)

  const load = async (placeInfo) => {
    setStatus(`Fetching conditions for ${placeInfo.name}…`)
    setError(false)
    try {
      const d = await fetchWeather(placeInfo.lat, placeInfo.lon)
      setData(d)
      setPlace(placeInfo)
      setStatus('')
      setMode('results')
    } catch (e) {
      setError(true)
      setStatus(e.message || 'Could not load weather data')
    }
  }

  const searchFor = async (name) => {
    setQuery(name)
    setStatus(`Locating ${name}…`)
    setError(false)
    try {
      const g = await geocode(name)
      await load(g)
    } catch (e) {
      setError(true)
      setStatus(e.message)
    }
  }

  const pickSuggestion = (item) => {
    setQuery(item.name)
    load(item)
  }

  const searchCity = () => {
    const name = query.trim()
    if (!name) { setError(true); setStatus('Type a place name first'); return }
    searchFor(name)
  }

  const useMyLocation = () => {
    if (!navigator.geolocation) { setError(true); setStatus('Geolocation not supported by this browser'); return }
    setStatus('Requesting your location…')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        const rg = await reverseGeocode(latitude, longitude)
        await load({ name: rg.name, admin: rg.admin, country: rg.country, lat: latitude, lon: longitude })
      },
      () => { setError(true); setStatus('Location permission denied') },
      { timeout: 10000 }
    )
  }

  const info = data ? wmo(data.current.weather_code, data.current.is_day === 1) : null

  useEffect(() => {
    if (!info) return
    const t = SKY_THEMES[info.group] || SKY_THEMES.cloudy
    const colors = info.isDay ? t.day : t.night
    bodyRef.current.style.background =
      `radial-gradient(ellipse 900px 500px at 80% -10%, rgba(232,169,76,0.10), transparent 60%), linear-gradient(180deg, ${colors[0]}, ${colors[1]} 55%, ${colors[2]})`
  }, [info?.group, info?.isDay])

  const fmt = (c) => {
    if (c === null || c === undefined) return '—'
    const v = unit === 'C' ? c : (c * 9) / 5 + 32
    return Math.round(v)
  }
  const unitSuffix = unit === 'C' ? '°C' : '°F'

  const daily = data?.daily
  let gaugeMin = 0, gaugeMax = 40
  if (data) {
    const dayMin = Math.min(...daily.temperature_2m_min.slice(0, 7))
    const dayMax = Math.max(...daily.temperature_2m_max.slice(0, 7))
    gaugeMin = Math.min(dayMin, data.current.temperature_2m) - 3
    gaugeMax = Math.max(dayMax, data.current.temperature_2m) + 3
  }

  return (
    <div className="dashboard">
      {info && <WeatherVideoBg group={info.group} isDay={info.isDay} />}
      {info && <Ambient group={info.group} isDay={info.isDay} />}

      <div className="wrap">
        <motion.div className="masthead" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <motion.button
            className="back-link"
            onClick={onBack}
            whileHover={{ x: -4, color: 'var(--coral)' }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            ← Home
          </motion.button>
          <motion.div className="brand-block" whileHover="hover" initial="idle">
            <motion.img
              src={logoMark}
              alt=""
              className="brand-mark"
              variants={{ idle: { rotate: 0, scale: 1 }, hover: { rotate: -8, scale: 1.08 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 10 }}
            />
            <div>
              <div className="brand">Drizz</div>
              <div className="sub">live atmospheric readings</div>
            </div>
          </motion.div>
          <div className="masthead-right">
            <LiveClock compact />
            <motion.button
              className="unit-toggle"
              onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
              whileHover={{ scale: 1.06, borderColor: 'var(--gold)' }}
              whileTap={{ scale: 0.92, rotate: [0, -4, 4, 0] }}
              transition={{ type: 'spring', stiffness: 350, damping: 16 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={unit}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'inline-flex', gap: 4 }}
                >
                  <span className={unit === 'C' ? 'on' : ''}>°C</span> / <span className={unit === 'F' ? 'on' : ''}>°F</span>
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>

        {mode === 'search' && (
          <PlaceSearchScreen
            query={query}
            onChange={setQuery}
            onPick={pickSuggestion}
            onSubmit={searchCity}
            onUseLocation={useMyLocation}
            onQuickPick={searchFor}
            status={status}
            error={error}
            place={place}
          />
        )}

        {mode === 'results' && (
          <motion.div className="search-row" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}>
            <SearchSuggest value={query} onChange={setQuery} onPick={pickSuggestion} onSubmit={searchCity} />
            <motion.button whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }} onClick={searchCity}>Search</motion.button>
            <motion.button whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }} onClick={useMyLocation}>◎ Use my location</motion.button>
            <motion.button whileHover={{ y: -2, scale: 1.03, rotate: -3 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }} onClick={() => setMode('search')}>🌐 Globe</motion.button>
          </motion.div>
        )}

        {mode === 'results' && (
          <AnimatePresence mode="wait">
            {status && (
              <motion.div
                key={status}
                className={`status ${error ? 'err' : ''}`}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0, x: error ? [0, -6, 6, -4, 4, 0] : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: error ? 0.4 : 0.3 }}
              >
                {status}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {mode === 'results' && data && place && info && (
          <motion.div className="panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <motion.div className="place-row" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
              <div>
                <motion.div className="place-name" key={place.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  {[place.name, place.admin].filter(Boolean).join(', ')}
                </motion.div>
                <div className="place-meta">{[place.country, data.timezone].filter(Boolean).join(' · ')}</div>
              </div>
              <motion.div
                className="place-meta"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                as of {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </motion.div>
            </motion.div>

            <PlaceMedia place={place} />
            <VisitAdvisor daily={daily} />

            <div className="dial-grid">
              <motion.div
                className="dial-wrap"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.035 }}
              >
                <Dial tempC={data.current.temperature_2m} min={gaugeMin} max={gaugeMax} group={info.group} />
                <motion.div className="dial-center" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}>
                  <motion.div key={`${unit}-${data.current.temperature_2m}`} className="dial-temp" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
                    {fmt(data.current.temperature_2m)}<sup>{unitSuffix}</sup>
                  </motion.div>
                  <div className="dial-cond">{info.label}</div>
                </motion.div>
              </motion.div>

              <div className="stat-grid">
                {[
                  ['Feels like', `${fmt(data.current.apparent_temperature)}${unitSuffix}`, '🌡️', { y: [0, -3, 0] }],
                  ['Humidity', `${data.current.relative_humidity_2m}%`, '💧', { scale: [1, 1.2, 1] }],
                  ['Wind', `${Math.round(data.current.wind_speed_10m)} km/h`, '💨', { x: [0, 4, 0] }],
                  ['Pressure', `${Math.round(data.current.pressure_msl)} hPa`, '🧭', { rotate: [0, 15, -15, 0] }],
                  ['Precipitation', `${data.current.precipitation} mm`, '🌧️', { y: [0, 2, 0] }],
                  ['UV / Cloud', `${Math.round(daily.uv_index_max[0])} idx · ${data.current.cloud_cover}% cloud`, '☀️', { rotate: 360 }],
                ].map(([k, v, emoji, hoverAnim], i) => (
                  <motion.div
                    className="stat"
                    key={k}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 * i }}
                    whileHover="hover"
                    style={{ borderRadius: 6, cursor: 'default', padding: '2px 4px 2px 0' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <motion.span
                        variants={{ hover: hoverAnim }}
                        transition={{ repeat: Infinity, duration: hoverAnim.rotate && !Array.isArray(hoverAnim.rotate) ? 4 : 1.5, ease: 'linear' }}
                        style={{ display: 'inline-block' }}
                      >
                        {emoji}
                      </motion.span>
                      <span className="k">{k}</span>
                    </div>
                    <motion.div
                      className="v"
                      key={v}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      variants={{ hover: { scale: 1.02, x: 4, color: 'var(--coral)' } }}
                    >
                      {v}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div className="section-title" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4 }}>Next 24 hours</motion.div>
            <div className="hourly-scroll">
              <HourlyChart hourly={data.hourly} currentIso={data.current.time} />
            </div>

            <motion.div className="section-title" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4 }}>7-day outlook</motion.div>
            <DailyRow daily={daily} />

            <motion.div className="section-title" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4 }}>Explore the area</motion.div>
            <ExploreBanner />
            <NearbySpots place={place} />
          </motion.div>
        )}

        <motion.div
          className="footer-note"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Data via Open-Meteo · updates on search or location change
          <br />
          Drizz by{' '}
          <motion.a
            href="https://github.com/RoronoaKarthi"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ color: 'var(--coral)', letterSpacing: '1px' }}
          >
            Karthikeyan Prakash
          </motion.a>
        </motion.div>
      </div>
    </div>
  )
}
