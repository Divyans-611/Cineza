import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Film, Search, Loader2 } from 'lucide-react'
import MediaCard from '../components/MediaCard'
import { getTrendingTv, searchTv } from '../services/tvService'

const GENRES = [
  'All',
  'Drama',
  'Sci-Fi & Fantasy',
  'Action & Adventure',
  'Comedy',
  'Mystery',
  'Animation',
  'Crime',
]


function resetFilters(setSearch, setActiveGenre) {
  setSearch('')
  setActiveGenre('All')
}

export default function TvShows() {
  const [search, setSearch] = useState('')
  const [activeGenre, setActiveGenre] = useState('All')
  
  const [apiShows, setApiShows] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let timeoutId;
    
    const fetchTvShows = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        let results;
        if (search.trim() !== '') {
           const data = await searchTv(search.trim())
           results = data.results || []
        } else {
           const data = await getTrendingTv()
           results = data.results || []
        }
        
        // Normalize TV show data structure
        const normalized = results.map(item => ({
          id: item.id,
          title: item.name || item.title,
          poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
          poster_path: item.poster_path,
          rating: item.vote_average,
          year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : 'N/A',
          first_air_date: item.first_air_date,
          genre: 'TV Show',
          mediaType: 'tv'
        }));
        
        setApiShows(normalized)
      } catch (err) {
        console.error("API Error fetching TV Shows:", err)
        setError("Failed to connect to backend API. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    // Debounced search
    timeoutId = setTimeout(() => {
      fetchTvShows()
    }, search.trim() !== '' ? 500 : 0);

    return () => clearTimeout(timeoutId)
  }, [search])

  const filteredShows = useMemo(() => {
    return apiShows.filter((show) => {
      const matchesGenre = activeGenre === 'All' || show.genre === activeGenre
      return matchesGenre
    })
  }, [apiShows, activeGenre])

  const hasActiveFilters = search.trim() !== '' || activeGenre !== 'All'
  const countLabel = filteredShows.length === 1 ? 'show' : 'shows'
  const countText = `Showing ${filteredShows.length} ${countLabel}`

  return (
    <>
      <Navbar />
      <main className="page-shell movies-page">
        <div className="page-shell__inner">
          <header className="section-header section-header--left">
            <h1 className="section-header__title">Explore TV Shows</h1>
            <p className="section-header__subtitle">
              Browse weekly trending shows, search series by title, and save them to your watchlist.
            </p>
          </header>

          <div className="movies-toolbar glass-card">
            <label className="movies-search" htmlFor="tv-search">
              <span className="movies-search__icon" aria-hidden="true">
                <Search size={20} />
              </span>
              <input
                id="tv-search"
                type="search"
                className="movies-search__input"
                placeholder="Search TV shows by title..."
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
              ⚠️ {error}
            </div>
          )}

          <div className="movies-results-bar">
            <p className="movies-page__count" aria-live="polite">
              {isLoading ? "Loading TV shows..." : countText}
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
          ) : filteredShows.length > 0 ? (
            <div className="movies-grid">
              {filteredShows.map((show) => (
                <MediaCard key={show.id} media={show} />
              ))}
            </div>
          ) : (
            <div className="empty-state glass-card movies-empty">
              <span className="empty-state__icon" aria-hidden="true" style={{ display: 'flex', justifyContent: 'center' }}>
                <Film size={40} opacity={0.5} color="var(--color-gold)" />
              </span>
              <p className="empty-state__title">No TV shows found</p>
              <p className="empty-state__text">
                Try another title or adjust your search filter.
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
