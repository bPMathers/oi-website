const STYLES = [
  'cover--stripes',
  'cover--rings',
  'cover--grid',
  'cover--noise',
  'cover--bar',
  'cover--placeholder',
]

export default function Cover({ id, label }) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  const pick = STYLES[Math.abs(h) % STYLES.length]
  const isPlaceholder = pick === 'cover--placeholder'
  return (
    <div
      className={`cover ${pick}`}
      {...(isPlaceholder ? { 'data-label': label || 'cover art' } : {})}
    >
      <span className="cat">{label || id}</span>
    </div>
  )
}
