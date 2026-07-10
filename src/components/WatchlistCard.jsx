import { Link } from 'react-router-dom'
import { Film, X, Star } from 'lucide-react'

export default function WatchlistCard({ movie, onRemove }) {
  const handleRemove = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onRemove(movie.movieId)
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

  return (
    <Link to={`/movies/${movie.movieId}`} className="watchlist-card glass-card">
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
