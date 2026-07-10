import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMulti } from '../services/movieService';
import { normalizeTMDBMovie } from '../utils/movieUtils';
import { Film, Star } from 'lucide-react';

export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState('all');
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
      setFilter('all');
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
        const data = await searchMulti(trimmedQuery);
        if (data.results) {
          const filtered = data.results
            .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
            .map(item => {
              const normalized = normalizeTMDBMovie(item);
              normalized.mediaType = item.media_type;
              return normalized;
            });
          setResults(filtered);
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

  const handleSelect = (id, mediaType) => {
    onClose();
    if (mediaType === 'tv') {
      navigate(`/tv/${id}`);
    } else {
      navigate(`/movies/${id}`);
    }
  };

  const handleChipClick = (term) => {
    setQuery(term);
  };

  const filteredResults = results.filter(item => {
    if (filter === 'all') return true;
    return item.mediaType === filter;
  });

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
              placeholder="Search movies, TV shows, titles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search entertainment"
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

          {query.trim().length >= 2 && results.length > 0 && (
            <div className="search-filter-tabs" style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1.5rem 0', borderBottom: 'none' }}>
              <button 
                className={`search-filter-tab ${filter === 'all' ? 'active' : ''}`} 
                onClick={() => setFilter('all')}
                style={{
                  background: filter === 'all' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: 'none',
                  color: 'var(--color-text)',
                  fontSize: '0.82rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                All
              </button>
              <button 
                className={`search-filter-tab ${filter === 'movie' ? 'active' : ''}`} 
                onClick={() => setFilter('movie')}
                style={{
                  background: filter === 'movie' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: 'none',
                  color: 'var(--color-text)',
                  fontSize: '0.82rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Movies
              </button>
              <button 
                className={`search-filter-tab ${filter === 'tv' ? 'active' : ''}`} 
                onClick={() => setFilter('tv')}
                style={{
                  background: filter === 'tv' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: 'none',
                  color: 'var(--color-text)',
                  fontSize: '0.82rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                TV Shows
              </button>
            </div>
          )}
        </header>

        <div className="search-results">
          {query.trim().length < 2 && !isLoading && (
            <div className="search-state search-state--idle">
              <svg className="search-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p className="search-state-text">Search for a movie or TV show to begin.</p>
              <div className="search-chips">
                <button className="search-chip" onClick={() => handleChipClick('Interstellar')}>Interstellar</button>
                <button className="search-chip" onClick={() => handleChipClick('Stranger Things')}>Stranger Things</button>
                <button className="search-chip" onClick={() => handleChipClick('Breaking Bad')}>Breaking Bad</button>
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

          {!isLoading && !error && query.trim().length >= 2 && filteredResults.length === 0 && (
            <div className="search-state search-state--empty">
              <svg className="search-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <p className="search-state-text">No results found for &ldquo;{query.trim()}&rdquo;</p>
              <p className="search-state-hint">Try a different title or adjust the filters.</p>
            </div>
          )}

          {!isLoading && !error && filteredResults.length > 0 && (
            <div className="search-results-list">
              {filteredResults.map(item => (
                <div key={item.id} className="search-result-card" onClick={() => handleSelect(item.id, item.mediaType)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') handleSelect(item.id, item.mediaType); }}>
                  {item.poster ? (
                    <img src={item.poster} alt={item.title} className="search-result-poster" loading="lazy" />
                  ) : (
                    <div className="search-result-poster search-result-poster--fallback">
                      <Film size={24} opacity={0.5} />
                    </div>
                  )}
                  <div className="search-result-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <h4 className="search-result-title" style={{ margin: 0 }}>{item.title}</h4>
                      <span className="search-result-badge" style={{
                        padding: '0.1rem 0.35rem',
                        fontSize: '0.62rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        borderRadius: '4px',
                        background: item.mediaType === 'tv' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: item.mediaType === 'tv' ? '#60a5fa' : '#f87171',
                        border: item.mediaType === 'tv' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                      }}>
                        {item.mediaType === 'tv' ? 'TV' : 'Movie'}
                      </span>
                    </div>
                    <div className="search-result-meta">
                      <span>{item.year}</span>
                      {item.rating !== 'N/A' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><Star size={12} fill="currentColor" color="var(--color-gold)" /> {item.rating}</span>}
                      <span>{item.genre}</span>
                    </div>
                    <p className="search-result-overview">
                      {item.overview}
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
