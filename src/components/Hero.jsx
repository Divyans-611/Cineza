export default function Hero() {
  const stats = ['10K+ Movies', 'AI Picks', 'Gamified Reviews']

  return (
    <section className="hero" id="home">
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__content">
        <p className="hero__eyebrow">AI-powered movie discovery</p>
        <h1 className="hero__title">
          &ldquo;Cinema is how we dream with our eyes open&rdquo;
        </h1>
        <p className="hero__subtitle">
          Explore films, build your watchlist, write reviews, earn badges, and
          get AI-powered recommendations.
        </p>

        <div className="hero__actions">
          <button type="button" className="btn btn--primary">
            Explore Movies
          </button>
          <button type="button" className="btn btn--secondary">
            Get AI Picks
          </button>
        </div>

        <div className="hero__stats">
          {stats.map((label) => (
            <article key={label} className="hero__stat-card">
              <span className="hero__stat-label">{label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
