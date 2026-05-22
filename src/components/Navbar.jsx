import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
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
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

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

          <div className="navbar__actions" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginLeft: 'auto' }}>
            <button 
              className="global-search-trigger" 
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open global search"
            >
              <span aria-hidden="true">🔍</span> <span className="shortcut-key">⌘K </span>Search
            </button>

            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Link to="/profile" className="navbar__profile-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold)', fontWeight: '600', fontSize: '0.9rem' }}>
                  <span>👤</span>
                  <span className="navbar__user-name">{user?.name?.split(' ')[0] || 'Profile'}</span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="btn btn--secondary" 
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn--primary navbar__login primary-btn" style={{ marginLeft: 0 }}>
                Login
              </Link>
            )}
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

