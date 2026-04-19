import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import CoordBar from '../components/CoordBar.jsx'
import Footer from '../components/Footer.jsx'
import Cover from '../components/Cover.jsx'
import { OI_DATA } from '../data/oi.js'
import { useTweaks } from '../context/TweaksContext.jsx'

export default function Releases() {
  const { t, i18n } = useTweaks()
  const navigate = useNavigate()
  const [view, setView] = useState('table')
  const rels = OI_DATA.releases

  const byYear = useMemo(() => {
    const m = {}
    rels.forEach(r => { (m[r.year] ||= []).push(r) })
    return m
  }, [rels])
  const years = Object.keys(byYear).sort((a, b) => b - a)

  const hrefFor = r => {
    const proj = r.project ? OI_DATA.projectById[r.project] : null
    return proj ? `/project/${proj.id}` : '/releases'
  }

  return (
    <div className="scanlines" data-screen-label="Releases">
      <div className="frame">
        <Nav active="releases" />
        <CoordBar section={`/ ${t.nav.releases.toLowerCase()}`} catalog="OBS-001 → 030" />

        <section className="r-head">
          <div>
            <div className="mono small upper dim" style={{ marginBottom: 10 }}>
              {t.releases_kicker}
            </div>
            <h1>
              <em dangerouslySetInnerHTML={{ __html: t.releases_h1 }} />
            </h1>
          </div>
          <div className="mono small dim" style={{ borderLeft: '1px solid var(--rule)', paddingLeft: 18, lineHeight: 1.8 }}>
            {t.releases_lede}
          </div>
        </section>

        <div className="view-toggle">
          <span>{t.view}</span>
          {['table', 'grid', 'timeline'].map(v => (
            <button
              key={v}
              className={view === v ? 'active' : ''}
              onClick={() => setView(v)}
            >
              {v === 'table' ? t.view_table : v === 'grid' ? t.view_grid : t.view_timeline}
            </button>
          ))}
        </div>

        {view === 'table' && (
          <table className="tbl">
            <thead>
              <tr>
                <th>{t.th.cat}</th><th>{t.th.title}</th><th>{t.th.project}</th>
                <th>{t.th.format}</th><th>{t.th.year}</th><th>{t.th.duration}</th>
              </tr>
            </thead>
            <tbody>
              {rels.map(r => {
                const proj = r.project ? OI_DATA.projectById[r.project] : null
                return (
                  <tr key={r.cat} onClick={() => navigate(hrefFor(r))} style={{ cursor: 'pointer' }}>
                    <td className="cat-cell">{r.cat}</td>
                    <td><span className="serif italic" style={{ fontSize: 'var(--step-1)' }}>{i18n(r.title)}</span></td>
                    <td>{proj ? proj.name : <span className="dim">{t.various}</span>}</td>
                    <td>{i18n(r.format)}</td>
                    <td>{r.year}</td>
                    <td>{r.duration}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {view === 'grid' && (
          <div className="grid-view">
            {rels.map(r => {
              const proj = r.project ? OI_DATA.projectById[r.project] : null
              return (
                <a key={r.cat} href={hrefFor(r)} onClick={(e) => { e.preventDefault(); navigate(hrefFor(r)) }}>
                  <Cover id={r.cat} label={r.cat} title={i18n(r.title)} artist={proj ? proj.name : t.various} format={i18n(r.format)} year={r.year} duration={r.duration} />
                  <div className="t">{i18n(r.title)}</div>
                  <div className="m">{(proj ? proj.name : t.various)} · {i18n(r.format)}</div>
                </a>
              )
            })}
          </div>
        )}

        {view === 'timeline' && (
          <div className="timeline">
            {years.map(y => (
              <div key={y}>
                <div className="tl-year">{y}</div>
                <div>
                  {byYear[y].map(r => {
                    const proj = r.project ? OI_DATA.projectById[r.project] : null
                    return (
                      <a
                        key={r.cat}
                        href={hrefFor(r)}
                        onClick={(e) => { e.preventDefault(); navigate(hrefFor(r)) }}
                        className="tl-row"
                      >
                        <span className="mono acc small">{r.cat}</span>
                        <span className="serif italic" style={{ fontSize: 'var(--step-2)' }}>{i18n(r.title)}</span>
                        <span className="mono small dim2">{proj ? proj.name : t.various}</span>
                        <span className="mono small dim">{i18n(r.format)}</span>
                      </a>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <Footer />
      </div>
    </div>
  )
}
