export default function GamificationPreview() {
  const badges = [
    {
      emoji: '🎬',
      title: 'Cineza Rookie',
      description: 'Watch your first 5 movies on Cineza.',
    },
    {
      emoji: '👻',
      title: 'Horror Survivor',
      description: 'Finish 10 horror films without hiding.',
    },
    {
      emoji: '🍿',
      title: 'Weekend Binger',
      description: 'Log 3 movies in a single weekend.',
    },
    {
      emoji: '🏆',
      title: '100 Movies Club',
      description: 'Reach 100 watched titles on your profile.',
    },
  ]

  return (
    <section className="section gamification" id="reviews">
      <div className="section__inner">
        <h2 className="section__title">Earn Badges & Level Up</h2>
        <p className="section__subtitle">
          Reviews, watchlists, and streaks earn XP. Unlock badges as you explore
          more films.
        </p>

        <div className="gamification__grid">
          {badges.map((badge) => (
            <article key={badge.title} className="badge-card">
              <span className="badge-card__emoji" aria-hidden="true">
                {badge.emoji}
              </span>
              <h3 className="badge-card__title">{badge.title}</h3>
              <p className="badge-card__desc">{badge.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
