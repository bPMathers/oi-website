import { useState } from 'react'
import Nav from '../components/Nav.jsx'
import CoordBar from '../components/CoordBar.jsx'
import Footer from '../components/Footer.jsx'
import { OI_DATA } from '../data/oi.js'
import { useTweaks } from '../context/TweaksContext.jsx'

const MONTHS_FR = ['JAN','FÉV','MAR','AVR','MAI','JUIN','JUIL','AOÛT','SEPT','OCT','NOV','DÉC']
const MONTHS_EN = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

const ASIDES_FR = [
  'signé · m.s. · montréal',
  'signé · éditeurs · québec',
  'tag · avant-poste · appel',
  'tag · notes · compte-rendu',
  'tag · catalogue · annonce',
  'signé · e.k. · mile end',
]
const ASIDES_EN = [
  'signed · m.s. · montréal',
  'signed · editors · québec',
  'tagged · outpost · open-call',
  'tagged · notes · review',
  'tagged · catalog · announcement',
  'signed · e.k. · mile end',
]

export default function Journal() {
  const { tweaks, t, i18n } = useTweaks()
  const FR = tweaks.lang === 'fr'
  const MONTHS = FR ? MONTHS_FR : MONTHS_EN
  const ASIDES = FR ? ASIDES_FR : ASIDES_EN
  const [subscribed, setSubscribed] = useState(false)

  return (
    <div className="scanlines" data-screen-label="Journal">
      <div className="frame">
        <Nav active="journal" />
        <CoordBar
          section={`/ ${t.nav.journal.toLowerCase()}`}
          catalog={FR ? 'irrégulier' : 'irregular'}
        />

        <section className="j-head">
          <div className="mono small upper dim" style={{ marginBottom: 12 }}>
            {t.journal_kicker}
          </div>
          <h1>
            <em dangerouslySetInnerHTML={{ __html: t.journal_h1 }} />
          </h1>
          <p className="mono small dim" style={{ maxWidth: '60ch', marginTop: 18 }}>
            {t.journal_lede}
          </p>
        </section>

        <div>
          {OI_DATA.news.map((n, i) => {
            const d = new Date(n.date + 'T00:00:00Z')
            return (
              <article key={i} className="entry">
                <div className="d">
                  <span className="n">{String(d.getUTCDate()).padStart(2, '0')}</span>
                  {MONTHS[d.getUTCMonth()]} · {d.getUTCFullYear()}
                </div>
                <div>
                  <h3>{i18n(n.title)}</h3>
                  <p>{i18n(n.body)}</p>
                  <div className="tags" style={{ marginTop: 14 }}>
                    <span className="tag">journal</span>
                    <span className="tag" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                      n° {String(OI_DATA.news.length - i).padStart(3, '0')}
                    </span>
                  </div>
                </div>
                <div className="aside">
                  {ASIDES[i % ASIDES.length]}
                  <br />
                  <span style={{ color: 'var(--ink-2)' }}>
                    {FR ? 'déposé' : 'filed'} {n.date.replace(/-/g, '.')}
                  </span>
                </div>
              </article>
            )
          })}
        </div>

        <div className="subscribe">
          <div>
            <h4>{FR ? 'Recevoir les transmissions' : 'Receive transmissions'}</h4>
            <div className="dim">
              {FR
                ? 'un courriel par parution · aucune promo · aucun suivi'
                : 'one email per release · no marketing · no tracking'}
            </div>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); setSubscribed(true) }}
          >
            <input
              type="email"
              required
              placeholder={FR ? 'vous@ailleurs.net' : 'you@elsewhere.net'}
            />
            <button className="btn accent" type="submit">
              {subscribed
                ? (FR ? '✓ inscrit' : '✓ registered')
                : (FR ? "s'inscrire" : 'subscribe')}
            </button>
          </form>
        </div>

        <Footer />
      </div>
    </div>
  )
}
