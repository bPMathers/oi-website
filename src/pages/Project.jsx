import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import CoordBar from '../components/CoordBar.jsx'
import Footer from '../components/Footer.jsx'
import Cover from '../components/Cover.jsx'
import { OI_DATA } from '../data/oi.js'
import { useTweaks } from '../context/TweaksContext.jsx'

import TrackRow from '../components/TrackRow.jsx'

const TRACK_TITLES = [
  ['Signal, partial', 'Room tone (west)', 'Coda for open window', 'Untitled, slowed'],
  ['I', 'II', 'III', 'IV', 'V'],
  ['Chapel A', 'Chapel B', 'Chapel C'],
  ['Elevation 01', 'Elevation 02', 'Elevation 03', 'Elevation 04'],
  ['Crash 0x1A', 'Crash 0x1B', 'Crash 0x2F'],
  ['Stairwell I', 'Stairwell II', 'Stairwell III', 'Stairwell IV'],
  ['Long wave', 'Short wave', 'No wave'],
  ['Drift A', 'Drift B', 'Drift C', 'Drift D'],
]

function trackTitlesFor(cat) {
  let h = 0
  for (let i = 0; i < cat.length; i++) h = (h * 31 + cat.charCodeAt(i)) | 0
  return TRACK_TITLES[Math.abs(h) % TRACK_TITLES.length]
}

function mmss(n) {
  const m = Math.floor(n / 60), s = n % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Project() {
  const { id } = useParams()
  const { t, i18n } = useTweaks()

  const p = OI_DATA.projectById[id] || OI_DATA.projects[0]

  useEffect(() => {
    document.title = `${p.name} — OI`
    // Scroll to hash anchor if present
    const hash = window.location.hash
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      window.scrollTo(0, 0)
    }
    return () => { document.title = 'Observatoire Idéal' }
  }, [p.name])

  const rels = OI_DATA.releases.filter(r => r.project === p.id)
  const related = OI_DATA.projects.filter(o => o.id !== p.id && o.members.some(m => p.members.includes(m)))
  const members = p.members.map(mid => OI_DATA.memberById[mid])
  const firstRel = rels[0]
  const ft = firstRel ? trackTitlesFor(firstRel.cat) : ['—']
  const seed = firstRel ? firstRel.cat.charCodeAt(4) * 3 : 17
  const tags = i18n(p.tags)

  return (
    <div className="scanlines" data-screen-label="Project">
      <div className="frame">
        <Nav active="roster" />
        <CoordBar section={`/ roster / ${p.id}`} catalog={p.cat} />

        <section className="p-head">
          <div>
            <div className="cat">{p.cat} · {t.project_kind} · {t.project_est} {p.year}</div>
            <h1><span className="glitch-h" data-text={p.name}>{p.name}</span></h1>
            <div className="tags">
              {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
              <span className="tag" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                {members.length} {t.project_operators}
              </span>
              <span className="tag">{rels.length} {t.project_releases}</span>
            </div>
          </div>
          <aside>
            <div className="r"><span>{t.project_cat}</span><span>{p.cat}</span></div>
            <div className="r"><span>{t.project_founded}</span><span>{p.year}</span></div>
            <div className="r"><span>{t.project_members}</span><span>{members.length}</span></div>
            <div className="r"><span>{t.project_rels}</span><span>{rels.length}</span></div>
            <div className="r"><span>{t.project_latest}</span><span>{rels.at(-1)?.cat || '—'}</span></div>
            <div className="r"><span>{t.project_status}</span><span className="acc">{t.project_active}</span></div>
          </aside>
        </section>

        <div className="glyph-strip">
          <a href="#bio" onClick={e => { e.preventDefault(); document.getElementById('bio')?.scrollIntoView({ behavior: 'smooth' }) }}>{t.project_bio}</a>
          <a href="#operators" onClick={e => { e.preventDefault(); document.getElementById('operators')?.scrollIntoView({ behavior: 'smooth' }) }}>{t.project_ops}</a>
          <a href="#discography" onClick={e => { e.preventDefault(); document.getElementById('discography')?.scrollIntoView({ behavior: 'smooth' }) }}>{t.project_disc}</a>
          <a href="#preview" onClick={e => { e.preventDefault(); document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth' }) }}>{t.project_prev}</a>
          <a href="#links" onClick={e => { e.preventDefault(); document.getElementById('links')?.scrollIntoView({ behavior: 'smooth' }) }}>{t.project_links}</a>
        </div>

        <section className="p-body">
          <div>
            <div className="bio" id="bio">
              <p>{i18n(p.summary)}</p>
              <p>{i18n(p.bio)}</p>
            </div>

            {firstRel && (
              <>
                <div className="section-head" id="preview" style={{ marginTop: 50 }}>
                  <div>
                    <div className="idx">{t.project_preview_idx}</div>
                    <h2>{i18n(firstRel.title)}</h2>
                  </div>
                  <div className="meta">{firstRel.cat} · {firstRel.year} · {i18n(firstRel.format)}</div>
                </div>
                <div className="track-list">
                  {ft.map((tk, i) => (
                    <TrackRow
                      key={i}
                      instanceId={`${p.id}-track-${i}`}
                      index={i}
                      title={tk}
                      seed={seed + i * 13}
                      durationSec={180 + (seed * (i + 1)) % 260}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="stack-lg">
            <div className="members-box" id="operators">
              <h4>{t.project_ops_h}</h4>
              {members.map(m => (
                <div key={m.id} className="m">
                  <span className="n">{m.name}</span>
                  <span className="r">{i18n(m.role)}</span>
                </div>
              ))}
            </div>

            {related.length > 0 && (
              <div className="links-box">
                <h4>{t.project_prox_h}</h4>
                <div className="related">
                  {related.map(r => {
                    const shared = r.members
                      .filter(m => p.members.includes(m))
                      .map(m => OI_DATA.memberById[m].name)
                      .join(', ')
                    return (
                      <Link key={r.id} to={`/project/${r.id}`}>
                        <span className="c">{r.cat}</span>
                        {r.name} <span className="dim">· {t.project_via} {shared}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="links-box" id="links">
              <h4>{t.project_orders_h}</h4>
              <div
                className="stack"
                style={{ fontFamily: 'var(--f-mono)', fontSize: 'var(--step--1)', color: 'var(--ink-2)', lineHeight: 1.7 }}
              >
                <div><Link className="link" to="/shop">{t.project_link_shop}</Link></div>
                <div><Link className="link" to="/events">{t.project_link_events}</Link></div>
                <div><Link className="link" to="/contact">{t.project_link_contact}</Link></div>
              </div>
            </div>
          </div>
        </section>

        <div className="section-head" id="discography">
          <div>
            <div className="idx">{t.project_disc_idx}</div>
            <h2>{t.project_disc_h}</h2>
          </div>
          <div className="meta">{rels.length} {t.project_disc_items}</div>
        </div>

        <div className="discography">
          {rels.map(r => (
            <Link key={r.cat} className="rel-row" to="/releases">
              <Cover id={r.cat} label={r.cat} title={i18n(r.title)} artist={p.name} format={i18n(r.format)} year={r.year} duration={r.duration} />
              <div>
                <div className="t">{i18n(r.title)}</div>
                <div className="meta">{r.cat} · {i18n(r.format)}</div>
              </div>
              <div className="meta">{r.duration}</div>
              <div className="meta dim">{r.year}</div>
            </Link>
          ))}
        </div>

        <Footer />
      </div>
    </div>
  )
}
