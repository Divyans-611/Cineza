import { Link } from 'react-router-dom'
import { Film, MessageSquare, Sparkles, Award, FolderHeart, User } from 'lucide-react'

export default function CinezaDock() {
  const dockItems = [
    { icon: <Film size={24} />, label: 'Movies', to: '/movies' },
    { icon: <MessageSquare size={24} />, label: 'Reviews', to: '/reviews' },
    { icon: <Sparkles size={24} />, label: 'AI Picks', to: '/ai-picks' },
    { icon: <Award size={24} />, label: 'Badges', to: '/profile' },
    { icon: <FolderHeart size={24} />, label: 'Watchlist', to: '/watchlist' },
    { icon: <User size={24} />, label: 'Profile', to: '/profile' },
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
