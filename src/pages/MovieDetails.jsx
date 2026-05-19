import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MovieCard from '../components/MovieCard'
import { getMovieById as getDummyMovieById, getSimilarMovies } from '../data/movies'
import { getMovieDetails, getMovieCredits, getMovieVideos } from '../services/movieService'

function getPlaceholderReviews(movie) {
  return [
    {
      id: 1,
      username: 'cinema_scout',
      rating: Math.min(10, movie.rating ? parseFloat(movie.rating) + 0.2 : 9).toFixed(1),
      text: `${movie.title} is visually stunning and stays with you long after the credits. A must-watch for ${movie.genre ? movie.genre.toLowerCase() : 'movie'} fans.`,
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
      rating: Math.max(6, movie.rating ? parseFloat(movie.rating) - 0.5 : 7).toFixed(1),
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
  const [movie, setMovie] = useState(null)
  const [trailerKey, setTrailerKey] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [posterFailed, setPosterFailed] = useState(false)

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
        
        // Normalize TMDB data
        const year = details.release_date ? details.release_date.substring(0, 4) : 'N/A'
        const rating = details.vote_average ? details.vote_average.toFixed(1) : 'N/A'
        const poster = details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : null
        const backdrop = details.backdrop_path ? `https://image.tmdb.org/t/p/original${details.backdrop_path}` : null
        const genre = details.genres && details.genres.length > 0 ? details.genres[0].name : 'Movie'
        
        const cast = credits.cast ? credits.cast.slice(0, 5).map(c => c.name) : []
        const directorObj = credits.crew ? credits.crew.find(c => c.job === 'Director') : null
        const director = directorObj ? directorObj.name : 'Unknown'
        
        const trailerObj = videos.results ? videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube') : null
        
        setTrailerKey(trailerObj ? trailerObj.key : null)
        
        setMovie({
          id: details.id,
          title: details.title || details.name,
          year,
          rating,
          genre,
          poster,
          backdrop,
          overview: details.overview || 'No overview available.',
          runtime: details.runtime || 0,
          director,
          cast,
          language: details.original_language ? details.original_language.toUpperCase() : 'EN'
        })
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
            <h2 className="movie-details__section-title">Trailer</h2>
            {trailerKey ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <iframe 
                  src={`https://www.youtube.com/embed/${trailerKey}`} 
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
                  No trailer available for this movie.
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
