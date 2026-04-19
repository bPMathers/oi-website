import { useState } from 'react'
import Nav from '../components/Nav.jsx'
import CoordBar from '../components/CoordBar.jsx'
import Footer from '../components/Footer.jsx'
import { useTweaks } from '../context/TweaksContext.jsx'

export default function Contact() {
  const { t } = useTweaks()
  const [sent, setSent] = useState(false)

  return (
    <div className="scanlines" data-screen-label="Contact">
      <div className="frame">
        <Nav active="contact" />
        <CoordBar
          section={`/ ${t.nav.contact.toLowerCase()}`}
          catalog={t.contact_catalog}
        />

        <section className="c-head">
          <div className="mono small upper acc">{t.contact_kicker}</div>
          <h1>
            <em dangerouslySetInnerHTML={{ __html: t.contact_h1 }} />
          </h1>
        </section>

        <div className="c-grid">
          <div className="addr">
            <h3>{t.contact_offices_h}</h3>
            <div className="office">Montréal</div>
            <div>0000 av. de Poil Poli, #69<br />Montréal (QC) H2T 3B2 · Canada<br />+1 514 000 0000</div>

            <div className="office" style={{ marginTop: 24 }}>Québec</div>
            <div>000 rue Saint-Fardoche<br />Québec (QC) G1R 1N4 · Canada<br />+1 418 000 0000</div>

            <h3>{t.contact_by_ear_h}</h3>
            <div>
              {t.contact_hours}<br />{t.contact_visits}
            </div>

            <h3>{t.contact_press_h}</h3>
            <div>{t.contact_press_b}</div>
          </div>

          <form
            className="form"
            onSubmit={(e) => { e.preventDefault(); setSent(true) }}
          >
            <h3>{t.contact_form_h}</h3>
            <label>{t.contact_subject}</label>
            <select>
              {t.contact_subjects.map(s => <option key={s}>{s}</option>)}
            </select>
            <label>{t.contact_name}</label>
            <input type="text" required />
            <label>{t.contact_reply_label}</label>
            <input type="email" placeholder={t.contact_reply_placeholder} required />
            <label>{t.contact_message}</label>
            <textarea placeholder={t.contact_message_placeholder} />
            <button className="btn accent" style={{ marginTop: 18 }} type="submit">
              {t.contact_submit}
            </button>
            <div className={`sent ${sent ? 'on' : ''}`}>{t.contact_ack}</div>
          </form>
        </div>

        <div className="section-head">
          <div>
            <div className="idx">{t.contact_lines_idx}</div>
            <h2>{t.contact_routing_h}</h2>
          </div>
          <div className="meta">{t.contact_routing_meta}</div>
        </div>

        <div className="routing">
          {t.contact_routes.map(r => (
            <div key={r.h} className="r">
              <h4>{r.h}</h4>
              <div className="e">{r.e}</div>
              <div className="d">{r.d}</div>
            </div>
          ))}
        </div>

        <Footer />
      </div>
    </div>
  )
}
