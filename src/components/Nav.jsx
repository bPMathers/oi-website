import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTweaks } from '../context/TweaksContext.jsx'

export default function Nav({ active }) {
  const { tweaks, setTweak, t } = useTweaks()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { setOpen(false) }, [location.pathname])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  const pages = [
    { to: '/',         label: t.nav.home,     key: 'home' },
    { to: '/roster',   label: t.nav.roster,   key: 'roster' },
    { to: '/releases', label: t.nav.releases, key: 'releases' },
    { to: '/events',   label: t.nav.events,   key: 'events' },
    { to: '/journal',  label: t.nav.journal,  key: 'journal' },
    { to: '/shop',     label: t.nav.shop,     key: 'shop' },
    { to: '/about',    label: t.nav.about,    key: 'about' },
    { to: '/contact',  label: t.nav.contact,  key: 'contact' },
  ]
  return (
    <nav className={`nav ${open ? 'open' : ''}`}>
      <Link to="/" className="brand">
        Observatoire<span className="dot" />Idéal
      </Link>
      <button
        className={`nav-burger ${open ? 'open' : ''}`}
        aria-label={open ? t.nav_close : t.nav_open}
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span /><span /><span />
      </button>
      <ul className={open ? 'open' : ''}>
        {pages.map(p => (
          <li key={p.key}>
            <Link to={p.to} className={p.key === active ? 'active' : ''}>
              {p.label}
            </Link>
          </li>
        ))}
        <li className="lang-toggle">
          <button
            className={`lang-btn ${tweaks.lang === 'fr' ? 'active' : ''}`}
            onClick={() => setTweak('lang', 'fr')}
          >
            FR
          </button>
          <span className="lang-sep">/</span>
          <button
            className={`lang-btn ${tweaks.lang === 'en' ? 'active' : ''}`}
            onClick={() => setTweak('lang', 'en')}
          >
            EN
          </button>
        </li>
      </ul>
    </nav>
  )
}
