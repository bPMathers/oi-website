import { useMemo, useCallback } from 'react'
import { useAudioPlayer } from '../context/AudioPlayerContext.jsx'

export default function Waveform({ instanceId, seed = 1, bars = 80 }) {
  const { currentTime, duration, peaks, seek, playing } = useAudioPlayer(instanceId)
  const progress = duration > 0 ? currentTime / duration : 0

  // Build bar heights: use real decoded peaks when available, else procedural fallback
  const items = useMemo(() => {
    if (peaks) {
      const out = []
      for (let i = 0; i < bars; i++) {
        const idx = Math.floor((i / bars) * peaks.length)
        const h = 15 + Math.floor(peaks[idx] * 85)
        out.push(h)
      }
      return out
    }
    // Procedural fallback
    let s = seed
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
    const out = []
    for (let i = 0; i < bars; i++) {
      const h = 20 + Math.floor(Math.abs(Math.sin(i * 0.3 + s) + rand() * 0.6) * 70)
      out.push(h)
    }
    return out
  }, [seed, bars, peaks])

  const handleClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    seek(fraction)
  }, [seek])

  return (
    <div className="wave" onClick={handleClick} style={{ cursor: 'pointer' }}>
      {items.map((h, i) => {
        const past = playing && i / bars < progress
        return (
          <span key={i} className={`bar${past ? ' past' : ''}`} style={{ height: `${h}%` }} />
        )
      })}
      {playing && <span className="cursor" style={{ left: `${progress * 100}%` }} />}
    </div>
  )
}
