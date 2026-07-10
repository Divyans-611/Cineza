import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WatchlistCard from '../components/WatchlistCard'
import { useAuth } from '../context/AuthContext'
import { getWatchlist, removeFromWatchlist } from '../services/watchlistService'
import { Film, Inbox, AlertTriangle } from 'lucide-react'

export default function Watchlist() {
  const { isAuthenticated, token, loading: authLoading } = useAuth()
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('recent')
  const [removeMessage, setRemoveMessage] = useState(null)

  useEffect(() => {
    // Clear message after 3 seconds
    if (removeMessage) {
      const timer = setTimeout(() => setRemoveMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [removeMessage])

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!isAuthenticated) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const data = await getWatchlist(token)
        if (data.success) {
          setMovies(data.data)
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch watchlist')
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) {
      fetchWatchlist()
    }
  }, [isAuthenticated, token, authLoading])

  const handleRemove = async (movieId, mediaType = 'movie') => {
    // Optimistic UI update
    const previousMovies = [...movies]
    setMovies(movies.filter((m) => !(m.movieId === movieId && (m.mediaType || 'movie') === mediaType)))
    setRemoveMessage('Removed from watchlist')

    try {
      await removeFromWatchlist(movieId, token, mediaType)
    } catch (err) {
      console.error('Failed to remove from watchlist:', err)
      // Revert on error
      setMovies(previousMovies)
      setRemoveMessage('Failed to remove item')
    }
  }

  // Sorting logic
  const sortedMovies = [...movies].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.addedAt) - new Date(a.addedAt)
    } else if (sortBy === 'rating') {
      return b.rating - a.rating
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title)
    }
    return 0
  })

  // Render auth loading state
  if (authLoading) {
    return (
      <>
        <Navbar />
        <main className="page-shell">
          <div className="page-shell__inner" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h2 style={{ color: 'var(--color-text)' }}>Loading...</h2>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Render unauthenticated state
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="page-shell">
          <div className="page-shell__inner">
            <article className="empty-state glass-card">
              <Film size={48} opacity={0.5} className="empty-state__icon" color="var(--color-gold)" />
              <h1 className="empty-state__title">Your Watchlist Awaits</h1>
              <p className="empty-state__text">Log in to build your Cineza watchlist and keep track of movies you want to see.</p>
              <Link to="/login" className="btn btn--primary">Log In to Cineza</Link>
            </article>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="page-shell__inner">
          <div className="watchlist-header">
            <div>
              <h1 className="section-header__title" style={{ margin: '0 0 0.25rem', textAlign: 'left' }}>My Watchlist</h1>
              <p className="watchlist-count">{movies.length} {movies.length === 1 ? 'item' : 'items'} saved</p>
            </div>
            
            {movies.length > 0 && (
              <div className="watchlist-actions">
                {removeMessage && (
                  <span className="watchlist-toast-message">{removeMessage}</span>
                )}
                <div className="watchlist-sort">
                  <label htmlFor="sort-by">Sort by:</label>
                  <select 
                    id="sort-by" 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="watchlist-select"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="rating">Highest Rated</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <h2 style={{ color: 'var(--color-text)' }}>Loading your watchlist...</h2>
            </div>
          ) : error ? (
            <div className="error-banner">
              <AlertTriangle size={20} color="var(--color-primary)" /> {error}
            </div>
          ) : movies.length === 0 ? (
            <article className="empty-state glass-card">
              <Inbox size={48} opacity={0.5} className="empty-state__icon" color="var(--color-muted)" />
              <h2 className="empty-state__title">Your watchlist is empty</h2>
              <p className="empty-state__text">Start exploring movies & TV shows and add them to your watchlist to keep track of what you want to watch next.</p>
              <Link to="/" className="btn btn--primary">Explore Entertainment</Link>
            </article>
          ) : (
            <div className="watchlist-grid">
              {sortedMovies.map((movie) => (
                <WatchlistCard 
                  key={`${movie.movieId}-${movie.mediaType || 'movie'}`} 
                  movie={movie} 
                  onRemove={handleRemove} 
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
