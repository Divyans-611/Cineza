import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MovieCard from '../components/MovieCard'
import { movies } from '../data/movies'

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

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesGenre =
        activeGenre === 'All' || movie.genre === activeGenre
      return matchesGenre && matchesSearch(movie, search.trim())
    })
  }, [search, activeGenre])

  const hasActiveFilters = search.trim() !== '' || activeGenre !== 'All'
  const countLabel =
    filteredMovies.length === 1 ? 'movie' : 'movies'
  const countText = hasActiveFilters
    ? `Showing ${filteredMovies.length} of ${movies.length} ${countLabel}`
    : `Showing ${filteredMovies.length} ${countLabel}`

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
                placeholder="Search by title, genre, director, or cast..."
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

          <div className="movies-results-bar">
            <p className="movies-page__count" aria-live="polite">
              {countText}
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

          {filteredMovies.length > 0 ? (
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
                Try another title, genre, director, or cast.
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
