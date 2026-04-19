import Nav from '../components/Nav.jsx'
import CoordBar from '../components/CoordBar.jsx'
import Footer from '../components/Footer.jsx'
import { OI_DATA } from '../data/oi.js'
import { useTweaks } from '../context/TweaksContext.jsx'

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
  const { t, i18n } = useTweaks()

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
              <em dangerouslySetInnerHTML={{ __html: t.events_h1 }} />
            </h1>
          </div>
          <div className="mono small dim" style={{ lineHeight: 1.7, borderLeft: '1px solid var(--rule)', paddingLeft: 16 }}>
            {t.events_lede}
          </div>
        </section>

        <div className="section-head">
          <div>
            <div className="idx">{t.events_map_idx}</div>
            <h2>{t.events_map_h}</h2>
          </div>
          <div className="meta">{t.events_map_meta}</div>
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
            MTL · QC · TOR · OTT · SHE · NYC · approx. {t.events_map_caption_suffix}
          </div>
        </div>

        <div className="section-head">
          <div>
            <div className="idx">{t.events_cal_idx}</div>
            <h2>{t.events_cal_h}</h2>
          </div>
          <div className="meta">{OI_DATA.events.length} {t.events_dates}</div>
        </div>

        <div>
          {OI_DATA.events.map((e, i) => {
            const d = new Date(e.date + 'T00:00:00Z')
            const day = String(d.getUTCDate()).padStart(2, '0')
            const mo = t.events_months[d.getUTCMonth()]
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
                    {t.events_status[e.status] || e.status}
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
