import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { STR } from '../i18n/strings.js'

const TWEAK_DEFAULTS = {
  theme: 'light',
  accent: 'red',
  customAccent: null,
  accentGlow: 1.5,
  fontpair: 'serif-mono',
  glitch: 0.5,
  graphLayout: 'radial',
  lang: 'fr',
}

const TweaksContext = createContext(null)

function readInitial() {
  try {
    const saved = JSON.parse(localStorage.getItem('oi_tweaks') || 'null')
    const merged = { ...TWEAK_DEFAULTS, ...(saved || {}) }
    const langPref = localStorage.getItem('oi_lang')
    if (langPref) merged.lang = langPref
    return merged
  } catch {
    return { ...TWEAK_DEFAULTS }
  }
}

export function TweaksProvider({ children }) {
  const [tweaks, setTweaks] = useState(readInitial)

  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('data-theme', tweaks.theme)
    html.setAttribute('data-accent', tweaks.accent)
    html.setAttribute('data-fontpair', tweaks.fontpair)
    html.setAttribute('data-graph-layout', tweaks.graphLayout)
    html.setAttribute('lang', tweaks.lang)
    html.style.setProperty('--glitch', String(tweaks.glitch))
    html.style.setProperty('--accent-glow', String(tweaks.accentGlow))
    html.setAttribute('data-glitch-max', tweaks.glitch >= 0.9 ? '1' : '0')
    if (tweaks.accent === 'custom' && tweaks.customAccent) {
      html.style.setProperty('--accent', tweaks.customAccent)
    } else {
      html.style.removeProperty('--accent')
    }
    try { localStorage.setItem('oi_tweaks', JSON.stringify(tweaks)) } catch {}
    try { localStorage.setItem('oi_lang', tweaks.lang) } catch {}
  }, [tweaks])

  const setTweak = useCallback((key, value) => {
    setTweaks(prev => ({ ...prev, [key]: value }))
  }, [])

  const t = STR[tweaks.lang] || STR.fr
  const i18n = useCallback((obj) => {
    if (obj == null) return ''
    if (typeof obj === 'string') return obj
    return obj[tweaks.lang] || obj.fr || obj.en || ''
  }, [tweaks.lang])

  return (
    <TweaksContext.Provider value={{ tweaks, setTweak, t, i18n }}>
      {children}
    </TweaksContext.Provider>
  )
}

export function useTweaks() {
  const ctx = useContext(TweaksContext)
  if (!ctx) throw new Error('useTweaks must be used within TweaksProvider')
  return ctx
}
