export default function HeroTitle({ lang }) {
  if (lang === 'en') {
    return (
      <>
        <span className="glitch-h" data-text="A listening">A listening</span>
        <br />
        post for <span className="redact">&nbsp;unresolved&nbsp;</span>
        <br />
        <em>signals.</em>
      </>
    )
  }
  return (
    <>
      <span className="glitch-h" data-text="Un poste">Un poste</span>
      <br />
      d'écoute
      <br />
      pour signaux<span className="redact">&nbsp;non résolus&nbsp;</span>.
    </>
  )
}
