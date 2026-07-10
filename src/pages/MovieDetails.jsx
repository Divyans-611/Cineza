import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MovieCard from '../components/MovieCard'
import { movies, getMovieById as getDummyMovieById, getSimilarMovies } from '../data/movies'
import { getMovieDetails, getMovieCredits, getMovieVideos } from '../services/movieService'
import { normalizeTMDBDetails } from '../utils/movieUtils'
import { useAuth } from '../context/AuthContext'
import { addToWatchlist, removeFromWatchlist, checkWatchlist } from '../services/watchlistService'
import ReviewsSection from '../components/ReviewsSection'
import { Clapperboard, User, ArrowLeft, Star, Lock, Loader2, Check, Plus, PenBox, Sparkles, AlertTriangle, PlayCircle } from 'lucide-react'

function handleAction() {
  alert('This feature will be available in the next phase.')
}

// Format currency helper
function formatCurrency(amount) {
  if (!amount) return null
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(0)}M`
  return `$${amount.toLocaleString()}`
}

function MovieNotFound() {
  return (
    <>
      <Navbar />
      <main className="page-shell movie-details movie-details--not-found">
        <div className="page-shell__inner movie-details__inner">
          <article className="movie-details__empty empty-state glass-card">
            <Clapperboard className="movie-details__empty-icon" size={48} opacity={0.5} />
            <h1 className="movie-details__empty-title">Movie Not Found</h1>
            <p className="movie-details__empty-text">
              This movie seems to have missed its release date.
            </p>
            <Link to="/movies" className="btn btn--primary">Back to Movies</Link>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}

// Loading skeleton
function MovieDetailsSkeleton() {
  return (
    <>
      <Navbar />
      <main className="md-page">
        <div className="md-hero md-hero--skeleton">
          <div className="md-hero__gradient" />
          <div className="md-hero__content">
            <div className="md-hero__poster-slot">
              <div className="skeleton-pulse md-poster--skeleton" />
            </div>
            <div className="md-hero__info">
              <div className="skeleton-pulse" style={{ height: '14px', width: '120px', borderRadius: '999px', marginBottom: '1rem' }} />
              <div className="skeleton-pulse" style={{ height: '52px', width: '80%', marginBottom: '0.75rem' }} />
              <div className="skeleton-pulse" style={{ height: '16px', width: '60%', marginBottom: '1.5rem' }} />
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {[80, 70, 90, 60].map((w, i) => (
                  <div key={i} className="skeleton-pulse" style={{ height: '28px', width: `${w}px`, borderRadius: '999px' }} />
                ))}
              </div>
              <div className="skeleton-pulse" style={{ height: '16px', width: '100%', marginBottom: '0.5rem' }} />
              <div className="skeleton-pulse" style={{ height: '16px', width: '90%', marginBottom: '0.5rem' }} />
              <div className="skeleton-pulse" style={{ height: '16px', width: '75%', marginBottom: '2rem' }} />
              <div className="skeleton-pulse" style={{ height: '44px', width: '180px', borderRadius: '10px' }} />
            </div>
          </div>
        </div>
        <div className="md-body">
          <div className="md-body__inner" />
        </div>
      </main>
      <Footer />
    </>
  )
}

// Cast card sub-component
function CastCard({ member }) {
  const [imgFailed, setImgFailed] = useState(false)
  return (
    <div className="cast-card">
      <div className="cast-card__avatar-wrap">
        {!imgFailed && member.profileImage ? (
          <img
            src={member.profileImage}
            alt={member.name}
            className="cast-card__avatar"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="cast-card__avatar cast-card__avatar--fallback" aria-label={member.name}>
            <User size={32} opacity={0.5} />
          </div>
        )}
      </div>
      <p className="cast-card__name">{member.name}</p>
      {member.character && (
        <p className="cast-card__character">{member.character}</p>
      )}
    </div>
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

  // Toggle watchlist logic — UNCHANGED
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
        let formattedGenres = []
        if (Array.isArray(movie.genre)) {
          formattedGenres = movie.genre
        } else if (typeof movie.genre === 'string') {
          formattedGenres = movie.genre.split(',').map(g => g.trim())
        } else if (movie.genres && Array.isArray(movie.genres)) {
          formattedGenres = movie.genres.map(g => g.name || g)
        }

        const rawRating = movie.vote_average ?? movie.rating
        const safeRating = Number(rawRating)

        const movieData = {
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path || movie.posterPath || movie.poster || '',
          backdropPath: movie.backdrop_path || movie.backdropPath || movie.backdrop || '',
          releaseDate: movie.release_date || movie.releaseDate || movie.year || '',
          rating: Number.isFinite(safeRating) ? safeRating : 0,
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
        console.error('API Error, falling back to dummy data:', err)
        setError('Showing offline data — connect to backend for full details.')
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

  if (isLoading) return <MovieDetailsSkeleton />
  if (!movie) return <MovieNotFound />

  let similarMovies = getSimilarMovies(movie.id)
  if (similarMovies.length === 0) {
    const currentGenre = movie.genre || (Array.isArray(movie.genres) && movie.genres[0]) || 'Drama'
    const sameGenre = movies.filter(
      (m) => m.id !== movie.id && m.genre && m.genre.toLowerCase() === currentGenre.toLowerCase()
    )
    const others = movies.filter(
      (m) => m.id !== movie.id && (!m.genre || m.genre.toLowerCase() !== currentGenre.toLowerCase())
    )
    similarMovies = [...sameGenre, ...others].slice(0, 4)
  }

  // ── Hero backdrop style
  const backdropStyle = movie.backdrop
    ? {
        backgroundImage: `
          linear-gradient(to top, #0b0f19 0%, rgba(11,15,25,0.85) 40%, rgba(11,15,25,0.55) 70%, rgba(11,15,25,0.3) 100%),
          url(${movie.backdrop})
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
      }
    : {
        background: 'linear-gradient(180deg, rgba(21,26,36,0.9) 0%, #0b0f19 100%)',
      }

  // Genre display — prefer genres array, fallback to genre string
  const genreList = Array.isArray(movie.genres) && movie.genres.length > 0
    ? movie.genres
    : movie.genre ? [movie.genre] : []

  // Cast objects — may not exist on dummy data
  const castObjects = movie.castObjects || []

  return (
    <>
      <Navbar />
      <main className="md-page">

        {/* ═══════════════════════════════════════
            CINEMATIC HERO BANNER
        ═══════════════════════════════════════ */}
        <section className="md-hero" style={backdropStyle} aria-label={`${movie.title} hero banner`}>
          <div className="md-hero__gradient" aria-hidden="true" />
          <div className="md-hero__content">

            {/* Poster */}
            <div className="md-hero__poster-slot">
              <div className="md-poster">
                {!posterFailed && movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={`${movie.title} poster`}
                    className="md-poster__img"
                    onError={() => setPosterFailed(true)}
                  />
                ) : (
                  <div className="md-poster__fallback">
                    <Clapperboard size={48} opacity={0.5} />
                    <p>{movie.title}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="md-hero__info">
              {/* Back link */}
              <Link to="/movies" className="md-back" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowLeft size={16} /> All Movies
              </Link>

              {/* Tagline */}
              {movie.tagline && (
                <p className="md-hero__tagline">&ldquo;{movie.tagline}&rdquo;</p>
              )}

              {/* Title */}
              <h1 className="md-hero__title">{movie.title}</h1>

              {/* Meta row */}
              <div className="md-hero__meta">
                {movie.rating && movie.rating !== 'N/A' && (
                  <span className="md-meta-pill md-meta-pill--rating" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Star size={14} fill="currentColor" /> {movie.rating}
                  </span>
                )}
                {movie.year && (
                  <span className="md-meta-pill">{movie.year}</span>
                )}
                {movie.runtime > 0 && (
                  <span className="md-meta-pill">{movie.runtime} min</span>
                )}
                {movie.language && (
                  <span className="md-meta-pill md-meta-pill--lang">{movie.language}</span>
                )}
              </div>

              {/* Genre badges */}
              {genreList.length > 0 && (
                <div className="md-hero__genres">
                  {genreList.map(g => (
                    <span key={g} className="md-genre-badge">{g}</span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <p className="md-hero__overview">{movie.overview}</p>

              {/* Director */}
              {movie.director && movie.director !== 'Unknown' && (
                <p className="md-hero__director">
                  <span className="md-hero__director-label">Directed by</span>
                  {' '}{movie.director}
                </p>
              )}

              {/* Watchlist + CTA actions */}
              <div className="md-hero__actions">
                <div className="md-watchlist-wrap">
                  {!isAuthenticated ? (
                    <button
                      type="button"
                      className="btn btn--md-watchlist"
                      onClick={() => navigate('/login')}
                    >
                      <Lock size={16} /> Login to Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`btn ${isInWatchlist ? 'btn--md-watchlist-active' : 'btn--md-watchlist'}`}
                      onClick={handleWatchlistToggle}
                      disabled={watchlistLoading}
                    >
                      {watchlistLoading
                        ? <Loader2 size={16} className="spinning-loader" />
                        : isInWatchlist
                          ? <><Check size={16} /> In Watchlist</>
                          : <><Plus size={16} /> Watchlist</>
                      }
                    </button>
                  )}
                  {watchlistMessage && (
                    <span className={`md-watchlist-msg md-watchlist-msg--${watchlistMessage.type}`}>
                      {watchlistMessage.text}
                    </span>
                  )}
                </div>

                <button type="button" className="btn btn--md-secondary" onClick={handleAction}>
                  <PenBox size={16} /> Write Review
                </button>
                <button type="button" className="btn btn--md-secondary" onClick={handleAction}>
                  <Sparkles size={16} /> AI Pick
                </button>
              </div>

              {/* Offline error banner */}
              {error && (
                <div className="md-offline-banner" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={16} /> {error}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            BODY CONTENT
        ═══════════════════════════════════════ */}
        <div className="md-body">
          <div className="md-body__inner">

            {/* ─── Movie Info Grid ─── */}
            {(movie.budget || movie.revenue || movie.status || movie.language) && (
              <section className="md-section" aria-label="Movie details">
                <h2 className="md-section__title">
                  <span className="md-section__accent" aria-hidden="true" />
                  Movie Details
                </h2>
                <div className="md-info-grid">
                  {movie.status && (
                    <div className="md-info-item">
                      <dt className="md-info-item__label">Status</dt>
                      <dd className="md-info-item__value">
                        <span className={`md-status-badge md-status-badge--${movie.status.toLowerCase().replace(/\s/g, '-')}`}>
                          {movie.status}
                        </span>
                      </dd>
                    </div>
                  )}
                  {movie.language && (
                    <div className="md-info-item">
                      <dt className="md-info-item__label">Original Language</dt>
                      <dd className="md-info-item__value">{movie.language}</dd>
                    </div>
                  )}
                  {movie.budget && (
                    <div className="md-info-item">
                      <dt className="md-info-item__label">Budget</dt>
                      <dd className="md-info-item__value">{formatCurrency(movie.budget)}</dd>
                    </div>
                  )}
                  {movie.revenue && (
                    <div className="md-info-item">
                      <dt className="md-info-item__label">Box Office</dt>
                      <dd className="md-info-item__value">{formatCurrency(movie.revenue)}</dd>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ─── Cast Section ─── */}
            {castObjects.length > 0 && (
              <section className="md-section" aria-label="Cast">
                <h2 className="md-section__title">
                  <span className="md-section__accent" aria-hidden="true" />
                  Cast
                </h2>
                <div className="md-cast-shelf-wrap">
                  <div className="md-cast-shelf">
                    {castObjects.map(member => (
                      <CastCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ─── Trailer Section ─── */}
            <section className="md-section" aria-label="Trailer">
              <h2 className="md-section__title">
                <span className="md-section__accent" aria-hidden="true" />
                Trailer
              </h2>
              {movie.trailerKey ? (
                <div className="md-trailer-wrap">
                  <iframe
                    src={`https://www.youtube.com/embed/${movie.trailerKey}?rel=0&modestbranding=1`}
                    title={`${movie.title} trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="md-trailer-iframe"
                  />
                </div>
              ) : (
                <div className="md-trailer-empty glass-card">
                  <PlayCircle size={48} opacity={0.5} className="md-trailer-empty__icon" />
                  <p className="md-trailer-empty__text">No trailer available yet.</p>
                  <p className="md-trailer-empty__note">Check back later — trailers drop closer to release.</p>
                </div>
              )}
            </section>

            {/* ─── Similar Movies ─── */}
            {similarMovies.length > 0 && (
              <section className="md-section" aria-label="Similar movies">
                <h2 className="md-section__title">
                  <span className="md-section__accent" aria-hidden="true" />
                  You May Also Like
                </h2>
                <div className="movie-section__shelf-wrap">
                  <div className="movie-section__shelf">
                    {similarMovies.map(similar => (
                      <div key={similar.id} className="movie-section__item">
                        <MovieCard movie={similar} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ─── Reviews Section ─── */}
            <section className="md-section md-section--reviews" aria-label="Community reviews">
              <h2 className="md-section__title">
                <span className="md-section__accent" aria-hidden="true" />
                Community Reviews
              </h2>
              <ReviewsSection
                movieId={movie.id}
                movieTitle={movie.title}
                moviePoster={movie.poster}
              />
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
