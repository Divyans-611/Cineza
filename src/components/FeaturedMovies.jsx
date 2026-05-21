import { useEffect, useState } from 'react'
import { movies as dummyMovies } from '../data/movies'
import { getTrendingMovies } from '../services/movieService'
import { normalizeTMDBMovie } from '../utils/movieUtils'
import MovieCard from './MovieCard'

export default function FeaturedMovies() {
  const [featured, setFeatured] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getTrendingMovies()
        if (data.results) {
          setFeatured(data.results.map(normalizeTMDBMovie).slice(0, 6))
        } else {
          throw new Error('No results')
        }
      } catch (err) {
        console.error("Failed to fetch featured movies, using fallback:", err)
        setError(true)
        setFeatured(dummyMovies.slice(0, 6))
      } finally {
        setIsLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <section className="section featured" id="movies">
      <div className="section__inner">
        <h2 className="section__title">Featured Movies</h2>
        <p className="section__subtitle">
          Hand-picked titles to get you started on your next watch.
        </p>

        {error && (
          <p className="fallback-note" style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Showing offline picks. Connect to API for live trending movies.
          </p>
        )}

        <div className="featured__grid">
          {isLoading ? (
            <p>Loading featured movies...</p>
          ) : (
            featured.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}

