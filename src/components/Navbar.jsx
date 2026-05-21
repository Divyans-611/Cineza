import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import GlobalSearch from './GlobalSearch'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Movies', to: '/movies' },
  { label: 'AI Picks', to: '/ai-picks' },
  { label: 'Watchlist', to: '/watchlist' },
  { label: 'Reviews', to: '/reviews' },
]

function navLinkClass({ isActive }) {
  return isActive ? 'is-active' : undefined
}

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="navbar">
        <nav className="navbar__inner">
          <Link to="/" className="navbar__logo">
            Cineza
          </Link>

          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavLink to={link.to} end={link.to === '/'} className={navLinkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="navbar__actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
            <button 
              className="global-search-trigger" 
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open global search"
            >
              <span aria-hidden="true">🔍</span> <span className="shortcut-key">⌘K </span>Search
            </button>

            <Link to="/login" className="btn btn--primary navbar__login primary-btn" style={{ marginLeft: 0 }}>
              Login
            </Link>
          </div>
        </nav>

        <ul className="navbar__links navbar__links--mobile" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <li key={`mobile-${link.label}`}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={navLinkClass}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </header>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

