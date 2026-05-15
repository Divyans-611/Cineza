export default function Hero() {
  const stats = [
    { label: '10K+ Movies', value: 'Explore' },
    { label: 'AI Picks', value: 'Smart' },
    { label: 'Gamified Reviews', value: 'Earn XP' },
  ]

  return (
    <section className="hero" id="home">
      <div className="hero__content">
        <h1 className="hero__title">
          Discover Movies That Match Your Mood
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
          {stats.map((stat) => (
            <article key={stat.label} className="hero__stat-card">
              <span className="hero__stat-value">{stat.value}</span>
              <span className="hero__stat-label">{stat.label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
