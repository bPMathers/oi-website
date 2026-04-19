import { useEffect, useState } from 'react'

export default function CoordBar({ section, catalog }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const ts = now.toISOString().replace('T', ' ').split('.')[0] + 'Z'
  return (
    <div className="coord-bar">
      <span>OBS · 45°30′N 73°34′O · Montréal</span>
      <span>{section || ''}</span>
      <span>{catalog || ''}</span>
      <span className="cursor">{ts}</span>
    </div>
  )
}
