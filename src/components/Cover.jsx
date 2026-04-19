/*
 * SVG-based generative album cover.
 * Renders a consistent template with release metadata
 * and a hash-driven decorative motif.
 */

function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

/* Decorative motif generators — each returns SVG elements */
function motifStripes(h) {
  const angle = 30 + (h % 30)
  const gap = 6 + (h % 5)
  const lines = []
  for (let i = -300; i < 600; i += gap) {
    lines.push(
      <line key={i} x1={i} y1={0} x2={i + 200} y2={400}
        stroke="var(--cover-fg)" strokeWidth="0.5" opacity="0.18"
        transform={`rotate(${angle} 200 200)`} />
    )
  }
  return <g>{lines}</g>
}

function motifRings(h) {
  const cx = 80 + (h % 240)
  const cy = 80 + ((h >> 4) % 240)
  const rings = []
  for (let r = 20; r < 200; r += 14 + (h % 8)) {
    rings.push(
      <circle key={r} cx={cx} cy={cy} r={r}
        fill="none" stroke="var(--cover-fg)" strokeWidth="0.5" opacity="0.15" />
    )
  }
  return <g>{rings}</g>
}

function motifGrid(h) {
  const size = 10 + (h % 10)
  const lines = []
  for (let x = 0; x <= 400; x += size) {
    lines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={400}
      stroke="var(--cover-fg)" strokeWidth="0.3" opacity="0.12" />)
  }
  for (let y = 0; y <= 400; y += size) {
    lines.push(<line key={`h${y}`} x1={0} y1={y} x2={400} y2={y}
      stroke="var(--cover-fg)" strokeWidth="0.3" opacity="0.12" />)
  }
  return <g>{lines}</g>
}

function motifDots(h) {
  const dots = []
  const seed = h
  for (let i = 0; i < 60; i++) {
    const x = ((seed * (i + 1) * 7) % 380) + 10
    const y = ((seed * (i + 1) * 13) % 380) + 10
    const r = 0.5 + ((seed * (i + 1)) % 3)
    dots.push(
      <circle key={i} cx={x} cy={y} r={r}
        fill="var(--cover-fg)" opacity={0.1 + (i % 4) * 0.04} />
    )
  }
  return <g>{dots}</g>
}

function motifWave(h) {
  const paths = []
  for (let i = 0; i < 8; i++) {
    const yOff = 60 + i * 38
    const amp = 8 + (h % 12) + i * 2
    const freq = 0.01 + ((h >> 2) % 5) * 0.003
    let d = `M0 ${yOff}`
    for (let x = 0; x <= 400; x += 4) {
      d += ` L${x} ${yOff + Math.sin(x * freq + i) * amp}`
    }
    paths.push(
      <path key={i} d={d} fill="none"
        stroke="var(--cover-fg)" strokeWidth="0.5" opacity="0.14" />
    )
  }
  return <g>{paths}</g>
}

const MOTIFS = [motifStripes, motifRings, motifGrid, motifDots, motifWave]

export default function Cover({ id, label, title, artist, format, year, duration }) {
  const h = hash(id || 'cover')
  const motif = MOTIFS[h % MOTIFS.length]
  const cat = label || id

  return (
    <div className="cover">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"
        className="cover-svg" aria-label={title ? `${cat} — ${title}` : cat}>
        {/* background */}
        <rect width="400" height="400" fill="var(--cover-bg)" />

        {/* decorative motif */}
        {motif(h)}

        {/* border frame */}
        <rect x="12" y="12" width="376" height="376"
          fill="none" stroke="var(--cover-fg)" strokeWidth="0.5" opacity="0.25" />

        {/* catalog number — top left */}
        <text x="24" y="38"
          fontFamily="var(--f-mono)" fontSize="13" letterSpacing="0.1em"
          fill="var(--cover-fg)" opacity="0.6">
          {cat}
        </text>

        {/* label name — top right */}
        <text x="376" y="38" textAnchor="end"
          fontFamily="var(--f-mono)" fontSize="8" letterSpacing="0.15em"
          fill="var(--cover-fg)" opacity="0.35"
          style={{ textTransform: 'uppercase' }}>
          OBSERVATOIRE IDÉAL
        </text>

        {/* horizontal rule under header */}
        <line x1="24" y1="50" x2="376" y2="50"
          stroke="var(--cover-fg)" strokeWidth="0.5" opacity="0.2" />

        {/* title block — centered */}
        {title && (
          <text x="200" y="195" textAnchor="middle"
            fontFamily="var(--f-display)" fontSize="26" fontStyle="italic"
            fill="var(--cover-fg)">
            {title.length > 28
              ? <>
                  <tspan x="200" dy="0">{title.slice(0, title.lastIndexOf(' ', 28) || 28)}</tspan>
                  <tspan x="200" dy="30">{title.slice((title.lastIndexOf(' ', 28) || 28) + 1)}</tspan>
                </>
              : title}
          </text>
        )}

        {/* artist name */}
        {artist && (
          <text x="200" y={title && title.length > 28 ? 248 : 228} textAnchor="middle"
            fontFamily="var(--f-mono)" fontSize="10" letterSpacing="0.08em"
            fill="var(--cover-fg)" opacity="0.55">
            {artist}
          </text>
        )}

        {/* horizontal rule above footer */}
        <line x1="24" y1="350" x2="376" y2="350"
          stroke="var(--cover-fg)" strokeWidth="0.5" opacity="0.2" />

        {/* footer: format · year · duration */}
        <text x="24" y="374"
          fontFamily="var(--f-mono)" fontSize="9" letterSpacing="0.08em"
          fill="var(--cover-fg)" opacity="0.5">
          {[format, year, duration].filter(Boolean).join(' · ')}
        </text>

        {/* small OBS mark bottom-right */}
        <text x="376" y="374" textAnchor="end"
          fontFamily="var(--f-mono)" fontSize="9" letterSpacing="0.1em"
          fill="var(--cover-fg)" opacity="0.3">
          OBS
        </text>
      </svg>
    </div>
  )
}
