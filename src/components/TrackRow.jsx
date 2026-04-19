import Waveform from './Waveform.jsx'
import { useAudioPlayer } from '../context/AudioPlayerContext.jsx'

function mmss(n) {
  const m = Math.floor(n / 60), s = Math.floor(n % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function TrackRow({ instanceId, index, title, seed, durationSec }) {
  const { playing, toggle, currentTime, duration } = useAudioPlayer(instanceId)

  return (
    <div className="wave-row">
      <button className="play" onClick={toggle}>{playing ? '\u275A\u275A' : '\u25B6\uFE0E'}</button>
      <div>
        <div className="mono small dim">A{index + 1}</div>
        <div className="serif italic" style={{ fontSize: 'var(--step-1)' }}>{title}</div>
      </div>
      <Waveform instanceId={instanceId} seed={seed} bars={60} />
      <span className="t">
        <span className="np-time">{playing ? `${mmss(currentTime)} / ` : ''}{mmss(duration > 0 ? duration : durationSec)}</span>
      </span>
    </div>
  )
}
