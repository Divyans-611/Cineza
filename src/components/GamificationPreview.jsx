import { Film, Ghost, Popcorn, Trophy } from 'lucide-react'

export default function GamificationPreview() {
  const badges = [
    {
      id: 'rookie',
      icon: <Film size={32} color="var(--color-primary)" />,
      title: 'Cineza Rookie',
      description: 'Watch your first 5 movies on Cineza.',
    },
    {
      id: 'survivor',
      icon: <Ghost size={32} color="var(--color-primary)" />,
      title: 'Horror Survivor',
      description: 'Finish 10 horror films without hiding.',
    },
    {
      id: 'binger',
      icon: <Popcorn size={32} color="var(--color-primary)" />,
      title: 'Weekend Binger',
      description: 'Log 3 movies in a single weekend.',
    },
    {
      id: 'club',
      icon: <Trophy size={32} color="var(--color-primary)" />,
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
            <article key={badge.id} className="badge-card">
              <div className="badge-card__icon" aria-hidden="true">
                {badge.icon}
              </div>
              <h3 className="badge-card__title">{badge.title}</h3>
              <p className="badge-card__desc">{badge.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
