import { useState } from 'react'
import { useTweaks } from '../context/TweaksContext.jsx'

const ACCENTS = [
  { key: 'red',    color: 'oklch(0.55 0.22 25)' },
  { key: 'cyan',   color: 'oklch(0.68 0.14 210)' },
  { key: 'lime',   color: 'oklch(0.78 0.17 125)' },
  { key: 'violet', color: 'oklch(0.55 0.22 310)' },
  { key: 'ink',    color: 'var(--ink)' },
]

export default function TweaksPanel() {
  const { tweaks, setTweak, t } = useTweaks()
  const [open, setOpen] = useState(false)

  const fontpairs = [
    { key: 'serif-mono', label: t.tw_pair_serif_mono },
    { key: 'serif-sans', label: t.tw_pair_serif_sans },
    { key: 'sans-only',  label: t.tw_pair_sans },
    { key: 'mono',       label: t.tw_pair_mono },
  ]
  const layouts = [
    { key: 'force',  label: t.tw_layout_force },
    { key: 'radial', label: t.tw_layout_radial },
    { key: 'grid',   label: t.tw_layout_grid },
  ]

  return (
    <>
      <button
        className={`tweaks-toggle ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={t.tw_h}
        title={t.tw_h}
      >
        ⌘
      </button>
      <div className={`tweaks-panel ${open ? 'on' : ''}`}>
        <h4>
          {t.tw_h}
          <span className="dim" style={{ textTransform: 'none', letterSpacing: 0 }}>
            {t.tw_sub}
          </span>
        </h4>

        <div className="tweaks-row">
          <label>{t.tw_lang}</label>
          <div className="opts">
            <button
              className={`opt ${tweaks.lang === 'fr' ? 'active' : ''}`}
              onClick={() => setTweak('lang', 'fr')}
            >
              Français
            </button>
            <button
              className={`opt ${tweaks.lang === 'en' ? 'active' : ''}`}
              onClick={() => setTweak('lang', 'en')}
            >
              English
            </button>
          </div>
        </div>

        <div className="tweaks-row">
          <label>{t.tw_theme}</label>
          <div className="opts">
            <button
              className={`opt ${tweaks.theme === 'light' ? 'active' : ''}`}
              onClick={() => setTweak('theme', 'light')}
            >
              {t.tw_light}
            </button>
            <button
              className={`opt ${tweaks.theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTweak('theme', 'dark')}
            >
              {t.tw_dark}
            </button>
          </div>
        </div>

        <div className="tweaks-row">
          <label>{t.tw_accent}</label>
          <div className="swatches">
            {ACCENTS.map(a => (
              <span
                key={a.key}
                className={`sw ${tweaks.accent === a.key ? 'active' : ''}`}
                style={{ background: a.color }}
                onClick={() => setTweak('accent', a.key)}
                title={a.key}
              />
            ))}
          </div>
        </div>

        <div className="tweaks-row">
          <label>{t.tw_fonts}</label>
          <div className="opts">
            {fontpairs.map(f => (
              <button
                key={f.key}
                className={`opt ${tweaks.fontpair === f.key ? 'active' : ''}`}
                onClick={() => setTweak('fontpair', f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="tweaks-row">
          <label>{t.tw_glitch}</label>
          <div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={tweaks.glitch}
              onChange={e => setTweak('glitch', parseFloat(e.target.value))}
            />
            <div className="tiny dim">{Math.round(tweaks.glitch * 100)}%</div>
          </div>
        </div>

        <div className="tweaks-row">
          <label>{t.tw_graph}</label>
          <div className="opts">
            {layouts.map(l => (
              <button
                key={l.key}
                className={`opt ${tweaks.graphLayout === l.key ? 'active' : ''}`}
                onClick={() => setTweak('graphLayout', l.key)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
