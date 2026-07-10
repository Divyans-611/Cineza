import { useEffect, useState } from 'react';
import MediaCard from './MediaCard';
import { getMovieDetails } from '../services/movieService';
import { normalizeTMDBDetails } from '../utils/movieUtils';

export default function CuratedSection({ title, description, moodTag, movieIds }) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await Promise.all(
          movieIds.map(id => getMovieDetails(id).catch(e => {
            console.error(`Failed to fetch movie ${id} for collection`, e);
            return null; 
          }))
        );
        
        if (isMounted) {
          const validMovies = results
            .filter(Boolean)
            .map(movieData => normalizeTMDBDetails(movieData));
            
          setMovies(validMovies);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load collection.");
          console.error("Curated collection error:", err);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMovies();
    return () => { isMounted = false; };
  }, [movieIds]);

  if (error) {
    return null; 
  }

  if (movies.length === 0 && !isLoading) {
    return null;
  }

  return (
    <article className="curated-section glass-card">
      <header className="curated-section-header">
        <div className="curated-section-info">
          <span className="curated-section-tag">{moodTag || 'CINEZA CURATED'}</span>
          <h3 className="curated-section-title">{title}</h3>
          {description && <p className="curated-section-desc">{description}</p>}
          <div className="curated-meta">
            <span className="curated-meta-count">{isLoading ? '...' : movies.length} films</span>
            <span className="curated-meta-dot">•</span>
            <span className="curated-meta-by">Curated by Cineza</span>
          </div>
        </div>
        <button className="curated-view-btn" onClick={() => alert('Full collection view coming soon!')}>
          View Collection <span aria-hidden="true">→</span>
        </button>
      </header>

      <div className="curated-shelf">
        {isLoading ? (
          <div className="curated-section-loading">
            <p>Loading {title}...</p>
          </div>
        ) : (
          <>
            {movies.map(movie => (
              <div key={movie.id} className="curated-card-wrap">
                <MediaCard media={movie} />
              </div>
            ))}
          </>
        )}
      </div>
    </article>
  );
}
