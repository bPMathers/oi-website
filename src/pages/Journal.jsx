import { useState } from 'react'
import Nav from '../components/Nav.jsx'
import CoordBar from '../components/CoordBar.jsx'
import Footer from '../components/Footer.jsx'
import { OI_DATA } from '../data/oi.js'
import { useTweaks } from '../context/TweaksContext.jsx'

export default function Journal() {
  const { t, i18n } = useTweaks()
  const [subscribed, setSubscribed] = useState(false)

  return (
    <div className="scanlines" data-screen-label="Journal">
      <div className="frame">
        <Nav active="journal" />
        <CoordBar
          section={`/ ${t.nav.journal.toLowerCase()}`}
          catalog={t.journal_catalog}
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
                  {t.events_months[d.getUTCMonth()]} · {d.getUTCFullYear()}
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
                  {t.journal_asides[i % t.journal_asides.length]}
                  <br />
                  <span style={{ color: 'var(--ink-2)' }}>
                    {t.journal_filed} {n.date.replace(/-/g, '.')}
                  </span>
                </div>
              </article>
            )
          })}
        </div>

        <div className="subscribe">
          <div>
            <h4>{t.journal_sub_h}</h4>
            <div className="dim">{t.journal_sub_desc}</div>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); setSubscribed(true) }}
          >
            <input
              type="email"
              required
              placeholder={t.journal_sub_placeholder}
            />
            <button className="btn accent" type="submit">
              {subscribed ? t.journal_sub_done : t.journal_sub_btn}
            </button>
          </form>
        </div>

        <Footer />
      </div>
    </div>
  )
}
