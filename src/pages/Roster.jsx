import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import CoordBar from '../components/CoordBar.jsx'
import Footer from '../components/Footer.jsx'
import { OI_DATA } from '../data/oi.js'
import { useTweaks } from '../context/TweaksContext.jsx'

const LINK_D = 170
const CHARGE = -1400
const CENTER = 0.004
const FRICTION = 0.55
const MAX_V = 4
const TIMESTEP = 0.35

function computeEdges(projects) {
  const edges = []
  for (let i = 0; i < projects.length; i++) {
    for (let j = i + 1; j < projects.length; j++) {
      const shared = projects[i].members.filter(m => projects[j].members.includes(m))
      if (shared.length > 0) edges.push({ a: i, b: j, shared })
    }
  }
  return edges
}

export default function Roster() {
  const { tweaks, setTweak, t, i18n } = useTweaks()
  const navigate = useNavigate()

  const projects = OI_DATA.projects
  const members = OI_DATA.members
  const edges = useMemo(() => computeEdges(projects), [projects])

  const stageRef = useRef(null)
  const popupRef = useRef(null)
  const simRef = useRef([])
  const edgeRefs = useRef([])
  const nodeRefs = useRef([])
  const alphaRef = useRef(1)
  const rafRef = useRef(null)
  const layoutRef = useRef(tweaks.graphLayout)
  const draggingRef = useRef(null)

  const [popup, setPopup] = useState(null)
  const [mobilePopup, setMobilePopup] = useState(null)
  const [highlightMid, setHighlightMid] = useState(null)

  const isMobile = () => window.innerWidth <= 720

  const seedLayout = (layout) => {
    const stage = stageRef.current
    if (!stage) return
    const W = stage.clientWidth, H = stage.clientHeight
    const cx = W / 2, cy = H / 2
    const sim = simRef.current
    if (layout === 'radial') {
      sim.forEach((n, i) => {
        const a = (i / sim.length) * Math.PI * 2 - Math.PI / 2
        const r = Math.min(W, H) * 0.35
        n.x = cx + Math.cos(a) * r
        n.y = cy + Math.sin(a) * r
        n.vx = n.vy = 0
      })
    } else if (layout === 'grid') {
      const cols = 4, rows = Math.ceil(sim.length / cols)
      const gw = W * 0.8, gh = H * 0.8
      const ox = (W - gw) / 2, oy = (H - gh) / 2
      sim.forEach((n, i) => {
        const c = i % cols, r = Math.floor(i / cols)
        n.x = ox + (c + 0.5) * (gw / cols)
        n.y = oy + (r + 0.5) * (gh / rows)
        n.vx = n.vy = 0
      })
    } else {
      sim.forEach((n, i) => {
        const a = i * 2.399
        const r = Math.min(W, H) * (0.15 + 0.25 * (i % 3) / 3)
        n.x = cx + Math.cos(a) * r
        n.y = cy + Math.sin(a) * r
        n.vx = n.vy = 0
      })
    }
    alphaRef.current = 1
  }

  const renderPositions = () => {
    const sim = simRef.current
    sim.forEach((n, i) => {
      const el = nodeRefs.current[i]
      if (!el) return
      el.style.left = n.x + 'px'
      el.style.top = n.y + 'px'
    })
    edges.forEach((e, i) => {
      const line = edgeRefs.current[i]
      if (!line) return
      const a = sim[e.a], b = sim[e.b]
      line.setAttribute('x1', a.x)
      line.setAttribute('y1', a.y)
      line.setAttribute('x2', b.x)
      line.setAttribute('y2', b.y)
    })
  }

  // Initialize sim on mount
  useEffect(() => {
    simRef.current = projects.map(p => ({ id: p.id, proj: p, x: 0, y: 0, vx: 0, vy: 0, fixed: false }))
    seedLayout(layoutRef.current)
    renderPositions()
    // start loop
    const loop = () => {
      if (layoutRef.current === 'force') {
        const stage = stageRef.current
        if (stage) {
          const sim = simRef.current
          alphaRef.current *= 0.992
          if (alphaRef.current < 0.02) alphaRef.current = 0.02
          const W = stage.clientWidth, H = stage.clientHeight
          const cx = W / 2, cy = H / 2

          for (let i = 0; i < sim.length; i++) {
            for (let j = i + 1; j < sim.length; j++) {
              const a = sim[i], b = sim[j]
              let dx = b.x - a.x, dy = b.y - a.y
              let d2 = dx * dx + dy * dy
              if (d2 < 20) d2 = 20
              const f = CHARGE / d2
              const d = Math.sqrt(d2)
              const fx = f * dx / d, fy = f * dy / d
              a.vx -= fx; a.vy -= fy
              b.vx += fx; b.vy += fy
            }
          }
          edges.forEach(e => {
            const a = sim[e.a], b = sim[e.b]
            const dx = b.x - a.x, dy = b.y - a.y
            const d = Math.sqrt(dx * dx + dy * dy) || 1
            const diff = d - LINK_D
            const fx = 0.04 * diff * dx / d
            const fy = 0.04 * diff * dy / d
            a.vx += fx; a.vy += fy
            b.vx -= fx; b.vy -= fy
          })
          sim.forEach(n => {
            n.vx += (cx - n.x) * CENTER
            n.vy += (cy - n.y) * CENTER
          })
          sim.forEach(n => {
            if (n.fixed) { n.vx = n.vy = 0; return }
            n.vx *= FRICTION; n.vy *= FRICTION
            const sp = Math.hypot(n.vx, n.vy)
            if (sp > MAX_V) { n.vx = n.vx / sp * MAX_V; n.vy = n.vy / sp * MAX_V }
            n.x += n.vx * TIMESTEP * alphaRef.current
            n.y += n.vy * TIMESTEP * alphaRef.current
            const pad = 60
            n.x = Math.max(pad, Math.min(W - pad, n.x))
            n.y = Math.max(pad, Math.min(H - pad, n.y))
          })
          renderPositions()
        }
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    const onResize = () => { seedLayout(layoutRef.current); renderPositions() }
    window.addEventListener('resize', onResize)

    const onPointerMove = (ev) => {
      const drag = draggingRef.current
      if (!drag) return
      const dx = ev.clientX - drag.startX, dy = ev.clientY - drag.startY
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true
      const n = simRef.current[drag.idx]
      n.x = drag.startNX + dx
      n.y = drag.startNY + dy
      n.vx = n.vy = 0
      renderPositions()
    }
    const onPointerUp = () => {
      const drag = draggingRef.current
      if (!drag) return
      const idx = drag.idx
      const moved = drag.moved
      draggingRef.current = null
      setTimeout(() => {
        const n = simRef.current[idx]
        if (n) n.fixed = false
      }, 800)
      // suppress click after drag
      if (moved) {
        const el = nodeRefs.current[idx]
        if (el) {
          const blocker = (e) => { e.preventDefault(); e.stopPropagation(); el.removeEventListener('click', blocker, true) }
          el.addEventListener('click', blocker, true)
        }
      }
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Apply layout when tweaks.graphLayout changes externally
  useEffect(() => {
    layoutRef.current = tweaks.graphLayout
    seedLayout(tweaks.graphLayout)
    renderPositions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tweaks.graphLayout])

  const handleNodeMouseEnter = (idx, e) => {
    const n = simRef.current[idx]
    if (!n) return
    setPopup({ idx, x: e.clientX, y: e.clientY })
  }
  const handleNodeMouseMove = (idx, e) => {
    if (popup && popup.idx === idx) setPopup({ idx, x: e.clientX, y: e.clientY })
  }
  const handleNodeMouseLeave = () => setPopup(null)

  const handleNodePointerDown = (idx, e) => {
    // only start drag for the primary pointer button (mouse left, touch, pen)
    if (e.button != null && e.button !== 0) return
    e.preventDefault()
    const n = simRef.current[idx]
    n.fixed = true
    draggingRef.current = {
      idx,
      startX: e.clientX,
      startY: e.clientY,
      startNX: n.x,
      startNY: n.y,
      moved: false,
    }
  }

  const handleNodeClick = (idx, e) => {
    const drag = draggingRef.current
    if (drag && drag.moved) { e.preventDefault(); return }
    e.preventDefault()
    if (isMobile()) {
      setMobilePopup(idx)
    } else {
      navigate(`/project/${simRef.current[idx].id}`)
    }
  }

  const memberProjectCount = (mid) => projects.filter(p => p.members.includes(mid)).length

  const matchSet = useMemo(() => {
    if (!highlightMid) return null
    return new Set(projects.filter(p => p.members.includes(highlightMid)).map(p => p.id))
  }, [highlightMid, projects])

  const popupPosition = (() => {
    if (!popup) return null
    const stage = stageRef.current
    if (!stage) return null
    const rect = stage.getBoundingClientRect()
    const pw = popupRef.current?.offsetWidth || 280
    const ph = popupRef.current?.offsetHeight || 200
    let x = popup.x - rect.left + 12
    let y = popup.y - rect.top + 12
    if (x + pw > rect.width - 10) x = popup.x - rect.left - pw - 12
    if (y + ph > rect.height - 10) y = popup.y - rect.top - ph - 12
    return { x, y }
  })()

  const sorted = useMemo(() => [...projects].sort((a, b) => a.name.localeCompare(b.name)), [projects])
  const popupProj = popup ? simRef.current[popup.idx]?.proj : null
  const popupMembers = popupProj ? popupProj.members.map(id => OI_DATA.memberById[id].name).join(' · ') : ''
  const popupTags = popupProj ? i18n(popupProj.tags) : []

  return (
    <div className="scanlines" data-screen-label="Roster">
      <div className="frame">
        <Nav active="roster" />
        <CoordBar section={t.roster_coord_section} catalog={t.roster_coord_catalog} />

        <section className="graph-head">
          <div>
            <div className="mono small upper dim" style={{ marginBottom: 12 }}>{t.roster_kicker}</div>
            <h1>
              <em dangerouslySetInnerHTML={{ __html: t.roster_h1 }} />
            </h1>
          </div>
          <div className="lede">{t.roster_lede}</div>
        </section>

        <div className="layout-picker">
          <span>{t.roster_layout}</span>
          {['force', 'radial', 'grid'].map(l => (
            <button
              key={l}
              className={tweaks.graphLayout === l ? 'active' : ''}
              onClick={() => setTweak('graphLayout', l)}
            >
              {l === 'force' ? t.roster_force : l === 'radial' ? t.roster_radial : t.roster_grid}
            </button>
          ))}
          <span style={{ marginLeft: 'auto' }} className="dim">{t.roster_hint}</span>
        </div>

        <div className="graph-layout">
          <div className="graph-stage" ref={stageRef}>
            <span className="axis axis-tl">x: 000.0 · y: 000.0</span>
            <span className="axis axis-tr">{t.roster_axis_tr}</span>
            <span className="axis axis-bl">12 {t.roster_nodes} · {edges.length} {t.roster_edges}</span>
            <span className="axis axis-br">rev. 0x4A · 2026.04</span>
            <span className="axis-crosshair" />
            <svg xmlns="http://www.w3.org/2000/svg">
              {edges.map((e, i) => {
                let cls = 'edge'
                if (highlightMid) {
                  const aProj = projects[e.a], bProj = projects[e.b]
                  if (aProj.members.includes(highlightMid) && bProj.members.includes(highlightMid)) cls += ' highlight'
                  else cls += ' dim'
                }
                return (
                  <line
                    key={i}
                    className={cls}
                    ref={el => (edgeRefs.current[i] = el)}
                  />
                )
              })}
            </svg>
            <div>
              {projects.map((p, i) => {
                let cls = 'node'
                if (matchSet) {
                  if (matchSet.has(p.id)) cls += ' highlight'
                  else cls += ' dim'
                }
                return (
                  <a
                    key={p.id}
                    className={cls}
                    href={`/project/${p.id}`}
                    ref={el => (nodeRefs.current[i] = el)}
                    onMouseEnter={(e) => handleNodeMouseEnter(i, e)}
                    onMouseMove={(e) => handleNodeMouseMove(i, e)}
                    onMouseLeave={handleNodeMouseLeave}
                    onPointerDown={(e) => handleNodePointerDown(i, e)}
                    onClick={(e) => handleNodeClick(i, e)}
                  >
                    <div className="dot" />
                    <div className="cat">{p.cat}</div>
                    <div className="label">{p.name}</div>
                  </a>
                )
              })}
            </div>
            <div
              className={`popup ${popup ? 'on' : ''}`}
              ref={popupRef}
              style={popupPosition ? { left: popupPosition.x, top: popupPosition.y } : undefined}
            >
              {popupProj && (
                <>
                  <div className="cat">{popupProj.cat}</div>
                  <div className="name">{popupProj.name}</div>
                  <div className="sum">{i18n(popupProj.summary)}</div>
                  <hr />
                  <div className="members">{popupMembers}</div>
                  <div className="tags">
                    {popupTags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                    <span className="tag" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                      {t.roster_est} {popupProj.year}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {mobilePopup !== null && (() => {
            const mp = simRef.current[mobilePopup]?.proj
            if (!mp) return null
            const mpMembers = mp.members.map(id => OI_DATA.memberById[id].name).join(' · ')
            const mpTags = i18n(mp.tags)
            return (
              <div className="popup-mobile-overlay" onClick={() => setMobilePopup(null)}>
                <div className="popup-mobile" onClick={e => e.stopPropagation()}>
                  <div className="cat">{mp.cat}</div>
                  <div className="name">{mp.name}</div>
                  <div className="sum">{i18n(mp.summary)}</div>
                  <hr />
                  <div className="members">{mpMembers}</div>
                  <div className="tags">
                    {mpTags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                    <span className="tag" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                      {t.roster_est} {mp.year}
                    </span>
                  </div>
                  <div className="popup-actions">
                    <button className="btn accent" onClick={() => { setMobilePopup(null); navigate(`/project/${mp.id}`) }}>
                      {t.home_cta_graph?.replace('→', '').trim() || 'Enter'} →
                    </button>
                    <button className="btn" onClick={() => setMobilePopup(null)}>✕</button>
                  </div>
                </div>
              </div>
            )
          })()}

          <aside className="sidebar">
            <h3>
              {t.roster_operators} <span>14</span>
            </h3>
            <div>
              {members.map(m => (
                <div
                  key={m.id}
                  className={`m ${highlightMid === m.id ? 'active' : ''}`}
                  onMouseEnter={() => setHighlightMid(m.id)}
                  onMouseLeave={() => setHighlightMid(null)}
                >
                  <span>
                    {m.name} <span className="dim">· {i18n(m.role)}</span>
                  </span>
                  <span className="r">{memberProjectCount(m.id)}×</span>
                </div>
              ))}
            </div>
            <div className="legend">
              <div><span className="k" /> {t.roster_legend_node}</div>
              <div><span className="l" /> {t.roster_legend_edge}</div>
              <div style={{ marginTop: 8 }}>{t.roster_legend_hint}</div>
            </div>
          </aside>
        </div>

        <div className="section-head">
          <div>
            <div className="idx">{t.roster_list_kicker}</div>
            <h2>{t.roster_list_h2}</h2>
          </div>
          <div className="meta">
            <Link to="/releases" className="link">{t.roster_list_link}</Link>
          </div>
        </div>

        <div className="roster-list">
          {sorted.map(p => {
            const names = p.members.map(id => OI_DATA.memberById[id].name).join(' · ')
            return (
              <Link key={p.id} className="row-p" to={`/project/${p.id}`}>
                <span className="cat">{p.cat}</span>
                <span className="name">{p.name}</span>
                <span className="meta">{names}</span>
                <span className="meta dim">{i18n(p.tags).join(' · ')}</span>
                <span className="meta">{p.year}</span>
              </Link>
            )
          })}
        </div>

        <Footer />
      </div>
    </div>
  )
}
