import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAuthProviderLabel, getInitials } from '../utils/authUtils';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { getWatchlist } from '../services/watchlistService';


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
  const bio = user.bio || '“Cinema is how we dream with our eyes open”';
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
        <div className="page-shell__inner" style={{ padding: '2rem 1.25rem', maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            
            {/* Header profile card */}
            <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              {/* Premium Glow indicator */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--color-primary), var(--color-gold))' }}></div>
              
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-gold)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
                  />
                ) : (
                  <div 
                    style={{ 
                      width: '110px', 
                      height: '110px', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.2), rgba(245, 197, 24, 0.15))', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '2.5rem', 
                      color: 'var(--color-gold)',
                      border: '3px solid var(--color-gold)', 
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                      fontWeight: '800'
                    }}
                  >
                    {getInitials(user.name)}
                  </div>
                )}
                <span style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: 'var(--color-gold)', color: '#000', fontSize: '0.75rem', fontWeight: '900', padding: '0.25rem 0.6rem', borderRadius: '999px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', border: '2px solid #040714' }}>
                  LVL {level}
                </span>
              </div>

              <h1 style={{ margin: '0 0 0.25rem', fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#fff' }}>{user.name}</h1>
              <p style={{ margin: '0 0 0.75rem', color: 'var(--color-gold)', fontSize: '1rem', fontWeight: '600' }}>@{user.username}</p>
              
              <blockquote style={{ margin: '0 0 1.5rem', fontStyle: 'italic', color: 'var(--color-muted)', fontSize: '0.95rem', maxWidth: '45ch' }}>
                {bio}
              </blockquote>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', fontSize: '0.8rem' }}>
                <span style={{ padding: '0.4rem 0.85rem', borderRadius: '999px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}>
                  📧 {user.email}
                </span>
                <span 
                  style={{ 
                    padding: '0.4rem 0.85rem', 
                    borderRadius: '999px', 
                    background: provider === 'google' ? 'rgba(66, 133, 244, 0.1)' : 'rgba(245, 197, 24, 0.1)', 
                    border: provider === 'google' ? '1px solid rgba(66, 133, 244, 0.3)' : '1px solid rgba(245, 197, 24, 0.3)', 
                    color: provider === 'google' ? '#8ab4f8' : 'var(--color-gold)', 
                    fontWeight: '700',
                    letterSpacing: '0.02em'
                  }}
                >
                  🔑 {getAuthProviderLabel(provider)}
                </span>
              </div>
            </div>

            {/* Stats and Gamification Achievements Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem' }}>
              
              {/* Level progression card */}
              <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.2rem', fontWeight: '700', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🏆</span> Level Progression
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                    <span>XP: {xp}</span>
                    <span style={{ color: 'var(--color-muted)' }}>Next Level: {level * 100} XP</span>
                  </div>
                  {/* Level progress bar */}
                  <div style={{ width: '100%', height: '8px', background: '#0b0f19', borderRadius: '999px', overflow: 'hidden', border: '1px solid var(--color-border)', marginBottom: '1.25rem' }}>
                    <div style={{ width: `${Math.min((xp / (level * 100)) * 100, 100)}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-gold))' }}></div>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: '1.6', margin: 0 }}>
                  Earn more experience points (XP) and level up your status by writing movie reviews, ranking discovery Shelves, and interacting with AI movie recommendation features!
                </p>
              </div>

              {/* Badges unlocked card */}
              <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.2rem', fontWeight: '700', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🎖️</span> Movie Badges
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                    {badges.map((badge) => (
                      <span
                        key={badge}
                        style={{
                          padding: '0.5rem 0.85rem',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          borderRadius: '6px',
                          background: 'linear-gradient(135deg, rgba(245, 197, 24, 0.12) 0%, rgba(229, 9, 20, 0.05) 100%)',
                          border: '1px solid rgba(245, 197, 24, 0.25)',
                          color: 'var(--color-gold)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                      >
                        🌟 {badge}
                      </span>
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '1.25rem', lineHeight: '1.6', margin: 0 }}>
                  Achievements mark your deep connection to cinema. Discover hidden titles and leave critiques to unlock legendary custom profile badges!
                </p>
              </div>

            </div>

            {/* Favorite Genres Card */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.2rem', fontWeight: '700', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🎭</span> Favorite Genres
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {favGenres.map((genre) => (
                  <span 
                    key={genre} 
                    style={{ 
                      padding: '0.45rem 1.1rem', 
                      borderRadius: '8px', 
                      background: 'rgba(255, 255, 255, 0.03)', 
                      border: '1px solid var(--color-border)',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: '#fff'
                    }}
                  >
                    {genre}
                  </span>
                ))}
                <span 
                  style={{ 
                    padding: '0.45rem 1.1rem', 
                    borderRadius: '8px', 
                    background: 'transparent', 
                    border: '1.5px dashed var(--color-border)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--color-muted)',
                    cursor: 'pointer'
                  }}
                >
                  + Add More
                </span>
              </div>
            </div>

            {/* Placeholders for future phases (Watchlist & Reviews) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem' }}>
              
              {/* Watchlist sync placeholder */}
              <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '2.5rem' }}>📂</span>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: '700' }}>My Watchlist</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: '600', marginBottom: '1rem' }}>
                    {watchlistCount} movies saved
                  </p>
                  <button onClick={() => navigate('/watchlist')} className="btn btn--secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    View Watchlist
                  </button>
                </div>
              </div>

              {/* Reviews vault placeholder */}
              <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem', border: '1px dashed var(--color-border)' }}>
                <span style={{ fontSize: '2.5rem' }}>📝</span>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: '700' }}>CineReviews</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: '1.5', margin: 0 }}>
                    Critique logs are waiting. Soon you can publish custom movie reviews, earn community votes, and level up faster!
                  </p>
                </div>
              </div>

            </div>

            {/* Logout trigger button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <button
                onClick={handleLogout}
                className="btn btn--secondary"
                style={{ padding: '0.75rem 2.5rem', fontSize: '0.95rem', letterSpacing: '0.02em', fontWeight: '600' }}
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
