import { Link } from 'react-router-dom'

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'Movies', to: '/movies' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'Watchlist', to: '/watchlist' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <p className="footer__name">Cineza</p>
          <p className="footer__tagline">
            &ldquo;Cinema is how we dream with our eyes open&rdquo;
          </p>
        </div>

        <ul className="footer__links">
          {footerLinks.map((link) => (
            <li key={link.label}>
              <Link to={link.to}>{link.label}</Link>
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
