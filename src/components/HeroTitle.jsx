import { useTweaks } from '../context/TweaksContext.jsx'

export default function HeroTitle() {
  const { t } = useTweaks()
  return (
    <>
      <span className="glitch-h" data-text={t.hero_line1}>{t.hero_line1}</span>
      <br />
      {t.hero_line2}
      <br />
      <em>{t.hero_line3}</em>
    </>
  )
}
