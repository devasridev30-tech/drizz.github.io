import { useEffect, useState } from 'react'
import { DEFAULT_THEME, THEME_STORAGE_KEY } from './themes'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME
    } catch {
      return DEFAULT_THEME
    }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // ignore storage errors (private browsing, etc.)
    }
  }, [theme])

  return [theme, setTheme]
}
