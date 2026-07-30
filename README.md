# Drizz — live weather forecasting

A React + Vite weather app with an animated logo-reveal landing page (Framer
Motion) and a live weather dashboard powered by the free Open-Meteo API (no
API key needed). Installable as a PWA on mobile home screens.

## About this app

**Drizz** is a personal weather instrument for anywhere on earth — live
temperature, hourly outlooks, and a 7-day forecast, read like a barometer.

**Owner:** [Karthikeyan Prakash (RoronoaKarthi)](https://github.com/RoronoaKarthi)

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## What's inside

- `src/components/Landing.jsx` — animated logo-reveal hero (flicker-in), fade-ins, bouncing scroll cue
- `src/components/Dashboard.jsx` — search, geolocation, live current conditions
- `src/components/Dial.jsx` — animated SVG gauge (arc draws in, needle sweeps to the temperature)
- `src/components/HourlyChart.jsx` — animated 24-hour temperature line + precipitation bars
- `src/components/DailyRow.jsx` — staggered 7-day forecast cards (Framer Motion)
- `src/components/Ambient.jsx` — twinkling stars / sun rays / drifting clouds background
- `src/lib/api.js` — Open-Meteo geocoding + forecast fetch helpers
- `src/lib/wmo.js` — WMO weather-code → icon/label/sky-theme mapping
- `public/manifest.webmanifest`, `public/sw.js`, `public/icons/` — PWA install support

## Data source

Weather and geocoding: [Open-Meteo](https://open-meteo.com/) (free, no key).
Reverse geocoding for "Use my location": [BigDataCloud](https://www.bigdatacloud.com/) client API (free, no key).

## License

MIT © 2026 [Karthikeyan Prakash (RoronoaKarthi)](https://github.com/RoronoaKarthi) — see [LICENSE](./LICENSE).
