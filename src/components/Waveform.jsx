import { useMemo } from 'react'

export default function Waveform({ seed = 1, bars = 80 }) {
  const items = useMemo(() => {
    let s = seed
    const rand = () => {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    }
    const out = []
    for (let i = 0; i < bars; i++) {
      const h = 20 + Math.floor(Math.abs(Math.sin(i * 0.3 + s) + rand() * 0.6) * 70)
      out.push(h)
    }
    return out
  }, [seed, bars])

  return (
    <div className="wave">
      {items.map((h, i) => (
        <span key={i} className="bar" style={{ height: `${h}%` }} />
      ))}
      <span className="cursor" style={{ left: '12%' }} />
    </div>
  )
}
