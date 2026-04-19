import { useEffect } from 'react'
import { useTweaks } from '../context/TweaksContext.jsx'

const CHARS = '█▒▓░/\\|#*+=→←↑↓'

export default function GlitchTick() {
  const { tweaks } = useTweaks()
  const g = tweaks.glitch

  useEffect(() => {
    if (g < 0.6) return undefined
    const outer = setInterval(() => {
      const heads = document.querySelectorAll('h1, h2, .brand, .quote')
      if (!heads.length) return
      const el = heads[Math.floor(Math.random() * heads.length)]
      if (el.__oiLocked) return
      const orig = el.textContent
      if (!orig || orig.length < 4) return
      el.__oiLocked = true
      let step = 0
      const total = 4
      const iv = setInterval(() => {
        step++
        let out = ''
        for (let i = 0; i < orig.length; i++) {
          if (orig[i] === ' ' || Math.random() > 0.15 * g) out += orig[i]
          else out += CHARS[Math.floor(Math.random() * CHARS.length)]
        }
        el.textContent = out
        if (step >= total) {
          clearInterval(iv)
          el.textContent = orig
          el.__oiLocked = false
        }
      }, 70)
    }, 1400)
    return () => clearInterval(outer)
  }, [g])

  return null
}
