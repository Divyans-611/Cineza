import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWatchlist } from '../services/watchlistService';
import { getDirectorsCutRecommendations } from '../utils/recommendationEngine';
import MovieSkeleton from './MovieSkeleton';

export default function DirectorsCut() {
  const { user, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRecommendations = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        let watchlist = null;
        if (isAuthenticated && token) {
          try {
            const res = await getWatchlist(token);
            if (res.success && res.data) {
              watchlist = res.data;
            }
          } catch (err) {
            console.warn("Could not fetch watchlist for Director's Cut:", err.message);
          }
        }

        const recs = await getDirectorsCutRecommendations(watchlist);
        if (isMounted) {
          setRecommendations(recs || []);
        }
      } catch (err) {
        console.error("Director's Cut Error:", err);
        if (isMounted) setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRecommendations();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, token]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (isError) return null;

  return (
    <section className="section directors-cut-section" id="directors-cut">
      <div className="section__inner directors-cut__inner">
        <header className="directors-cut__header">
           <div className="directors-cut__title-group">
             <span className="directors-cut__eyebrow" aria-hidden="true">🎬</span>
             <h2 className="directors-cut__title">Director's Cut</h2>
             <p className="directors-cut__subtitle">
               Handpicked recommendations crafted from your cinematic taste.
             </p>
           </div>
           
           {!isLoading && recommendations.length > 4 && (
              <div className="directors-cut__nav">
                <button 
                  type="button" 
                  className="directors-cut__nav-btn" 
                  onClick={() => scroll('left')}
                  aria-label="Scroll left"
                >
                  ←
                </button>
                <button 
                  type="button" 
                  className="directors-cut__nav-btn" 
                  onClick={() => scroll('right')}
                  aria-label="Scroll right"
                >
                  →
                </button>
              </div>
           )}
        </header>

        {isLoading ? (
          <div className="directors-cut__shelf">
            {Array.from({ length: 4 }).map((_, i) => (
               <div key={i} className="directors-cut__item">
                 <MovieSkeleton />
               </div>
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="directors-cut__empty glass-card">
             <span className="directors-cut__empty-icon" aria-hidden="true">✨</span>
             <h3 className="directors-cut__empty-title">Unlock Your Cut</h3>
             <p className="directors-cut__empty-text">
               Start building your watchlist to unlock personalized Director's Cut recommendations.
             </p>
             <button 
               className="btn btn--primary" 
               onClick={() => navigate('/movies')}
             >
               Explore Movies
             </button>
          </div>
        ) : (
          <div className="directors-cut__shelf" ref={scrollRef}>
            {recommendations.map((movie, index) => {
               // First item can be featured
               const isFeatured = index === 0;
               return (
                 <div key={movie.id} className={`directors-cut__item ${isFeatured ? 'directors-cut__item--featured' : ''}`}>
                    <Link to={`/movies/${movie.id}`} className="dc-card">
                       <div className="dc-card__poster-wrap">
                          {movie.poster ? (
                            <img 
                              src={movie.poster} 
                              alt={movie.title} 
                              className="dc-card__poster"
                              loading={isFeatured ? "eager" : "lazy"}
                            />
                          ) : (
                            <div className="dc-card__fallback">
                               <span>{movie.title}</span>
                            </div>
                          )}
                          <div className="dc-card__gradient"></div>
                          
                          {movie.rating && movie.rating !== 'N/A' && (
                            <span className="dc-card__rating">★ {movie.rating}</span>
                          )}
                       </div>
                       
                       <div className="dc-card__body">
                          <h3 className="dc-card__title">{movie.title}</h3>
                          <div className="dc-card__meta">
                            <span>{movie.year || 'N/A'}</span>
                            <span className="dc-card__dot">•</span>
                            <span>{movie.genre || 'Movie'}</span>
                          </div>
                          {movie.reason && (
                            <p className="dc-card__reason">
                              <span aria-hidden="true">💡</span> {movie.reason}
                            </p>
                          )}
                       </div>
                    </Link>
                 </div>
               );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
