import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function PlaceholderPage({
  title,
  subtitle,
  icon = '🎬',
  features = [],
  showTagline = false,
  phaseNote = 'This feature will be connected in a later phase.',
  primaryLabel = 'Explore Movies',
  primaryTo = '/movies',
  secondaryLabel = 'Back to Home',
  secondaryTo = '/',
  children,
}) {
  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="page-shell__inner">
          <header className="section-header">
            <span className="section-header__icon" aria-hidden="true">
              {icon}
            </span>
            <h1 className="section-header__title">{title}</h1>
            <p className="section-header__subtitle">{subtitle}</p>
          </header>

          {features.length > 0 && (
            <div className="glass-card coming-soon__preview">
              <p className="coming-soon__preview-label">Feature preview</p>
              <ul className="coming-soon__features">
                {features.map((feature) => (
                  <li key={feature} className="coming-soon__feature">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showTagline && (
            <blockquote className="coming-soon__quote">
              &ldquo;Cinema is how we dream with our eyes open&rdquo;
            </blockquote>
          )}

          <p className="coming-soon__note">{phaseNote}</p>

          <div className="coming-soon__actions">
            <Link to={primaryTo} className="btn btn--primary primary-btn">
              {primaryLabel}
            </Link>
            <Link to={secondaryTo} className="btn btn--secondary secondary-btn">
              {secondaryLabel}
            </Link>
          </div>

          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}

export function BackHomeButton() {
  return (
    <Link to="/" className="btn btn--primary primary-btn coming-soon__solo-btn">
      Back to Home
    </Link>
  )
}
