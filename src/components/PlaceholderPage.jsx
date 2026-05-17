import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function PlaceholderPage({ title, subtitle, children }) {
  return (
    <>
      <Navbar />
      <main className="page">
        <div className="page__inner">
          <article className="page__card">
            <h1 className="page__title">{title}</h1>
            <p className="page__subtitle">{subtitle}</p>
            {children}
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}

export function BackHomeButton() {
  return (
    <Link to="/" className="btn btn--primary page__action">
      Back to Home
    </Link>
  )
}
