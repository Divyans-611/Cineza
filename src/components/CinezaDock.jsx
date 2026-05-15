export default function CinezaDock() {
  const dockItems = [
    { icon: '🎬', label: 'Movies' },
    { icon: '⭐', label: 'Reviews' },
    { icon: '🤖', label: 'AI Picks' },
    { icon: '🏆', label: 'Badges' },
    { icon: '🍿', label: 'Watchlist' },
    { icon: '👤', label: 'Profile' },
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
            <button
              key={item.label}
              type="button"
              className="dock-item"
              aria-label={item.label}
            >
              <span className="dock-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="dock-item__label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
