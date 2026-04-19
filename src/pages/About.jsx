import Nav from '../components/Nav.jsx'
import CoordBar from '../components/CoordBar.jsx'
import Footer from '../components/Footer.jsx'
import { Link } from 'react-router-dom'
import { OI_DATA } from '../data/oi.js'
import { useTweaks } from '../context/TweaksContext.jsx'

export default function About() {
  const { tweaks, t, i18n } = useTweaks()
  const paragraphs = OI_DATA.label.manifesto[tweaks.lang] || OI_DATA.label.manifesto.fr
  return (
    <div className="scanlines" data-screen-label="About">
      <div className="frame">
        <Nav active="about" />
        <CoordBar section={`/ ${t.nav.about.toLowerCase()}`} catalog={t.about_catalog} />

        <section className="a-head">
          <div className="kicker">{t.about_kicker}</div>
          <h1>
            <em dangerouslySetInnerHTML={{ __html: t.about_h1 }} />
          </h1>
        </section>

        <div className="manifesto">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <div className="facts">
          <div className="f"><div className="n">30</div><div className="l">{t.about_facts.items}</div></div>
          <div className="f"><div className="n">12</div><div className="l">{t.about_facts.projects}</div></div>
          <div className="f"><div className="n">14</div><div className="l">{t.about_facts.operators}</div></div>
          <div className="f"><div className="n">09</div><div className="l">{t.about_facts.years}</div></div>
        </div>

        <div className="section-head">
          <div>
            <div className="idx">{t.about_colophon_idx}</div>
            <h2>{t.about_colophon_h}</h2>
          </div>
          <div className="meta">{t.about_rev}</div>
        </div>

        <dl className="colophon">
          <div><h3>{t.about_ed}</h3></div>
          <div>
            <dt>{t.about_name_t}</dt><dd>{t.about_name_b}</dd>
            <dt>{t.about_origin_t}</dt><dd>{t.about_origin_b}</dd>
            <dt>{t.about_method_t}</dt><dd>{t.about_method_b}</dd>
          </div>
          <div><h3>{t.about_prod}</h3></div>
          <div>
            <dt>{t.about_press_t}</dt><dd>{t.about_press_b}</dd>
            <dt>{t.about_master_t}</dt><dd>{t.about_master_b}</dd>
            <dt>{t.about_design_t}</dt><dd>{t.about_design_b}</dd>
          </div>
          <div><h3>{t.about_eth}</h3></div>
          <div>
            <dt>{t.about_algo_t}</dt><dd>{t.about_algo_b}</dd>
            <dt>{t.about_stream_t}</dt><dd>{t.about_stream_b}</dd>
            <dt>{t.about_data_t}</dt><dd>{t.about_data_b}</dd>
          </div>
        </dl>

        <div className="section-head">
          <div>
            <div className="idx">{t.about_op_idx}</div>
            <h2>{t.about_op_h}</h2>
          </div>
          <div className="meta">
            <Link to="/roster" className="link">{t.about_op_cta}</Link>
          </div>
        </div>

        <div className="people">
          {OI_DATA.members.map(m => (
            <div className="p" key={m.id}>
              <span className="n">{m.name}</span>
              <span className="r">{i18n(m.role)}</span>
            </div>
          ))}
        </div>

        <Footer />
      </div>
    </div>
  )
}
