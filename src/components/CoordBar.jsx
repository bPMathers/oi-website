import { useEffect, useState } from 'react'
import { useTweaks } from '../context/TweaksContext.jsx'

export default function CoordBar({ section, catalog }) {
  const { t } = useTweaks()
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const ts = now.toISOString().replace('T', ' ').split('.')[0] + 'Z'
  return (
    <div className="coord-bar">
      <span>{t.coord_prefix}</span>
      <span>{section || ''}</span>
      <span>{catalog || ''}</span>
      <span className="cursor">{ts}</span>
    </div>
  )
}
