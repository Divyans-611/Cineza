import { Link } from 'react-router-dom'

export default function CinezaDock() {
  const dockItems = [
    { icon: '🎬', label: 'Movies', to: '/movies' },
    { icon: '⭐', label: 'Reviews', to: '/reviews' },
    { icon: '🤖', label: 'AI Picks', to: '/ai-picks' },
    { icon: '🏆', label: 'Badges', to: '/profile' },
    { icon: '🍿', label: 'Watchlist', to: '/watchlist' },
    { icon: '👤', label: 'Profile', to: '/profile' },
  ]

  return (
    <section className="section cineza-dock-section" id="watchlist">
      <div className="section__inner cineza-dock">
        <h2 className="cineza-dock__title">
          Your movie world, one dock away.
        </h2>
        <p className="cineza-dock__subtitle">
          Jump into discovery, reviews, AI picks, badges, and your personal
          watchlist.
        </p>

        <div
          className="cineza-dock__bar"
          role="toolbar"
          aria-label="Cineza quick navigation"
        >
          {dockItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="dock-item"
              aria-label={item.label}
            >
              <span className="dock-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="dock-item__label">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
