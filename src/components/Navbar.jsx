import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFirstName, getInitials } from '../utils/authUtils';
import GlobalSearch from './GlobalSearch';
import { Home, Film, Sparkles, Folder, PenBox, Search, ChevronDown, User, LogOut, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/', icon: <Home size={18} /> },
  { label: 'Movies', to: '/movies', icon: <Film size={18} /> },
  { label: 'AI Picks', to: '/ai-picks', icon: <Sparkles size={18} /> },
  { label: 'Watchlist', to: '/watchlist', icon: <Folder size={18} /> },
  { label: 'Reviews', to: '/reviews', icon: <PenBox size={18} /> },
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
              <Search className="search-trigger-icon" size={16} strokeWidth={2.5} />
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
                  <ChevronDown 
                    className="navbar__chevron" 
                    size={16} 
                    strokeWidth={2.5} 
                    style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} 
                  />
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
                      <User size={16} />
                      Profile
                    </Link>
                    <Link to="/watchlist" className="navbar__dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                      <Folder size={16} />
                      Watchlist
                    </Link>
                    <Link to="/reviews" className="navbar__dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                      <PenBox size={16} />
                      My Reviews
                    </Link>
                    <div className="navbar__dropdown-divider" />
                    <button className="navbar__dropdown-item navbar__dropdown-item--logout" onClick={handleLogout}>
                      <LogOut size={16} />
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
            <X size={24} strokeWidth={2.5} />
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
              <LogOut size={16} />
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
