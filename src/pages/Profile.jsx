import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAuthProviderLabel, getInitials } from '../utils/authUtils';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { getWatchlist } from '../services/watchlistService';
import { Award, Medal, Star, Film, FolderHeart, PenBox } from 'lucide-react';


export default function Profile() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [watchlistCount, setWatchlistCount] = useState(0);

  useEffect(() => {
    const fetchWatchlistCount = async () => {
      if (user && token) {
        try {
          const res = await getWatchlist(token);
          if (res.success) {
            setWatchlistCount(res.data.length);
          }
        } catch (error) {
          console.error("Failed to load watchlist count", error);
        }
      }
    };
    fetchWatchlistCount();
  }, [user, token]);

  // Guard fallback (though ProtectedRoute secures this page)
  if (!user) return null;

  // Fallbacks for gamification attributes
  const level = user.level || 1;
  const xp = user.xp || 0;
  const badges = user.badges || ['Cineza Rookie'];
  const bio = user.bio || '\u201cCinema is how we dream with our eyes open\u201d';
  const provider = user.authProvider || 'local';

  // Favorite genres placeholder
  const favGenres = ['Sci-Fi', 'Thriller', 'Drama'];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="profile-container">
          
          <div className="profile-layout">
            
            {/* Header profile card */}
            <div className="glass-card profile-hero">
              <div className="profile-hero__glow" />
              
              <div className="profile-hero__avatar-wrap">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="profile-hero__avatar-img"
                  />
                ) : (
                  <div className="profile-hero__avatar-fallback">
                    {getInitials(user.name)}
                  </div>
                )}
                <span className="profile-hero__level-badge">
                  LVL {level}
                </span>
              </div>

              <h1 className="profile-hero__name">{user.name}</h1>
              <p className="profile-hero__username">@{user.username}</p>
              
              <blockquote className="profile-hero__bio">
                {bio}
              </blockquote>

              <div className="profile-hero__tags">
                <span className="profile-hero__tag">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  {user.email}
                </span>
                <span className={`profile-hero__tag ${provider === 'google' ? 'profile-hero__tag--google' : 'profile-hero__tag--local'}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                  {getAuthProviderLabel(provider)}
                </span>
              </div>
            </div>

            {/* Stats and Gamification Achievements Grid */}
            <div className="profile-stats-grid">
              
              {/* Level progression card */}
              <div className="glass-card profile-card">
                <div>
                  <h3 className="profile-card__title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={20} className="profile-card__icon" color="var(--color-gold)" /> Level Progression
                  </h3>
                  <div className="profile-card__xp-row">
                    <span>XP: {xp}</span>
                    <span className="profile-card__xp-next">Next Level: {level * 100} XP</span>
                  </div>
                  {/* Level progress bar */}
                  <div className="profile-card__progress-track">
                    <div className="profile-card__progress-fill" style={{ width: `${Math.min((xp / (level * 100)) * 100, 100)}%` }} />
                  </div>
                </div>
                <p className="profile-card__desc">
                  Earn more experience points (XP) and level up your status by writing reviews, ranking discovery Shelves, and interacting with AI recommendation features!
                </p>
              </div>

              {/* Badges unlocked card */}
              <div className="glass-card profile-card">
                <div>
                  <h3 className="profile-card__title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Medal size={20} className="profile-card__icon" color="var(--color-gold)" /> Cineza Badges
                  </h3>
                  <div className="profile-card__badges">
                    {badges.map((badge) => (
                      <span key={badge} className="profile-card__badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Star size={14} fill="currentColor" color="var(--color-gold)" /> {badge}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="profile-card__desc">
                  Achievements mark your deep connection to cinema & series. Discover hidden titles and leave critiques to unlock legendary custom profile badges!
                </p>
              </div>

            </div>

            {/* Favorite Genres Card */}
            <div className="glass-card profile-card profile-card--wide">
              <h3 className="profile-card__title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Film size={20} className="profile-card__icon" color="var(--color-primary)" /> Favorite Genres
              </h3>
              <div className="profile-card__genres">
                {favGenres.map((genre) => (
                  <span key={genre} className="profile-card__genre-tag">
                    {genre}
                  </span>
                ))}
                <span className="profile-card__genre-tag profile-card__genre-tag--add">
                  + Add More
                </span>
              </div>
            </div>

            {/* Watchlist & Reviews quick-access */}
            <div className="profile-stats-grid">
              
              {/* Watchlist sync */}
              <div className="glass-card profile-card profile-card--center">
                <span className="profile-card__big-icon"><FolderHeart size={36} color="var(--color-gold)" opacity={0.8} /></span>
                <div>
                  <h4 className="profile-card__subtitle">My Watchlist</h4>
                  <p className="profile-card__stat">
                    {watchlistCount} {watchlistCount === 1 ? 'item' : 'items'} saved
                  </p>
                  <button onClick={() => navigate('/watchlist')} className="btn btn--secondary profile-card__action">
                    View Watchlist
                  </button>
                </div>
              </div>

              {/* Reviews vault */}
              <div className="glass-card profile-card profile-card--center profile-card--dashed">
                <span className="profile-card__big-icon"><PenBox size={36} color="var(--color-primary)" opacity={0.8} /></span>
                <div>
                  <h4 className="profile-card__subtitle">CineReviews</h4>
                  <p className="profile-card__desc">
                    Critique logs are waiting. Soon you can publish custom media reviews, earn community votes, and level up faster!
                  </p>
                </div>
              </div>

            </div>

            {/* Logout trigger button */}
            <div className="profile-logout-row">
              <button
                onClick={handleLogout}
                className="btn btn--secondary profile-logout-btn"
              >
                Log Out of Cineza
              </button>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
