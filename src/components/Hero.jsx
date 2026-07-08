// src/components/Hero.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTrendingMovies } from '../services/movieService'
import { normalizeTMDBMovie } from '../utils/movieUtils'
import { movies as dummyMovies } from '../data/movies'

export default function Hero() {
  const [movie, setMovie] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchHeroMovie = async () => {
      try {
        const data = await getTrendingMovies()
        if (data.results && data.results.length > 0) {
          if (isMounted) {
            // Select the highest-rated or first trending movie
            setMovie(normalizeTMDBMovie(data.results[0]))
          }
        } else {
          throw new Error('Empty results')
        }
      } catch (err) {
        console.error('Hero backdrop load failed, using fallback:', err)
        if (isMounted) {
          // Fallback to Inception or first dummy movie
          const fallback = dummyMovies && dummyMovies.length > 0 ? dummyMovies[0] : null
          setMovie(fallback)
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchHeroMovie()
    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <section className="hero hero--skeleton">
        <div className="hero__glow" aria-hidden="true" />
        <div className="hero__content hero__content--skeleton">
          <div className="skeleton-pulse skeleton-pulse--eyebrow" />
          <div className="skeleton-pulse skeleton-pulse--hero-title" />
          <div className="skeleton-pulse skeleton-pulse--hero-subtitle" />
          <div className="skeleton-pulse skeleton-pulse--hero-actions" />
        </div>
      </section>
    )
  }

  // If no movie is available even from fallback, use basic static placeholder
  const activeMovie = movie || {
    id: 'explore',
    title: 'Discover the World of Cinema',
    year: '2026',
    genre: 'Cinema',
    rating: '9.9',
    overview: 'Explore films, build your watchlist, write reviews, earn badges, and get AI-powered recommendations.',
    backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925'
  }

  const backdropUrl = activeMovie.backdrop || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925';

  const heroStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(11, 15, 25, 0.4) 0%, rgba(11, 15, 25, 0.8) 70%, rgba(11, 15, 25, 1) 100%), url(${backdropUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center 20%',
  }

  return (
    <section className="hero hero--cinematic" style={heroStyle}>
      <div className="hero__content hero__content--cinematic">
        <div className="hero__badge-container">
          <span className="hero__eyebrow-badge">Trending Weekly</span>
          {activeMovie.rating && activeMovie.rating !== 'N/A' && (
            <span className="hero__rating-badge">★ {activeMovie.rating}</span>
          )}
        </div>

        <h1 className="hero__title hero__title--cinematic">
          {activeMovie.title}
        </h1>

        <div className="hero__meta">
          <span>{activeMovie.year}</span>
          <span className="hero__meta-dot">•</span>
          <span>{activeMovie.genre}</span>
          {activeMovie.language && (
            <>
              <span className="hero__meta-dot">•</span>
              <span className="hero__lang">{activeMovie.language}</span>
            </>
          )}
        </div>

        <p className="hero__subtitle hero__subtitle--cinematic">
          {activeMovie.overview}
        </p>

        <div className="hero__actions hero__actions--cinematic">
          {activeMovie.id !== 'explore' ? (
            <Link to={`/movies/${activeMovie.id}`} className="btn btn--primary btn--hero-play">
              <span className="btn-icon">🎬</span> View Details
            </Link>
          ) : (
            <Link to="/movies" className="btn btn--primary btn--hero-play">
              Explore Movies
            </Link>
          )}
          <Link to="/ai-picks" className="btn btn--secondary btn--hero-info">
            <span className="btn-icon">🤖</span> Try AI Picks
          </Link>
        </div>
      </div>
    </section>
  )
}
