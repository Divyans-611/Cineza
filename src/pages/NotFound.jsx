import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="page-shell__inner">
          <article className="empty-state glass-card">
            <span className="empty-state__icon" aria-hidden="true">
              🎬
            </span>
            <h1 className="empty-state__title">404 — Scene Not Found</h1>
            <p className="empty-state__text">
              This page seems to have missed its release date.
            </p>
            <blockquote className="coming-soon__quote coming-soon__quote--compact">
              &ldquo;Cinema is how we dream with our eyes open&rdquo;
            </blockquote>
            <div className="coming-soon__actions">
              <Link to="/" className="btn btn--primary primary-btn">
                Back to Home
              </Link>
              <Link to="/movies" className="btn btn--secondary secondary-btn">
                Explore Movies
              </Link>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}
