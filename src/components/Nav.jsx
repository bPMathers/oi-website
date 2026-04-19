import { Link } from 'react-router-dom'
import { useTweaks } from '../context/TweaksContext.jsx'

export default function Nav({ active }) {
  const { tweaks, setTweak, t } = useTweaks()
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
    <nav className="nav">
      <Link to="/" className="brand">
        Observatoire<span className="dot" />Idéal
      </Link>
      <ul>
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
