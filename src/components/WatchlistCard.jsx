import { Link } from 'react-router-dom'
import { Film, X, Star } from 'lucide-react'

export default function WatchlistCard({ movie, onRemove }) {
  const mediaType = movie.mediaType || 'movie'
  const isTv = mediaType === 'tv'

  const handleRemove = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onRemove(movie.movieId, mediaType)
  }

  const posterUrl = movie.posterPath 
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` 
    : null

  const releaseYear = movie.releaseDate 
    ? new Date(movie.releaseDate).getFullYear() 
    : 'N/A'
    
  const addedDate = movie.addedAt 
    ? new Date(movie.addedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) 
    : ''

  const detailsUrl = isTv ? `/tv/${movie.movieId}` : `/movies/${movie.movieId}`

  return (
    <Link to={detailsUrl} className="watchlist-card glass-card">
      <div className="watchlist-card__poster-wrap">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} poster`}
            className="watchlist-card__poster"
            loading="lazy"
          />
        ) : (
          <div className="watchlist-card__fallback">
            <Film size={32} opacity={0.5} className="watchlist-card__fallback-icon" />
            <p className="watchlist-card__fallback-title">{movie.title}</p>
            <small className="watchlist-card__fallback-text">No Poster</small>
          </div>
        )}

        <span className="search-result-badge" style={{
          position: 'absolute',
          top: '0.55rem',
          left: '0.55rem',
          zIndex: 3,
          padding: '0.15rem 0.35rem',
          fontSize: '0.62rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          borderRadius: '4px',
          background: isTv ? 'rgba(59, 130, 246, 0.25)' : 'rgba(239, 68, 68, 0.25)',
          color: isTv ? '#60a5fa' : '#f87171',
          border: isTv ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
          backdropFilter: 'blur(6px)'
        }}>
          {isTv ? 'TV' : 'Movie'}
        </span>

        <div className="watchlist-card__overlay">
          <button 
            type="button" 
            className="watchlist-card__remove-btn" 
            onClick={handleRemove}
            title="Remove from Watchlist"
          >
            <X size={14} style={{ marginRight: '0.25rem' }} /> Remove
          </button>
        </div>
        <div className="watchlist-card__rating" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <Star size={12} fill="currentColor" color="var(--color-gold)" /> {movie.rating > 0 ? movie.rating.toFixed(1) : 'NR'}
        </div>
      </div>
      
      <div className="watchlist-card__body">
        <h3 className="watchlist-card__title">{movie.title}</h3>
        
        <div className="watchlist-card__meta">
          <span>{releaseYear}</span>
          {movie.genres && movie.genres.length > 0 && (
            <>
              <span className="watchlist-card__dot">•</span>
              <span className="watchlist-card__genre">{movie.genres[0]}</span>
            </>
          )}
        </div>
        
        <div className="watchlist-card__status-row">
          <span className="watchlist-card__status-badge">Want to Watch</span>
          {addedDate && <span className="watchlist-card__date">Added {addedDate}</span>}
        </div>
      </div>
    </Link>
  )
}
