import { useState } from 'react'
import Nav from '../components/Nav.jsx'
import CoordBar from '../components/CoordBar.jsx'
import Footer from '../components/Footer.jsx'
import Cover from '../components/Cover.jsx'
import { Link } from 'react-router-dom'
import { OI_DATA } from '../data/oi.js'
import { useTweaks } from '../context/TweaksContext.jsx'

export default function Shop() {
  const { tweaks, t, i18n } = useTweaks()
  const FR = tweaks.lang === 'fr'
  const [cart, setCart] = useState({})

  const STOCK_LABEL = FR
    ? { 'in stock': 'en stock', 'low': 'faible', 'last copies': 'dernières copies', 'pre-order': 'précommande', 'open': 'ouvert', 'sold out': 'épuisé' }
    : { 'in stock': 'in stock', 'low': 'low', 'last copies': 'last copies', 'pre-order': 'pre-order', 'open': 'open', 'sold out': 'sold out' }

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
          catalog={`${OI_DATA.shop.length} ${FR ? 'articles' : 'items'}`}
        />

        <section className="s-head">
          <div>
            <div className="mono small upper dim" style={{ marginBottom: 12 }}>
              {t.shop_kicker}
            </div>
            <h1>
              <em
                dangerouslySetInnerHTML={{
                  __html: FR
                    ? 'Éditions physiques,<br>direct du label.'
                    : 'Physical editions,<br>direct from the label.',
                }}
              />
            </h1>
          </div>
          <div className="mono small dim" style={{ lineHeight: 1.7, borderLeft: '1px solid var(--rule)', paddingLeft: 16 }}>
            {FR
              ? "Pas d'intermédiaires. Expédié de Montréal tous les vendredis. Taxes canadiennes incluses. Frais internationaux calculés au paiement."
              : 'No middlemen. Shipped from Montréal every Friday. Canadian taxes included. International shipping calculated at checkout.'}
          </div>
        </section>

        <div className="cart">
          <h4>
            <span>{FR ? 'Panier ' : 'Basket '}</span>
            <span>{count}</span>
          </h4>
          <div>
            {count === 0
              ? <div className="empty">{FR ? 'vide' : 'empty'}</div>
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
                      <button className="item-del" onClick={() => removeAll(sku)} title={FR ? 'Retirer' : 'Remove'}>×</button>
                    </div>
                  )
                })}
          </div>
          <div className="total">
            <span>{FR ? 'total' : 'total'}</span>
            <span>${total}</span>
          </div>
          <button
            className="btn accent"
            style={{ width: '100%', marginTop: 12 }}
            onClick={() => alert(FR ? 'Paiement : placeholder dans cette maquette.' : 'Checkout is a placeholder in this mockup.')}
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
                <Cover id={p.sku} label={p.sku} />
                <div className="sku">{p.sku}</div>
                <div className="t">{i18n(p.title)}</div>
                <div className="m">{i18n(p.format)}</div>
                <div className="row">
                  <span className="price">${p.price}</span>
                  <span className={`stock ${lowStock ? 'low' : ''}`}>
                    {STOCK_LABEL[p.stock] || p.stock}
                  </span>
                </div>
                <div style={{ marginTop: 10 }}>
                  {inCart > 0 ? (
                    <div className="prod-qty">
                      <button onClick={() => remove(p.sku)}>−</button>
                      <span className="mono small">{inCart}</span>
                      <button onClick={() => add(p.sku)}>+</button>
                      <button className="prod-del" onClick={() => removeAll(p.sku)} title={FR ? 'Retirer' : 'Remove'}>×</button>
                    </div>
                  ) : (
                    <button onClick={() => add(p.sku)}>
                      {FR ? '+ au panier' : '+ add to basket'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="notice">
          {FR ? (
            <>
              <strong>Expédition</strong> · Canada 8$ · États-Unis 14$ · International 24$. Vinyles emballés en boîtes-mailer avec renforts. Cassettes en enveloppes matelassées. Les précommandes partent dès l'arrivée des copies du pressage.
              <br /><br />
              <strong>Retours</strong> · Articles défectueux seulement. Gardez l'emballage jusqu'à la première écoute.
              <br /><br />
              <strong>Revente</strong> · Nous fournissons les disquaires indépendants en dépôt. Écrire à <Link className="link" to="/contact">revente@</Link>.
            </>
          ) : (
            <>
              <strong>Shipping</strong> · Canada $8 · US $14 · World $24. Vinyl packed in mailer-boxes with stiffeners. Cassettes ship in padded envelopes. Pre-orders are shipped as soon as stock arrives from the pressing plant.
              <br /><br />
              <strong>Returns</strong> · Faulty items only. Please keep the packaging until you have played the record through once.
              <br /><br />
              <strong>Wholesale</strong> · We supply independent record shops on consignment. Write to <Link className="link" to="/contact">trade@</Link>.
            </>
          )}
        </div>

        <Footer />
      </div>
    </div>
  )
}
