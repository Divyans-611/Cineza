export default function Footer() {
  const links = ['About', 'Movies', 'Reviews', 'Watchlist']

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <p className="footer__name">Cineza</p>
          <p className="footer__tagline">
            Discover movies that match your mood.
          </p>
        </div>

        <ul className="footer__links">
          {links.map((link) => (
            <li key={link}>
              <a href={`#${link.toLowerCase()}`}>{link}</a>
            </li>
          ))}
        </ul>

        <p className="footer__copy">
          © {new Date().getFullYear()} Cineza. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
