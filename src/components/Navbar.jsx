import { Link, NavLink } from 'react-router-dom'

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
  return (
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

        <Link to="/login" className="btn btn--primary navbar__login primary-btn">
          Login
        </Link>
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
  )
}
