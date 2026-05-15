export default function Navbar() {
  const links = ['Home', 'Movies', 'AI Picks', 'Watchlist', 'Reviews']

  return (
    <header className="navbar">
      <nav className="navbar__inner">
        <a href="#home" className="navbar__logo">
          Cineza
        </a>

        <ul className="navbar__links">
          {links.map((link) => (
            <li key={link}>
              <a href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}>
                {link}
              </a>
            </li>
          ))}
        </ul>

        <button type="button" className="btn btn--outline navbar__login">
          Login
        </button>
      </nav>
    </header>
  )
}
