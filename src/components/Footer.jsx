import { Link } from 'react-router-dom'
import { useTweaks } from '../context/TweaksContext.jsx'

export default function Footer() {
  const { t } = useTweaks()
  return (
    <footer className="foot">
      <div>
        <h5>Observatoire Idéal</h5>
        <div>
          {t.foot_tag1}
          <br />
          {t.foot_tag2}
        </div>
        <div style={{ marginTop: 10 }} className="dim">
          Montréal · QC
          <br />
          {t.foot_est}
        </div>
      </div>
      <div>
        <h5>{t.foot_catalog_h}</h5>
        <Link to="/releases">{t.foot_catalog_releases}</Link>
        <Link to="/roster">{t.foot_catalog_roster}</Link>
        <Link to="/journal">{t.foot_catalog_journal}</Link>
      </div>
      <div>
        <h5>{t.foot_commerce_h}</h5>
        <Link to="/shop">{t.foot_commerce_shop}</Link>
        <Link to="/shop">{t.foot_commerce_sub}</Link>
        <Link to="/contact">{t.foot_commerce_trade}</Link>
      </div>
      <div>
        <h5>{t.foot_signal_h}</h5>
        <Link to="/contact">{t.foot_signal_contact}</Link>
        <Link to="/contact">{t.foot_signal_demo}</Link>
        <Link to="/about">{t.foot_signal_manifesto}</Link>
        <div className="tiny dim" style={{ marginTop: 14 }}>
          {t.foot_copy}
        </div>
      </div>
    </footer>
  )
}
