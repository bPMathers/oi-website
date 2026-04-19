import Nav from '../components/Nav.jsx'
import CoordBar from '../components/CoordBar.jsx'
import Footer from '../components/Footer.jsx'
import { OI_DATA } from '../data/oi.js'
import { useTweaks } from '../context/TweaksContext.jsx'

const MONTHS_FR = ['JAN','FÉV','MAR','AVR','MAI','JUIN','JUIL','AOÛT','SEPT','OCT','NOV','DÉC']
const MONTHS_EN = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

const COORDS = {
  'Montréal':    [55, 55],
  'Montreal':    [55, 55],
  'Québec':      [70, 40],
  'Québec City': [70, 40],
  'Toronto':     [30, 65],
  'Ottawa':      [42, 52],
  'Sherbrooke':  [60, 62],
  'New York':    [38, 82],
}

export default function Events() {
  const { tweaks, t, i18n } = useTweaks()
  const FR = tweaks.lang === 'fr'
  const MONTHS = FR ? MONTHS_FR : MONTHS_EN
  const STATUS_MAP = FR
    ? { tickets: 'billets', announce: 'annoncé', hold: 'en réserve' }
    : { tickets: 'tickets', announce: 'announced', hold: 'on hold' }

  const seen = new Set()
  const pins = []
  OI_DATA.events.forEach(e => {
    const c = i18n(e.city)
    if (seen.has(c)) return
    seen.add(c)
    pins.push({ city: c, coord: COORDS[c] || [50, 50] })
  })

  return (
    <div className="scanlines" data-screen-label="Events">
      <div className="frame">
        <Nav active="events" />
        <CoordBar section={`/ ${t.nav.events.toLowerCase()}`} catalog="2026" />

        <section className="e-head">
          <div>
            <div className="mono small upper dim" style={{ marginBottom: 12 }}>
              {t.events_kicker}
            </div>
            <h1>
              <em dangerouslySetInnerHTML={{ __html: FR ? 'Dates, surtout<br>au Québec.' : 'Dates, mostly<br>in Québec.' }} />
            </h1>
          </div>
          <div className="mono small dim" style={{ lineHeight: 1.7, borderLeft: '1px solid var(--rule)', paddingLeft: 16 }}>
            {FR
              ? "Concerts peu fréquents. Petites salles, bonnes sonos, publics patients. Billets à la porte sauf mention d'une prévente."
              : 'Performances are infrequent. Small rooms with good PAs and patient audiences. Tickets on the door unless a presale is linked.'}
          </div>
        </section>

        <div className="section-head">
          <div>
            <div className="idx">{FR ? '§ carte · approximative' : '§ map · approximate'}</div>
            <h2>{FR ? 'Où nous serons' : 'Where we will be'}</h2>
          </div>
          <div className="meta">{FR ? '± erreur de projection' : '± projection error'}</div>
        </div>

        <div className="map-stage">
          {pins.map(p => (
            <span
              key={p.city}
              className="pin"
              data-label={p.city}
              style={{ left: `${p.coord[0]}%`, top: `${p.coord[1]}%` }}
            />
          ))}
          <div className="map-caption">
            MTL · QC · TOR · OTT · SHE · NYC · approx. {FR ? "non à l'échelle" : 'not to scale'}
          </div>
        </div>

        <div className="section-head">
          <div>
            <div className="idx">{FR ? '§ 2026 · confirmés & en réserve' : '§ 2026 · confirmed & on hold'}</div>
            <h2>{FR ? 'Calendrier' : 'Calendar'}</h2>
          </div>
          <div className="meta">{OI_DATA.events.length} {FR ? 'dates' : 'dates'}</div>
        </div>

        <div>
          {OI_DATA.events.map((e, i) => {
            const d = new Date(e.date + 'T00:00:00Z')
            const day = String(d.getUTCDate()).padStart(2, '0')
            const mo = MONTHS[d.getUTCMonth()]
            const yr = d.getUTCFullYear()
            const names = e.bill.map(id => OI_DATA.projectById[id]?.name || id)
            return (
              <div key={i} className="ev-card">
                <div className="date-block">
                  <div className="day">{day}</div>
                  <div className="ym">{mo} · {yr}</div>
                </div>
                <div className="bill">
                  <div className="names">{names.join(' / ')}</div>
                  <div>
                    {names.map((_, j) => (
                      <span key={j} className="tag">{OI_DATA.projectById[e.bill[j]].cat}</span>
                    ))}
                  </div>
                </div>
                <div className="venue">
                  <div className="v">{e.venue}</div>
                  <div className="c">{i18n(e.city)}</div>
                </div>
                <div>
                  <span className={`status-tag status-${e.status}`}>
                    {STATUS_MAP[e.status] || e.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <Footer />
      </div>
    </div>
  )
}
