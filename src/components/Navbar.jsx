import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFirstName, getInitials } from '../utils/authUtils';
import GlobalSearch from './GlobalSearch';

const navLinks = [
  { label: 'Home', to: '/', icon: '🏠' },
  { label: 'Movies', to: '/movies', icon: '🎬' },
  { label: 'AI Picks', to: '/ai-picks', icon: '✨' },
  { label: 'Watchlist', to: '/watchlist', icon: '📂' },
  { label: 'Reviews', to: '/reviews', icon: '📝' },
];

function navLinkClass({ isActive }) {
  return isActive ? 'is-active' : undefined;
}

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Close dropdown on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen for Cmd+K custom event from GlobalSearch
  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener('cineza:open-search', handleOpenSearch);
    return () => window.removeEventListener('cineza:open-search', handleOpenSearch);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Close mobile menu on navigation
  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="navbar">
        <nav className="navbar__inner">
          {/* Hamburger button — mobile only */}
          <button
            className="navbar__hamburger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`navbar__hamburger-line ${isMobileMenuOpen ? 'navbar__hamburger-line--open' : ''}`} />
            <span className={`navbar__hamburger-line ${isMobileMenuOpen ? 'navbar__hamburger-line--open' : ''}`} />
            <span className={`navbar__hamburger-line ${isMobileMenuOpen ? 'navbar__hamburger-line--open' : ''}`} />
          </button>

          <Link to="/" className="navbar__logo">
            Cineza
          </Link>

          {/* Desktop nav links */}
          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavLink to={link.to} end={link.to === '/'} className={navLinkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="navbar__actions">
            {/* Search trigger */}
            <button
              className="global-search-trigger"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open global search"
            >
              <svg className="search-trigger-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="search-trigger-label">Search</span>
              <kbd className="shortcut-key">⌘K</kbd>
            </button>

            {/* Auth section */}
            {loading ? (
              <div className="navbar__loading">
                <span className="navbar__spinner" />
              </div>
            ) : isAuthenticated ? (
              <div className="navbar__user" ref={dropdownRef}>
                <button
                  className="navbar__avatar-btn"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="navbar__avatar-img"
                    />
                  ) : (
                    <div className="navbar__avatar-fallback">
                      {getInitials(user?.name)}
                    </div>
                  )}
                  <span className="navbar__user-name">
                    {getFirstName(user?.name)}
                  </span>
                  <svg className="navbar__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="navbar__dropdown">
                    <div className="navbar__dropdown-header">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="navbar__dropdown-avatar" />
                      ) : (
                        <div className="navbar__dropdown-avatar navbar__dropdown-avatar--fallback">
                          {getInitials(user?.name)}
                        </div>
                      )}
                      <div className="navbar__dropdown-info">
                        <span className="navbar__dropdown-name">{user?.name}</span>
                        <span className="navbar__dropdown-email">{user?.email}</span>
                      </div>
                    </div>
                    <div className="navbar__dropdown-divider" />
                    <Link to="/profile" className="navbar__dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      Profile
                    </Link>
                    <Link to="/watchlist" className="navbar__dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                      Watchlist
                    </Link>
                    <Link to="/reviews" className="navbar__dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      My Reviews
                    </Link>
                    <div className="navbar__dropdown-divider" />
                    <button className="navbar__dropdown-item navbar__dropdown-item--logout" onClick={handleLogout}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn--primary navbar__login">
                Login
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile slide-out menu */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'mobile-menu-overlay--open' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />
      <aside className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu--open' : ''}`} ref={mobileMenuRef} aria-label="Mobile navigation">
        <div className="mobile-menu__header">
          <span className="mobile-menu__brand">Cineza</span>
          <button className="mobile-menu__close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="mobile-menu__nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === '/'}
              className={navLinkClass}
              onClick={handleMobileNavClick}
            >
              <span className="mobile-menu__icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {isAuthenticated && user ? (
          <div className="mobile-menu__user">
            <div className="mobile-menu__user-info">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="mobile-menu__avatar" />
              ) : (
                <div className="mobile-menu__avatar mobile-menu__avatar--fallback">
                  {getInitials(user.name)}
                </div>
              )}
              <div>
                <span className="mobile-menu__user-name">{user.name}</span>
                <span className="mobile-menu__user-email">{user.email}</span>
              </div>
            </div>
            <button className="btn btn--secondary mobile-menu__logout" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        ) : (
          <div className="mobile-menu__auth">
            <Link to="/login" className="btn btn--primary" onClick={handleMobileNavClick}>Login</Link>
            <Link to="/signup" className="btn btn--secondary" onClick={handleMobileNavClick}>Sign Up</Link>
          </div>
        )}
      </aside>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
