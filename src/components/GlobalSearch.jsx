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
        setError("Couldn’t reach Cineza search right now.");
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
            <span className="search-input-icon">🔍</span>
            <input
              ref={inputRef}
              className="search-input"
              type="text"
              placeholder="Search movies, directors, moods..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className="search-clear-btn" onClick={() => setQuery('')}>
                ✕
              </button>
            )}
          </div>
        </header>

        <div className="search-results">
          {query.trim().length < 2 && !isLoading && (
            <div className="search-state">
              <p>Search for a movie, mood, or title to begin.</p>
              <div className="search-chips">
                <button className="search-chip" onClick={() => handleChipClick('Interstellar')}>Interstellar</button>
                <button className="search-chip" onClick={() => handleChipClick('Parasite')}>Parasite</button>
                <button className="search-chip" onClick={() => handleChipClick('Batman')}>Batman</button>
                <button className="search-chip" onClick={() => handleChipClick('Dune')}>Dune</button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="search-state">
              <p>Searching the reel...</p>
            </div>
          )}

          {error && (
            <div className="search-state search-state--error">
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && query.trim().length >= 2 && results.length === 0 && (
            <div className="search-state">
              <p>No movies found. Try another title.</p>
            </div>
          )}

          {!isLoading && !error && results.length > 0 && (
            <div className="search-results-list">
              {results.map(movie => (
                <div key={movie.id} className="search-result-card" onClick={() => handleSelect(movie.id)}>
                  {movie.poster ? (
                    <img src={movie.poster} alt={movie.title} className="search-result-poster" />
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
