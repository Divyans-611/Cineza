// src/components/MovieCard.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function MovieCard({ movie }) {
  const [posterFailed, setPosterFailed] = useState(false)

  return (
    <Link to={`/movies/${movie.id}`} className="movie-card-v2">
      <div className="movie-card-v2__poster-wrap">
        {!posterFailed && movie.poster ? (
          <>
            <img
              src={movie.poster}
              alt={`${movie.title} poster`}
              className="movie-card-v2__poster"
              loading="lazy"
              onError={() => setPosterFailed(true)}
            />
            <span className="movie-card-v2__gradient" aria-hidden="true" />
          </>
        ) : (
          <div className="movie-card-v2__fallback" aria-label={`${movie.title} poster unavailable`}>
            <span className="movie-card-v2__fallback-icon" aria-hidden="true">🎬</span>
            <p className="movie-card-v2__fallback-title">{movie.title}</p>
            <p className="movie-card-v2__fallback-text">Poster unavailable</p>
          </div>
        )}

        {movie.rating && movie.rating !== 'N/A' && (
          <span className="movie-card-v2__rating-badge">★ {movie.rating}</span>
        )}

        <div className="movie-card-v2__overlay">
          <span className="movie-card-v2__cta">Details</span>
        </div>
      </div>

      <div className="movie-card-v2__body">
        <h3 className="movie-card-v2__title">{movie.title}</h3>
        <div className="movie-card-v2__meta">
          <span className="movie-card-v2__year">{movie.year || 'N/A'}</span>
          <span className="movie-card-v2__dot">•</span>
          <span className="movie-card-v2__genre">{movie.genre || 'Movie'}</span>
        </div>
      </div>
    </Link>
  )
}
