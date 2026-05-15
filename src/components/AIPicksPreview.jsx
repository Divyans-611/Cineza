export default function AIPicksPreview() {
  const moods = ['Emotional', 'Dark Thriller', 'Feel Good', 'Weekend Binge']

  return (
    <section className="section ai-picks" id="ai-picks">
      <div className="section__inner">
        <div className="ai-picks__card">
          <h2 className="section__title">AI Picks</h2>
          <p className="section__subtitle ai-picks__text">
            Tell Cineza how you feel and get mood-based movie recommendations
            powered by AI. Perfect when you know the vibe but not the title.
          </p>

          <div className="ai-picks__chips">
            {moods.map((mood) => (
              <button key={mood} type="button" className="chip">
                {mood}
              </button>
            ))}
          </div>

          <button type="button" className="btn btn--primary">
            Try AI Picks
          </button>
        </div>
      </div>
    </section>
  )
}
