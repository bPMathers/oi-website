import { useState } from 'react'
import Nav from '../components/Nav.jsx'
import CoordBar from '../components/CoordBar.jsx'
import Footer from '../components/Footer.jsx'
import { useTweaks } from '../context/TweaksContext.jsx'

export default function Contact() {
  const { tweaks, t } = useTweaks()
  const FR = tweaks.lang === 'fr'
  const [sent, setSent] = useState(false)

  const subjects = FR
    ? ['Demande générale', 'Soumission démo (Avant-poste III uniquement)', 'Presse & radio', 'Programmation', 'Revente', 'Commande boutique']
    : ['General enquiry', 'Demo submission (Outpost III only)', 'Press & radio', 'Booking', 'Wholesale', 'Shop order']

  const routes = FR ? [
    { h: 'général',        e: 'bonjour@observatoire-ideal.net', d: "Tout ce qui n'entre pas ailleurs." },
    { h: 'presse · radio', e: 'presse@observatoire-ideal.net',  d: 'Promo, entrevues, aperçus sous embargo.' },
    { h: 'programmation',  e: 'booking@observatoire-ideal.net', d: "Pour tous les projets. Nous bookons à l'interne." },
    { h: 'revente',        e: 'revente@observatoire-ideal.net', d: 'Disquaires indépendants · dépôt ou ferme.' },
  ] : [
    { h: 'general',        e: 'hello@observatoire-ideal.net',   d: "Everything that doesn't fit below." },
    { h: 'press · radio',  e: 'press@observatoire-ideal.net',   d: 'Promo requests, interviews, embargoed previews.' },
    { h: 'booking',        e: 'booking@observatoire-ideal.net', d: 'For all projects. We book in-house.' },
    { h: 'trade',          e: 'trade@observatoire-ideal.net',   d: 'Independent shops · consignment or firm order.' },
  ]

  return (
    <div className="scanlines" data-screen-label="Contact">
      <div className="frame">
        <Nav active="contact" />
        <CoordBar
          section={`/ ${t.nav.contact.toLowerCase()}`}
          catalog={FR ? 'ouvert · réponse 7 jours' : 'open · 7-day reply'}
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
            <div>5445 av. de Gaspé, #510<br />Montréal (QC) H2T 3B2 · Canada<br />+1 514 000 0000</div>

            <div className="office" style={{ marginTop: 24 }}>Québec</div>
            <div>175 rue Saint-Jean<br />Québec (QC) G1R 1N4 · Canada<br />+1 418 000 0000</div>

            <h3>{FR ? "À l'oreille" : 'By ear'}</h3>
            <div>
              {FR
                ? <>Heures · mardi–vendredi · 11h–18h<br />Pas de boutique publique. Visites sur rendez-vous.</>
                : <>Hours · Tuesday – Friday · 11h – 18h<br />Not a public-facing shop. Visits by appointment.</>}
            </div>

            <h3>{FR ? 'Presse' : 'Press'}</h3>
            <div>
              {FR
                ? "Visuels haute résolution et biographies sur demande. Aperçus sous embargo disponibles à la presse et à la radio jusqu'à 8 semaines avant la parution."
                : 'High-res artwork and bios on request. Embargoed previews available to press & radio up to 8 weeks before release.'}
            </div>
          </div>

          <form
            className="form"
            onSubmit={(e) => { e.preventDefault(); setSent(true) }}
          >
            <h3>{t.contact_form_h}</h3>
            <label>{t.contact_subject}</label>
            <select>
              {subjects.map(s => <option key={s}>{s}</option>)}
            </select>
            <label>{t.contact_name}</label>
            <input type="text" required />
            <label>{FR ? 'Courriel de réponse' : 'Reply-to'}</label>
            <input type="email" placeholder={FR ? 'vous@ailleurs.net' : 'you@elsewhere.net'} required />
            <label>{t.contact_message}</label>
            <textarea placeholder={FR ? 'Bref. Nous lisons chacun.' : 'Keep it short. We read every one.'} />
            <button className="btn accent" style={{ marginTop: 18 }} type="submit">
              {t.contact_submit}
            </button>
            <div className={`sent ${sent ? 'on' : ''}`}>{t.contact_ack}</div>
          </form>
        </div>

        <div className="section-head">
          <div>
            <div className="idx">{FR ? '§ lignes directes' : '§ direct lines'}</div>
            <h2>{FR ? 'Aiguillage' : 'Routing'}</h2>
          </div>
          <div className="meta">{FR ? 'aucune réponse automatique' : 'no auto-replies'}</div>
        </div>

        <div className="routing">
          {routes.map(r => (
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
