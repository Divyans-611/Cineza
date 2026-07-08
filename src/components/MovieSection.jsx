
import MovieCard from './MovieCard'
import MovieSkeleton from './MovieSkeleton'

export default function MovieSection({ title, subtitle, movies, isLoading, isError, emptyMessage }) {
  if (isError && (!movies || movies.length === 0)) {
    return null; // Let global handles or fallbacks manage global errors
  }

  // 6 skeleton placeholders during load
  const skeletons = Array.from({ length: 6 }, (_, i) => i);

  return (
    <section className="section movie-section">
      <div className="section__inner">
        <header className="movie-section__header">
          <div className="movie-section__title-group">
            <h2 className="movie-section__title">{title}</h2>
            {subtitle && <p className="movie-section__subtitle">{subtitle}</p>}
          </div>
        </header>

        {isLoading ? (
          <div className="movie-section__shelf-wrap">
            <div className="movie-section__shelf movie-section__shelf--loading">
              {skeletons.map((idx) => (
                <div key={idx} className="movie-section__item">
                  <MovieSkeleton />
                </div>
              ))}
            </div>
          </div>
        ) : !movies || movies.length === 0 ? (
          <div className="movie-section__empty glass-card">
            <span className="movie-section__empty-icon" aria-hidden="true">🎬</span>
            <h3 className="movie-section__empty-title">No Movies Available</h3>
            <p className="movie-section__empty-text">{emptyMessage || 'Check back later for fresh updates.'}</p>
          </div>
        ) : (
          <div className="movie-section__shelf-wrap">
            <div className="movie-section__shelf">
              {movies.map((movie) => (
                <div key={movie.id} className="movie-section__item">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
