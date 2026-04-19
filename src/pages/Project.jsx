import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import CoordBar from '../components/CoordBar.jsx'
import Footer from '../components/Footer.jsx'
import Cover from '../components/Cover.jsx'
import Waveform from '../components/Waveform.jsx'
import { OI_DATA } from '../data/oi.js'
import { useTweaks } from '../context/TweaksContext.jsx'

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
  const { tweaks, t, i18n } = useTweaks()
  const FR = tweaks.lang === 'fr'

  const p = OI_DATA.projectById[id] || OI_DATA.projects[0]

  useEffect(() => {
    document.title = `${p.name} — OI`
    return () => { document.title = 'Observatoire Idéal' }
  }, [p.name])

  const L = FR ? {
    kind: 'projet', est: 'form.',
    operators: 'opérateurs', releases: 'parutions',
    cat: 'Catalogue', founded: 'Formé en', members: 'Opérateurs', rels: 'Parutions',
    latest: 'Dernière', status: 'État', active: '■ actif',
    bio: '§ bio', ops: '§ opérateurs', disc: '§ discographie', prev: '§ aperçu', links: '§ liens',
    preview_idx: '§ aperçu · dernière parution',
    ops_h: 'Opérateurs',
    prox_h: 'Proximité · projets liés', via: 'via',
    orders_h: 'Commandes · Contact',
    link_shop: 'Boutique · éditions physiques',
    link_events: 'Prochaines dates',
    link_contact: 'Booking · presse',
    disc_idx: '§ discographie',
    disc_h: 'Toutes les parutions',
    disc_items: 'éléments',
  } : {
    kind: 'project', est: 'est',
    operators: 'operators', releases: 'releases',
    cat: 'Catalog', founded: 'Founded', members: 'Members', rels: 'Releases',
    latest: 'Latest', status: 'Status', active: '■ active',
    bio: '§ bio', ops: '§ operators', disc: '§ discography', prev: '§ preview', links: '§ links',
    preview_idx: '§ preview · latest release',
    ops_h: 'Operators',
    prox_h: 'Proximity · related projects', via: 'via',
    orders_h: 'Orders · Contact',
    link_shop: 'Shop · physical editions',
    link_events: 'Upcoming dates',
    link_contact: 'Booking & press',
    disc_idx: '§ discography',
    disc_h: 'All releases',
    disc_items: 'items',
  }

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
            <div className="cat">{p.cat} · {L.kind} · {L.est} {p.year}</div>
            <h1><span className="glitch-h" data-text={p.name}>{p.name}</span></h1>
            <div className="tags">
              {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
              <span className="tag" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                {members.length} {L.operators}
              </span>
              <span className="tag">{rels.length} {L.releases}</span>
            </div>
          </div>
          <aside>
            <div className="r"><span>{L.cat}</span><span>{p.cat}</span></div>
            <div className="r"><span>{L.founded}</span><span>{p.year}</span></div>
            <div className="r"><span>{L.members}</span><span>{members.length}</span></div>
            <div className="r"><span>{L.rels}</span><span>{rels.length}</span></div>
            <div className="r"><span>{L.latest}</span><span>{rels.at(-1)?.cat || '—'}</span></div>
            <div className="r"><span>{L.status}</span><span className="acc">{L.active}</span></div>
          </aside>
        </section>

        <div className="glyph-strip">
          <span>{L.bio}</span>
          <span>{L.ops}</span>
          <span>{L.disc}</span>
          <span>{L.prev}</span>
          <span>{L.links}</span>
        </div>

        <section className="p-body">
          <div>
            <div className="bio">
              <p>{i18n(p.summary)}</p>
              <p>{i18n(p.bio)}</p>
            </div>

            {firstRel && (
              <>
                <div className="section-head" style={{ marginTop: 50 }}>
                  <div>
                    <div className="idx">{L.preview_idx}</div>
                    <h2>{i18n(firstRel.title)}</h2>
                  </div>
                  <div className="meta">{firstRel.cat} · {firstRel.year} · {i18n(firstRel.format)}</div>
                </div>
                <div className="track-list">
                  {ft.map((tk, i) => (
                    <div key={i} className="wave-row">
                      <button className="play">▶</button>
                      <div>
                        <div className="mono small dim">A{i + 1}</div>
                        <div className="serif italic" style={{ fontSize: 'var(--step-1)' }}>{tk}</div>
                      </div>
                      <Waveform seed={seed + i * 13} bars={60} />
                      <span className="t">{mmss(180 + (seed * (i + 1)) % 260)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="stack-lg">
            <div className="members-box">
              <h4>{L.ops_h}</h4>
              {members.map(m => (
                <div key={m.id} className="m">
                  <span className="n">{m.name}</span>
                  <span className="r">{i18n(m.role)}</span>
                </div>
              ))}
            </div>

            {related.length > 0 && (
              <div className="links-box">
                <h4>{L.prox_h}</h4>
                <div className="related">
                  {related.map(r => {
                    const shared = r.members
                      .filter(m => p.members.includes(m))
                      .map(m => OI_DATA.memberById[m].name)
                      .join(', ')
                    return (
                      <Link key={r.id} to={`/project/${r.id}`}>
                        <span className="c">{r.cat}</span>
                        {r.name} <span className="dim">· {L.via} {shared}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="links-box">
              <h4>{L.orders_h}</h4>
              <div
                className="stack"
                style={{ fontFamily: 'var(--f-mono)', fontSize: 'var(--step--1)', color: 'var(--ink-2)', lineHeight: 1.7 }}
              >
                <div><Link className="link" to="/shop">{L.link_shop}</Link></div>
                <div><Link className="link" to="/events">{L.link_events}</Link></div>
                <div><Link className="link" to="/contact">{L.link_contact}</Link></div>
              </div>
            </div>
          </div>
        </section>

        <div className="section-head">
          <div>
            <div className="idx">{L.disc_idx}</div>
            <h2>{L.disc_h}</h2>
          </div>
          <div className="meta">{rels.length} {L.disc_items}</div>
        </div>

        <div className="discography">
          {rels.map(r => (
            <Link key={r.cat} className="rel-row" to="/releases">
              <Cover id={r.cat} label={r.cat} />
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
