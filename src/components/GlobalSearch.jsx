import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMovies } from '../services/movieService';
import { normalizeTMDBMovie } from '../utils/movieUtils';

export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Global keyboard shortcut: Cmd+K / Ctrl+K to open
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) {
          // Trigger parent's open — but since we don't have the setter,
          // we simulate by dispatching a custom event
          window.dispatchEvent(new CustomEvent('cineza:open-search'));
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
      setError(null);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const data = await searchMovies(trimmedQuery);
        if (data.results) {
          setResults(data.results.map(normalizeTMDBMovie));
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Global search error:", err);
        setError("Couldn't reach Cineza search right now.");
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (id) => {
    onClose();
    navigate(`/movies/${id}`);
  };

  const handleChipClick = (term) => {
    setQuery(term);
  };

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <header className="search-modal-header">
          <div className="search-input-wrap">
            <svg className="search-input-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              className="search-input"
              type="text"
              placeholder="Search movies, directors, moods..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search movies"
            />
            {query && (
              <button className="search-clear-btn" onClick={() => setQuery('')} aria-label="Clear search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            <kbd className="search-esc-hint">ESC</kbd>
          </div>
        </header>

        <div className="search-results">
          {query.trim().length < 2 && !isLoading && (
            <div className="search-state search-state--idle">
              <svg className="search-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p className="search-state-text">Search for a movie, mood, or title to begin.</p>
              <div className="search-chips">
                <button className="search-chip" onClick={() => handleChipClick('Interstellar')}>Interstellar</button>
                <button className="search-chip" onClick={() => handleChipClick('Parasite')}>Parasite</button>
                <button className="search-chip" onClick={() => handleChipClick('Batman')}>Batman</button>
                <button className="search-chip" onClick={() => handleChipClick('Dune')}>Dune</button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="search-state search-state--loading">
              <div className="search-spinner" aria-label="Searching">
                <div className="search-spinner__ring" />
              </div>
              <p className="search-state-text">Searching the reel...</p>
            </div>
          )}

          {error && (
            <div className="search-state search-state--error">
              <svg className="search-state-icon search-state-icon--error" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <p className="search-state-text">{error}</p>
            </div>
          )}

          {!isLoading && !error && query.trim().length >= 2 && results.length === 0 && (
            <div className="search-state search-state--empty">
              <svg className="search-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <p className="search-state-text">No movies found for &ldquo;{query.trim()}&rdquo;</p>
              <p className="search-state-hint">Try a different title or keyword.</p>
            </div>
          )}

          {!isLoading && !error && results.length > 0 && (
            <div className="search-results-list">
              {results.map(movie => (
                <div key={movie.id} className="search-result-card" onClick={() => handleSelect(movie.id)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') handleSelect(movie.id); }}>
                  {movie.poster ? (
                    <img src={movie.poster} alt={movie.title} className="search-result-poster" loading="lazy" />
                  ) : (
                    <div className="search-result-poster search-result-poster--fallback">
                      🎬
                    </div>
                  )}
                  <div className="search-result-content">
                    <h4 className="search-result-title">{movie.title}</h4>
                    <div className="search-result-meta">
                      <span>{movie.year}</span>
                      {movie.rating !== 'N/A' && <span>★ {movie.rating}</span>}
                      <span>{movie.genre}</span>
                    </div>
                    <p className="search-result-overview">
                      {movie.overview}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
