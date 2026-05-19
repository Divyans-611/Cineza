import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MovieCard from '../components/MovieCard'
import { movies as dummyMovies } from '../data/movies'
import { getTrendingMovies, searchMovies } from '../services/movieService'

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

// Simple map for TMDB genres to match our filter chips where possible
const TMDB_GENRES = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

function getGenreName(genreIds) {
  if (!genreIds || genreIds.length === 0) return 'Movie'
  return TMDB_GENRES[genreIds[0]] || 'Movie'
}

// Helper to normalize TMDB movie format to what MovieCard expects
function normalizeTMDBMovie(tmdbMovie) {
  const year = tmdbMovie.release_date ? tmdbMovie.release_date.substring(0, 4) : 'N/A'
  const rating = tmdbMovie.vote_average ? tmdbMovie.vote_average.toFixed(1) : 'N/A'
  const poster = tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : null
  const genre = getGenreName(tmdbMovie.genre_ids)

  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title || tmdbMovie.name || 'Unknown Title',
    year,
    rating,
    genre,
    poster,
    overview: tmdbMovie.overview || 'No overview available.',
    director: 'Unknown',
    cast: [],
    language: tmdbMovie.original_language ? tmdbMovie.original_language.toUpperCase() : 'EN'
  }
}

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
                🔍
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
            <div style={{ backgroundColor: 'rgba(229, 9, 20, 0.1)', border: '1px solid #e50914', color: '#fff', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              ⚠️ {error}
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
              <span className="empty-state__icon" aria-hidden="true">
                🎬
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
