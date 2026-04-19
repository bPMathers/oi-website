import { useState } from 'react'
import Nav from '../components/Nav.jsx'
import CoordBar from '../components/CoordBar.jsx'
import Footer from '../components/Footer.jsx'
import Cover from '../components/Cover.jsx'
import { Link } from 'react-router-dom'
import { OI_DATA } from '../data/oi.js'
import { useTweaks } from '../context/TweaksContext.jsx'

export default function Shop() {
  const { t, i18n } = useTweaks()
  const [cart, setCart] = useState({})

  const items = Object.entries(cart)
  const total = items.reduce((s, [sku, q]) => {
    const p = OI_DATA.shop.find(x => x.sku === sku)
    return s + (p ? p.price * q : 0)
  }, 0)
  const count = items.reduce((s, [, q]) => s + q, 0)

  const add = (sku) => setCart(c => ({ ...c, [sku]: (c[sku] || 0) + 1 }))
  const remove = (sku) => setCart(c => {
    const q = (c[sku] || 0) - 1
    if (q <= 0) { const next = { ...c }; delete next[sku]; return next }
    return { ...c, [sku]: q }
  })
  const removeAll = (sku) => setCart(c => { const next = { ...c }; delete next[sku]; return next })

  return (
    <div className="scanlines" data-screen-label="Shop">
      <div className="frame">
        <Nav active="shop" />
        <CoordBar
          section={`/ ${t.nav.shop.toLowerCase()}`}
          catalog={`${OI_DATA.shop.length} ${t.shop_catalog_items}`}
        />

        <section className="s-head">
          <div>
            <div className="mono small upper dim" style={{ marginBottom: 12 }}>
              {t.shop_kicker}
            </div>
            <h1>
              <em dangerouslySetInnerHTML={{ __html: t.shop_h1 }} />
            </h1>
          </div>
          <div className="mono small dim" style={{ lineHeight: 1.7, borderLeft: '1px solid var(--rule)', paddingLeft: 16 }}>
            {t.shop_lede}
          </div>
        </section>

        <div className="cart">
          <h4>
            <span>{t.shop_cart} </span>
            <span>{count}</span>
          </h4>
          <div>
            {count === 0
              ? <div className="empty">{t.shop_empty}</div>
              : items.map(([sku, q]) => {
                  const p = OI_DATA.shop.find(x => x.sku === sku)
                  return (
                    <div key={sku} className="item">
                      <span className="item-name">{i18n(p.title)}</span>
                      <span className="item-qty">
                        <button onClick={() => remove(sku)}>−</button>
                        <span>{q}</span>
                        <button onClick={() => add(sku)}>+</button>
                      </span>
                      <span className="item-price">${p.price * q}</span>
                      <button className="item-del" onClick={() => removeAll(sku)} title={t.shop_remove}>×</button>
                    </div>
                  )
                })}
          </div>
          <div className="total">
            <span>{t.shop_total}</span>
            <span>${total}</span>
          </div>
          <button
            className="btn accent"
            style={{ width: '100%', marginTop: 12 }}
            onClick={() => alert(t.shop_checkout_alert)}
          >
            {t.shop_checkout}
          </button>
        </div>

        <div className="s-grid">
          {OI_DATA.shop.map(p => {
            const inCart = cart[p.sku] || 0
            const lowStock = p.stock === 'low' || p.stock === 'last copies'
            return (
              <div key={p.sku} className="prod">
                <Cover id={p.sku} label={p.sku} title={i18n(p.title)} format={i18n(p.format)} />
                <div className="sku">{p.sku}</div>
                <div className="t">{i18n(p.title)}</div>
                <div className="m">{i18n(p.format)}</div>
                <div className="row">
                  <span className="price">${p.price}</span>
                  <span className={`stock ${lowStock ? 'low' : ''}`}>
                    {t.shop_stock[p.stock] || p.stock}
                  </span>
                </div>
                <div style={{ marginTop: 10 }}>
                  {inCart > 0 ? (
                    <div className="prod-qty">
                      <button onClick={() => remove(p.sku)}>−</button>
                      <span className="mono small">{inCart}</span>
                      <button onClick={() => add(p.sku)}>+</button>
                      <button className="prod-del" onClick={() => removeAll(p.sku)} title={t.shop_remove}>×</button>
                    </div>
                  ) : (
                    <button onClick={() => add(p.sku)}>
                      {t.shop_add}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="notice">
          <strong>{t.shop_shipping_h}</strong> · {t.shop_shipping_b}
          <br /><br />
          <strong>{t.shop_returns_h}</strong> · {t.shop_returns_b}
          <br /><br />
          <strong>{t.shop_trade_h}</strong> · {t.shop_trade_b} <Link className="link" to="/contact">{t.shop_trade_link}</Link>.
        </div>

        <Footer />
      </div>
    </div>
  )
}
