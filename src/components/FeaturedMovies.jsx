import { movies } from '../data/movies'
import MovieCard from './MovieCard'

export default function FeaturedMovies() {
  return (
    <section className="section featured" id="movies">
      <div className="section__inner">
        <h2 className="section__title">Featured Movies</h2>
        <p className="section__subtitle">
          Hand-picked titles to get you started on your next watch.
        </p>

        <div className="featured__grid">
          {movies.slice(0, 6).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  )
}
