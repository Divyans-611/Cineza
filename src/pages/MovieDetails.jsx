import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MovieCard from '../components/MovieCard'
import { getMovieById, getSimilarMovies } from '../data/movies'

function getPlaceholderReviews(movie) {
  return [
    {
      id: 1,
      username: 'cinema_scout',
      rating: Math.min(10, movie.rating + 0.2).toFixed(1),
      text: `${movie.title} is visually stunning and stays with you long after the credits. A must-watch for ${movie.genre.toLowerCase()} fans.`,
      date: 'Mar 8, 2024',
    },
    {
      id: 2,
      username: 'reel_reviewer',
      rating: movie.rating,
      text: `Loved the direction by ${movie.director}. The cast delivers strong performances throughout.`,
      date: 'Feb 19, 2024',
    },
    {
      id: 3,
      username: 'framebyframe',
      rating: Math.max(6, movie.rating - 0.5).toFixed(1),
      text: `A solid ${movie.genre} pick. Great pacing and an overview that truly pulls you into the story.`,
      date: 'Jan 30, 2024',
    },
  ]
}

function handleAction() {
  alert('This feature will be available in the next phase.')
}

function MovieNotFound() {
  return (
    <>
      <Navbar />
      <main className="page-shell movie-details movie-details--not-found">
        <div className="page-shell__inner movie-details__inner">
          <article className="movie-details__empty empty-state glass-card">
            <span className="movie-details__empty-icon" aria-hidden="true">
              🎬
            </span>
            <h1 className="movie-details__empty-title">Movie Not Found</h1>
            <p className="movie-details__empty-text">
              This movie seems to have missed its release date.
            </p>
            <Link to="/movies" className="btn btn--primary">
              Back to Movies
            </Link>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function MovieDetails() {
  const { id } = useParams()
  const movie = getMovieById(id)
  const [posterFailed, setPosterFailed] = useState(false)

  if (!movie) {
    return <MovieNotFound />
  }

  const reviews = getPlaceholderReviews(movie)
  const similarMovies = getSimilarMovies(movie.id)

  return (
    <>
      <Navbar />
      <main className="page-shell movie-details">
        <div className="page-shell__inner movie-details__inner">
          <Link to="/movies" className="movie-details__back">
            ← Back to Movies
          </Link>

          <section className="movie-details__hero glass-card">
            <div className="movie-details__poster-wrap">
              {!posterFailed ? (
                <img
                  src={movie.poster}
                  alt={`${movie.title} poster`}
                  className="movie-details__poster"
                  onError={() => setPosterFailed(true)}
                />
              ) : (
                <div className="movie-details__poster-fallback">
                  <span aria-hidden="true">🎬</span>
                  <p>{movie.title}</p>
                  <small>Poster unavailable</small>
                </div>
              )}
            </div>

            <div className="movie-details__info">
              <h1 className="movie-details__title">{movie.title}</h1>

              <div className="movie-details__badges">
                <span className="movie-details__badge movie-details__badge--rating">
                  ★ {movie.rating}
                </span>
                <span className="movie-details__badge">{movie.year}</span>
                <span className="movie-details__badge movie-details__badge--genre">
                  {movie.genre}
                </span>
                <span className="movie-details__badge">{movie.runtime} min</span>
                <span className="movie-details__badge">{movie.language}</span>
              </div>

              <dl className="movie-details__meta">
                <div className="movie-details__meta-row">
                  <dt>Director</dt>
                  <dd>{movie.director}</dd>
                </div>
                <div className="movie-details__meta-row">
                  <dt>Cast</dt>
                  <dd>{movie.cast.join(', ')}</dd>
                </div>
              </dl>

              <p className="movie-details__overview">{movie.overview}</p>

              <div className="movie-details__actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={handleAction}
                >
                  Add to Watchlist
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={handleAction}
                >
                  Write Review
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={handleAction}
                >
                  Get AI Pick
                </button>
              </div>
            </div>
          </section>

          <section className="movie-details__section">
            <h2 className="movie-details__section-title">Trailer Preview</h2>
            <div className="movie-details__trailer glass-card">
              <span className="movie-details__trailer-play" aria-hidden="true">
                ▶
              </span>
              <p className="movie-details__trailer-text">
                Trailer integration coming soon.
              </p>
              <p className="movie-details__trailer-note">
                This will later connect with TMDB videos.
              </p>
            </div>
          </section>

          <section className="movie-details__section">
            <h2 className="movie-details__section-title">Community Reviews</h2>
            <p className="movie-details__section-note">
              Placeholder reviews — real community data coming later.
            </p>
            <div className="movie-details__reviews">
              {reviews.map((review) => (
                <article key={review.id} className="review-card">
                  <div className="review-card__header">
                    <span className="review-card__user">@{review.username}</span>
                    <span className="review-card__rating">★ {review.rating}</span>
                  </div>
                  <p className="review-card__text">{review.text}</p>
                  <time className="review-card__date">{review.date}</time>
                </article>
              ))}
            </div>
          </section>

          {similarMovies.length > 0 && (
            <section className="movie-details__section">
              <h2 className="movie-details__section-title">Similar Movies</h2>
              <div className="movie-details__similar">
                {similarMovies.map((similar) => (
                  <MovieCard key={similar.id} movie={similar} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
