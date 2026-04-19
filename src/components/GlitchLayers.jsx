import { useMemo } from 'react'
import { useTweaks } from '../context/TweaksContext.jsx'

export default function GlitchLayers() {
  const { tweaks } = useTweaks()
  const g = tweaks.glitch

  const extras = useMemo(() => {
    if (g < 0.55) return { bands: [], pixels: [], shimmer: false, hSweep: false }
    const bandCount = Math.floor(4 * g)
    const pixelCount = Math.floor(6 * g)
    const bands = Array.from({ length: bandCount }, () => ({
      top: Math.random() * 100 + '%',
      delay: Math.random() * 6 + 's',
    }))
    const pixels = Array.from({ length: pixelCount }, () => ({
      top: Math.random() * 100 + 'vh',
      left: Math.random() * 100 + 'vw',
      delay: Math.random() * 10 + 's',
      duration: 6 + Math.random() * 10 + 's',
    }))
    return { bands, pixels, shimmer: g >= 0.9, hSweep: true }
  }, [g])

  return (
    <>
      <div className="sweep-layer" />
      <div className="artifact" />
      {extras.hSweep && <div className="glitch-extra h-sweep" />}
      {extras.bands.map((b, i) => (
        <div
          key={`band-${i}`}
          className="glitch-extra band"
          style={{ top: b.top, animationDelay: b.delay }}
        />
      ))}
      {extras.pixels.map((p, i) => (
        <div
          key={`pixel-${i}`}
          className="glitch-extra pixel"
          style={{
            top: p.top,
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
      {extras.shimmer && <div className="glitch-extra shimmer" />}
    </>
  )
}
