import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function MovieCard({ movie }) {
  const [posterFailed, setPosterFailed] = useState(false)

  return (
    <Link to={`/movies/${movie.id}`} className="movie-card">
      <div className="movie-card__poster-wrap">
        {!posterFailed ? (
          <>
            <img
              src={movie.poster}
              alt={`${movie.title} poster`}
              className="movie-card__poster"
              loading="lazy"
              onError={() => setPosterFailed(true)}
            />
            <span className="movie-card__gradient" aria-hidden="true" />
          </>
        ) : (
          <div className="movie-card__fallback" aria-label={`${movie.title} poster unavailable`}>
            <span className="movie-card__fallback-icon" aria-hidden="true">
              🎬
            </span>
            <p className="movie-card__fallback-title">{movie.title}</p>
            <p className="movie-card__fallback-text">Poster unavailable</p>
          </div>
        )}

        <span className="movie-card__rating">★ {movie.rating}</span>

        <span className="movie-card__overlay">
          <span className="movie-card__cta">View Details →</span>
        </span>
      </div>

      <div className="movie-card__body">
        <h3 className="movie-card__title">{movie.title}</h3>
        <p className="movie-card__meta">
          <span>{movie.year}</span>
          <span className="movie-card__dot">·</span>
          <span>{movie.genre}</span>
        </p>
        <p className="movie-card__rating-text">★ {movie.rating}</p>
        <span className="movie-card__hint">View Details</span>
      </div>
    </Link>
  )
}
