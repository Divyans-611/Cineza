import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Film, Star } from 'lucide-react'

export default function MediaCard({ media }) {
  const [posterFailed, setPosterFailed] = useState(false)

  // In TMDB multi-search or custom responses, the type is media_type or mediaType
  const mediaType = media.mediaType || media.media_type || (media.first_air_date || media.name ? 'tv' : 'movie')
  
  const isTv = mediaType === 'tv'
  const detailsUrl = isTv ? `/tv/${media.id}` : `/movies/${media.id}`
  
  const title = media.title || media.name || 'Untitled'
  
  // Format release year dynamically
  const dateStr = media.releaseDate || media.release_date || media.first_air_date || media.year
  const year = dateStr ? new Date(dateStr).getFullYear() : 'N/A'
  
  // Normalize rating
  const ratingVal = media.rating || media.vote_average
  const formattedRating = ratingVal && ratingVal !== 'N/A' && ratingVal > 0 
    ? Number(ratingVal).toFixed(1) 
    : null

  // Normalize genre
  const genre = media.genre || (media.genres && media.genres.length > 0 ? media.genres[0] : null) || (isTv ? 'TV Show' : 'Movie')

  // Poster Image URL normalization
  const posterUrl = media.poster || (media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : null)

  return (
    <Link to={detailsUrl} className="movie-card-v2">
      <div className="movie-card-v2__poster-wrap">
        {!posterFailed && posterUrl ? (
          <>
            <img
              src={posterUrl}
              alt={`${title} poster`}
              className="movie-card-v2__poster"
              loading="lazy"
              onError={() => setPosterFailed(true)}
            />
            <span className="movie-card-v2__gradient" aria-hidden="true" />
          </>
        ) : (
          <div className="movie-card-v2__fallback" aria-label={`${title} poster unavailable`}>
            <Film className="movie-card-v2__fallback-icon" size={32} opacity={0.5} />
            <p className="movie-card-v2__fallback-title">{title}</p>
            <p className="movie-card-v2__fallback-text">Poster unavailable</p>
          </div>
        )}

        <span className="movie-card-v2__type-badge">
          {isTv ? 'TV Show' : 'Movie'}
        </span>

        {formattedRating && (
          <span className="movie-card-v2__rating-badge">
            <Star size={12} fill="currentColor" /> {formattedRating}
          </span>
        )}

        <div className="movie-card-v2__overlay">
          <span className="movie-card-v2__cta">Details</span>
        </div>
      </div>

      <div className="movie-card-v2__body">
        <h3 className="movie-card-v2__title">{title}</h3>
        <div className="movie-card-v2__meta">
          <span className="movie-card-v2__year">{year}</span>
          <span className="movie-card-v2__dot">•</span>
          <span className="movie-card-v2__genre">{genre}</span>
        </div>
      </div>
    </Link>
  )
}
