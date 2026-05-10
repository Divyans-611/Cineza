export default function HomePage() {
  return (
    <main className="home">
      <header className="home__hero">
        <p className="home__badge">AI-powered discovery</p>
        <h1 className="home__title">
          Welcome to <span className="home__brand">Cineza</span>
        </h1>
        <p className="home__muted">
          Gamified movie discovery — coming soon.
        </p>
        <button type="button" className="home__cta">
          Start exploring
        </button>
      </header>

      <section className="home__card" aria-label="Preview">
        <h2 className="home__card-title">Tonight&apos;s vibe</h2>
        <p className="home__muted">
          Personalized picks, challenges, and rewards will show up here.
        </p>
      </section>
    </main>
  )
}
