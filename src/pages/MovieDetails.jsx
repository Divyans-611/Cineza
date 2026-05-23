import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MovieCard from '../components/MovieCard'
import { getMovieById as getDummyMovieById, getSimilarMovies } from '../data/movies'
import { getMovieDetails, getMovieCredits, getMovieVideos } from '../services/movieService'
import { normalizeTMDBDetails } from '../utils/movieUtils'
import { useAuth } from '../context/AuthContext'
import { addToWatchlist, removeFromWatchlist, checkWatchlist } from '../services/watchlistService'

function getPlaceholderReviews(movie) {
  return [
    {
      id: 1,
      username: 'cinema_scout',
      rating: Math.min(10, movie.rating && movie.rating !== 'N/A' ? parseFloat(movie.rating) + 0.2 : 9).toFixed(1),
      text: `${movie.title} is visually stunning and stays with you long after the credits. A must-watch for ${movie.genre ? movie.genre.toLowerCase() : 'movie'} fans.`,
      date: 'Mar 8, 2024',
    },
    {
      id: 2,
      username: 'reel_reviewer',
      rating: movie.rating && movie.rating !== 'N/A' ? movie.rating : '8.5',
      text: `Loved the direction by ${movie.director}. The cast delivers strong performances throughout.`,
      date: 'Feb 19, 2024',
    },
    {
      id: 3,
      username: 'framebyframe',
      rating: Math.max(6, movie.rating && movie.rating !== 'N/A' ? parseFloat(movie.rating) - 0.5 : 7).toFixed(1),
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
  const navigate = useNavigate()
  const { isAuthenticated, token } = useAuth()

  const [movie, setMovie] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [posterFailed, setPosterFailed] = useState(false)

  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [watchlistLoading, setWatchlistLoading] = useState(false)
  const [watchlistMessage, setWatchlistMessage] = useState(null)

  // Clear message after 3 seconds
  useEffect(() => {
    if (watchlistMessage) {
      const timer = setTimeout(() => setWatchlistMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [watchlistMessage])

  // Check watchlist status when movie loads
  useEffect(() => {
    const checkStatus = async () => {
      if (isAuthenticated && token && movie?.id) {
        try {
          const res = await checkWatchlist(movie.id, token)
          setIsInWatchlist(res.inWatchlist)
        } catch (err) {
          console.error('Failed to check watchlist status:', err)
        }
      }
    }
    checkStatus()
  }, [isAuthenticated, token, movie])

  // Toggle watchlist logic
  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setWatchlistLoading(true)
    setWatchlistMessage(null)

    try {
      if (isInWatchlist) {
        await removeFromWatchlist(movie.id, token)
        setIsInWatchlist(false)
        setWatchlistMessage({ type: 'success', text: 'Removed from watchlist' })
      } else {
        // Format genres
        let formattedGenres = []
        if (Array.isArray(movie.genre)) {
          formattedGenres = movie.genre
        } else if (typeof movie.genre === 'string') {
          formattedGenres = movie.genre.split(',').map(g => g.trim())
        } else if (movie.genres && Array.isArray(movie.genres)) {
          formattedGenres = movie.genres.map(g => g.name || g)
        }

        const movieData = {
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path || movie.posterPath || movie.poster || '',
          backdropPath: movie.backdrop_path || movie.backdropPath || movie.backdrop || '',
          releaseDate: movie.release_date || movie.releaseDate || movie.year || '',
          rating: movie.vote_average || movie.rating || 0,
          overview: movie.overview || '',
          genres: formattedGenres,
        }

        await addToWatchlist(movieData, token)
        setIsInWatchlist(true)
        setWatchlistMessage({ type: 'success', text: 'Added to watchlist' })
      }
    } catch (err) {
      setWatchlistMessage({ type: 'error', text: err.message || 'Operation failed' })
    } finally {
      setWatchlistLoading(false)
    }
  }

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const [details, credits, videos] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
          getMovieVideos(id)
        ])
        
        const normalized = normalizeTMDBDetails(details, credits, videos)
        setMovie(normalized)
        
      } catch (err) {
        console.error("API Error, falling back to dummy data:", err)
        setError("Failed to fetch from backend API. Trying offline data.")
        const dummy = getDummyMovieById(id)
        if (dummy) {
          setMovie(dummy)
        } else {
          setMovie(null)
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDetails()
  }, [id])

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="page-shell movie-details">
          <div className="page-shell__inner movie-details__inner" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h2 style={{ color: 'var(--color-text)' }}>Loading movie details...</h2>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!movie) {
    return <MovieNotFound />
  }

  const reviews = getPlaceholderReviews(movie)
  const similarMovies = getSimilarMovies(movie.id) // Fallback logic for similar movies

  // Add subtle backdrop styling if available
  const heroStyle = movie.backdrop ? {
    backgroundImage: `linear-gradient(to right, rgba(21, 26, 36, 1) 20%, rgba(21, 26, 36, 0.7) 100%), url(${movie.backdrop})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: 'overlay',
  } : {};

  return (
    <>
      <Navbar />
      <main className="page-shell movie-details">
        <div className="page-shell__inner movie-details__inner">
          <Link to="/movies" className="movie-details__back">
            ← Back to Movies
          </Link>
          
          {error && (
            <div style={{ backgroundColor: 'rgba(229, 9, 20, 0.1)', border: '1px solid #e50914', color: '#fff', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              ⚠️ {error}
            </div>
          )}

          <section className="movie-details__hero glass-card" style={heroStyle}>
            <div className="movie-details__poster-wrap">
              {!posterFailed && movie.poster ? (
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
                  <dd>{movie.cast.length > 0 ? movie.cast.join(', ') : 'Unknown'}</dd>
                </div>
              </dl>

              <p className="movie-details__overview">{movie.overview}</p>

              <div className="movie-details__actions">
                <div className="movie-details__watchlist-action" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {!isAuthenticated ? (
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={() => navigate('/login')}
                    >
                      Login to save
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`btn ${isInWatchlist ? 'btn--in-watchlist' : 'btn--primary'}`}
                      onClick={handleWatchlistToggle}
                      disabled={watchlistLoading}
                    >
                      {watchlistLoading ? 'Wait...' : isInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
                    </button>
                  )}
                  {watchlistMessage && (
                    <span className={`watchlist-message watchlist-message--${watchlistMessage.type}`}>
                      {watchlistMessage.text}
                    </span>
                  )}
                </div>
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
            {movie.trailerKey ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <iframe 
                  src={`https://www.youtube.com/embed/${movie.trailerKey}`} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                ></iframe>
              </div>
            ) : (
              <div className="movie-details__trailer glass-card">
                <span className="movie-details__trailer-play" aria-hidden="true">
                  ▶
                </span>
                <p className="movie-details__trailer-text">
                  Trailer is not available for this movie yet.
                </p>
              </div>
            )}
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
