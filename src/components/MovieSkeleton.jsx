// src/components/MovieSkeleton.jsx

export default function MovieSkeleton() {
  return (
    <div className="movie-card movie-card--skeleton">
      <div className="movie-card__poster-wrap movie-card__poster-wrap--skeleton">
        <div className="skeleton-pulse skeleton-pulse--poster" />
        <div className="skeleton-pulse skeleton-pulse--badge" />
      </div>
      <div className="movie-card__body movie-card__body--skeleton">
        <div className="skeleton-pulse skeleton-pulse--title" />
        <div className="skeleton-pulse skeleton-pulse--meta" />
      </div>
    </div>
  )
}
