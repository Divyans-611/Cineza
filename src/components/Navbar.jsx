import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFirstName, getInitials } from '../utils/authUtils';
import GlobalSearch from './GlobalSearch';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Movies', to: '/movies' },
  { label: 'AI Picks', to: '/ai-picks' },
  { label: 'Watchlist', to: '/watchlist' },
  { label: 'Reviews', to: '/reviews' },
];

function navLinkClass({ isActive }) {
  return isActive ? 'is-active' : undefined;
}

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

            {loading ? (
              <div style={{ width: '120px', display: 'flex', justifyContent: 'flex-end', paddingRight: '0.5rem' }}>
                <span className="spinning-loader" style={{ animation: 'spin 1.5s linear infinite', fontSize: '1.1rem' }}>⏳</span>
              </div>
            ) : isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Link 
                  to="/profile" 
                  className="navbar__profile-link" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    color: 'var(--color-gold)', 
                    fontWeight: '600', 
                    fontSize: '0.9rem',
                    textDecoration: 'none'
                  }}
                >
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '50%', 
                        objectFit: 'cover',
                        border: '1.5px solid var(--color-gold)'
                      }} 
                    />
                  ) : (
                    <div 
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '50%', 
                        background: 'rgba(245, 197, 24, 0.15)',
                        border: '1.5px solid var(--color-gold)',
                        color: 'var(--color-gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}
                    >
                      {getInitials(user?.name)}
                    </div>
                  )}
                  <span className="navbar__user-name" style={{ letterSpacing: '0.015em' }}>
                    {getFirstName(user?.name)}
                  </span>
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
  );
}
