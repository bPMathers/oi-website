import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import CoordBar from '../components/CoordBar.jsx'
import Footer from '../components/Footer.jsx'
import HeroTitle from '../components/HeroTitle.jsx'
import Cover from '../components/Cover.jsx'
import Waveform from '../components/Waveform.jsx'
import { OI_DATA } from '../data/oi.js'
import { useTweaks } from '../context/TweaksContext.jsx'

export default function Home() {
  const { tweaks, t, i18n } = useTweaks()

  const stripItems = OI_DATA.projects.map(p => (
    <span key={p.id}>
      <span className="dot" />
      {p.name} <span className="dim">· {p.cat}</span>
    </span>
  ))

  const latest = [...OI_DATA.releases]
    .sort((a, b) => b.cat.localeCompare(a.cat))
    .slice(0, 4)
  const upcoming = OI_DATA.events.slice(0, 4)
  const feat = latest[0]
  const featProj = feat?.project ? OI_DATA.projectById[feat.project] : null

  return (
    <div className="scanlines" data-screen-label="Home">
      <div className="frame">
        <Nav active="home" />
        <CoordBar
          section={`/ ${t.nav.home.toLowerCase()}`}
          catalog="OBS · 30"
        />

        <section className="hero">
          <span className="cross" style={{ top: 20, left: -4 }} />
          <span className="cross" style={{ bottom: 20, right: -4 }} />
          <div>
            <div className="hero-tag">{t.home_kicker}</div>
            <h1>
              <HeroTitle />
            </h1>
            <p
              className="dim mono small"
              style={{ maxWidth: '34ch', marginTop: 20, lineHeight: 1.7 }}
            >
              {t.home_lede}
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
              <Link to="/roster" className="btn accent">
                {t.home_cta_graph}
              </Link>
              <Link to="/releases" className="btn">
                {t.home_cta_catalog}
              </Link>
            </div>
          </div>
          <div className="hero-meta">
            <div className="row">
              <span>{t.kpi.catalog}</span>
              <span>OBS-001 → OBS-030</span>
            </div>
            <div className="row">
              <span>{t.kpi.operators}</span>
              <span>14</span>
            </div>
            <div className="row">
              <span>{t.kpi.projects}</span>
              <span>12</span>
            </div>
            <div className="row">
              <span>{t.kpi.pressings}</span>
              <span>{t.kpi.ltd}</span>
            </div>
            <div className="row">
              <span>{t.kpi.locations}</span>
              <span>MTL · QC</span>
            </div>
            <div className="row">
              <span>{t.kpi.frequency}</span>
              <span>{t.kpi.irregular}</span>
            </div>
            <div className="row">
              <span>{t.kpi.status}</span>
              <span className="acc">{t.transmitting}</span>
            </div>
          </div>
        </section>

        <div className="strip">
          <div className="track">
            {stripItems}
            {stripItems}
          </div>
          <div className="track">
            {stripItems}
            {stripItems}
          </div>
        </div>

        <div className="section-head">
          <div>
            <div className="idx">{t.s1_idx}</div>
            <h2>{t.s1_title}</h2>
          </div>
          <div className="meta">
            <Link to="/releases" className="link">
              {t.s1_all}
            </Link>
          </div>
        </div>

        <div className="latest">
          {latest.map(r => {
            const proj = r.project ? OI_DATA.projectById[r.project] : null
            return (
              <Link
                key={r.cat}
                className="rel"
                to={proj ? `/project/${proj.id}` : '/releases'}
              >
                <Cover id={r.cat} label={r.cat} title={i18n(r.title)} artist={proj ? proj.name : t.various} format={i18n(r.format)} year={r.year} duration={r.duration} />
                <div className="m">
                  {r.cat} · {i18n(r.format)}
                </div>
                <div className="t">{i18n(r.title)}</div>
                <div className="m dim">
                  {proj ? proj.name : t.various} · {r.year}
                </div>
              </Link>
            )
          })}
        </div>

        <div className="section-head">
          <div>
            <div className="idx">{t.s2_idx}</div>
            <h2>{t.s2_title}</h2>
          </div>
          <div className="meta">
            <Link to="/about" className="link">
              {t.s2_all}
            </Link>
          </div>
        </div>

        <div className="two-col">
          <p className="quote">{t.s2_quote}</p>
          <div className="signal-box">
            <div className="small upper dim" style={{ marginBottom: 8 }}>
              {t.s2_call_kicker}
            </div>
            <div
              className="serif italic"
              style={{ fontSize: 'var(--step-2)', lineHeight: 1.2 }}
            >
              {t.s2_call_body}
            </div>
            <Link to="/contact" className="btn" style={{ marginTop: 14 }}>
              {t.s2_call_cta}
            </Link>
          </div>
        </div>

        <div className="section-head">
          <div>
            <div className="idx">{t.s3_idx}</div>
            <h2>{t.s3_title}</h2>
          </div>
          <div className="meta">
            <Link to="/events" className="link">
              {t.s3_all}
            </Link>
          </div>
        </div>

        <div className="mini-events">
          {upcoming.map((e, i) => {
            const names = e.bill
              .map(id => OI_DATA.projectById[id]?.name || id)
              .join(' · ')
            return (
              <Link key={i} className="ev" to="/events">
                <div className="d">{e.date.replace(/-/g, '.')}</div>
                <div className="b">{names}</div>
                <div className="v">
                  {e.venue} · {i18n(e.city)}
                </div>
                <div className="small upper dim">{e.status}</div>
              </Link>
            )
          })}
        </div>

        <div className="section-head">
          <div>
            <div className="idx">{t.s4_idx}</div>
            <h2>{t.s4_title}</h2>
          </div>
          <div className="meta">
            <span className="dim">{t.s4_meta}</span>
          </div>
        </div>

        {feat && (
          <div className="now-playing">
            <div className="np-row">
              <Cover id={feat.cat} label={feat.cat} title={i18n(feat.title)} artist={featProj ? featProj.name : t.various} format={i18n(feat.format)} year={feat.year} duration={feat.duration} />
              <div>
                <div className="small upper dim">
                  {feat.cat} · {t.now_playing}
                </div>
                <div
                  className="serif italic"
                  style={{ fontSize: 'var(--step-3)', lineHeight: 1.1 }}
                >
                  {i18n(feat.title)}
                </div>
                <div className="small dim" style={{ marginTop: 4 }}>
                  {featProj ? featProj.name : t.various} · {i18n(feat.format)} ·{' '}
                  {feat.duration}
                </div>
              </div>
              <div className="np-controls">
                <button className="btn">{t.prev}</button>
                <button className="btn accent">{t.play}</button>
                <button className="btn">{t.next}</button>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <Waveform seed={feat.cat.charCodeAt(4) * 7} bars={120} />
            </div>
            <div
              className="tiny dim"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 6,
              }}
            >
              <span>00:00</span>
              <span>{t.side_a}</span>
              <span>{feat.duration}</span>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  )
}
