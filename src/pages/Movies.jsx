import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Film, Search, Loader2, AlertTriangle } from 'lucide-react'
import MovieCard from '../components/MovieCard'
import { movies as dummyMovies } from '../data/movies'
import { getTrendingMovies, searchMovies } from '../services/movieService'
import { normalizeTMDBMovie } from '../utils/movieUtils'

const GENRES = [
  'All',
  'Action',
  'Drama',
  'Sci-Fi',
  'Thriller',
  'Comedy',
  'Romance',
  'Horror',
]

// Fallback search used only for dummy data offline filtering
function matchesSearch(movie, query) {
  if (!query) return true
  const q = query.toLowerCase()
  if (movie.title.toLowerCase().includes(q)) return true
  if (movie.genre.toLowerCase().includes(q)) return true
  if (movie.director.toLowerCase().includes(q)) return true
  if (movie.cast.some((name) => name.toLowerCase().includes(q))) return true
  return false
}

function resetFilters(setSearch, setActiveGenre) {
  setSearch('')
  setActiveGenre('All')
}

export default function Movies() {
  const [search, setSearch] = useState('')
  const [activeGenre, setActiveGenre] = useState('All')
  
  const [apiMovies, setApiMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isUsingDummy, setIsUsingDummy] = useState(false)

  // Fetch movies from API on load and search
  useEffect(() => {
    let timeoutId;
    
    const fetchMovies = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        let results;
        if (search.trim() !== '') {
           const data = await searchMovies(search.trim())
           results = data.results || []
        } else {
           const data = await getTrendingMovies()
           results = data.results || []
        }
        
        setApiMovies(results.map(normalizeTMDBMovie))
        setIsUsingDummy(false)
      } catch (err) {
        console.error("API Error, falling back to dummy data:", err)
        setError("Failed to connect to backend API. Using offline data.")
        setApiMovies(dummyMovies)
        setIsUsingDummy(true)
      } finally {
        setIsLoading(false)
      }
    }

    // Beginner-friendly debounce: wait 500ms before calling API for search
    timeoutId = setTimeout(() => {
      fetchMovies()
    }, search.trim() !== '' ? 500 : 0);

    return () => clearTimeout(timeoutId)
  }, [search])

  const filteredMovies = useMemo(() => {
    return apiMovies.filter((movie) => {
      const matchesGenre = activeGenre === 'All' || movie.genre === activeGenre || (isUsingDummy && movie.genre === activeGenre)
      
      // If using dummy data, we must do local text search since API didn't filter it
      if (isUsingDummy && search.trim() !== '') {
          return matchesGenre && matchesSearch(movie, search.trim())
      }
      
      return matchesGenre
    })
  }, [apiMovies, activeGenre, isUsingDummy, search])

  const hasActiveFilters = search.trim() !== '' || activeGenre !== 'All'
  const countLabel = filteredMovies.length === 1 ? 'movie' : 'movies'
  const countText = `Showing ${filteredMovies.length} ${countLabel}`

  return (
    <>
      <Navbar />
      <main className="page-shell movies-page">
        <div className="page-shell__inner">
          <header className="section-header section-header--left">
            <h1 className="section-header__title">Explore Movies</h1>
            <p className="section-header__subtitle">
              Search, filter, and discover films across genres, moods, and
              ratings.
            </p>
          </header>

          <div className="movies-toolbar glass-card">
            <label className="movies-search" htmlFor="movie-search">
              <span className="movies-search__icon" aria-hidden="true">
                <Search size={20} />
              </span>
              <input
                id="movie-search"
                type="search"
                className="movies-search__input"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            <div className="movies-filters" role="group" aria-label="Filter by genre">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  className={`chip movies-filter${
                    activeGenre === genre ? ' movies-filter--active' : ''
                  }`}
                  onClick={() => setActiveGenre(genre)}
                  aria-pressed={activeGenre === genre}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
          
          {error && (
            <div className="error-banner">
              <AlertTriangle size={20} color="var(--color-primary)" /> {error}
            </div>
          )}

          <div className="movies-results-bar">
            <p className="movies-page__count" aria-live="polite">
              {isLoading ? "Loading movies..." : countText}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn--secondary movies-reset-btn"
                onClick={() => resetFilters(setSearch, setActiveGenre)}
              >
                Reset Filters
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="empty-state glass-card movies-empty">
              <span className="empty-state__icon" aria-hidden="true" style={{ display: 'flex', justifyContent: 'center' }}>
                <Loader2 size={40} className="spinning-loader" color="var(--color-primary)" opacity={0.7} />
              </span>
              <p className="empty-state__title">Loading...</p>
            </div>
          ) : filteredMovies.length > 0 ? (
            <div className="movies-grid">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="empty-state glass-card movies-empty">
              <span className="empty-state__icon" aria-hidden="true" style={{ display: 'flex', justifyContent: 'center' }}>
                <Film size={40} opacity={0.5} color="var(--color-gold)" />
              </span>
              <p className="empty-state__title">No movies found</p>
              <p className="empty-state__text">
                Try another title or genre.
              </p>
              <button
                type="button"
                className="btn btn--primary primary-btn"
                onClick={() => resetFilters(setSearch, setActiveGenre)}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
