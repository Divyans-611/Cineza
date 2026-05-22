import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Profile() {
  const { user, isAuthenticated, loading, logout } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-shell">
          <div className="page-shell__inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
              <span className="spinning-loader" style={{ fontSize: '3rem', display: 'block', marginBottom: '1.5rem', animation: 'spin 2s linear infinite' }}>⏳</span>
              <h2 style={{ fontWeight: '800' }}>Loading Profile...</h2>
              <p style={{ color: 'var(--color-muted)', marginTop: '0.5rem' }}>Fetching secure account data.</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="page-shell">
          <div className="page-shell__inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '480px', width: '100%', margin: '2rem auto' }}>
              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1.25rem' }}>👤</span>
              <h2 style={{ marginBottom: '1rem', fontWeight: '800' }}>Access Restricted</h2>
              <p style={{ color: 'var(--color-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
                Please log in to view your Cineza profile, track movie achievements, reviews, and sync your personalized watchlists.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={() => navigate('/login')} className="btn btn--primary primary-btn" style={{ padding: '0.75rem 2rem' }}>
                  Log In
                </button>
                <button onClick={() => navigate('/')} className="btn btn--secondary" style={{ padding: '0.75rem 2rem' }}>
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Fallbacks for gamification attributes
  const level = user.level || 1
  const xp = user.xp || 0
  const badges = user.badges || ['Cineza Rookie']
  const bio = user.bio || '“Cinema is how we dream with our eyes open”'
  const provider = user.authProvider || 'local'

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="page-shell__inner" style={{ padding: '2rem 1.25rem' }}>
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
                    style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-gold)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
                  />
                ) : (
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #5a0408)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', border: '3px solid var(--color-gold)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
                  </div>
                )}
                <span style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--color-gold)', color: '#000', fontSize: '0.75rem', fontWeight: '800', padding: '0.2rem 0.5rem', borderRadius: '999px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                  LVL {level}
                </span>
              </div>

              <h1 style={{ margin: '0 0 0.25rem', fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{user.name}</h1>
              <p style={{ margin: '0 0 0.75rem', color: 'var(--color-gold)', fontSize: '0.95rem', fontWeight: '600' }}>@{user.username}</p>
              
              <blockquote style={{ margin: '0 0 1.5rem', fontStyle: 'italic', color: 'var(--color-muted)', fontSize: '0.95rem', maxWidth: '45ch' }}>
                {bio}
              </blockquote>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', fontSize: '0.8rem' }}>
                <span style={{ padding: '0.35rem 0.75rem', borderRadius: '999px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}>
                  📧 {user.email}
                </span>
                <span style={{ padding: '0.35rem 0.75rem', borderRadius: '999px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', color: 'var(--color-gold)', textTransform: 'uppercase', fontWeight: '700' }}>
                  🔑 Provider: {provider}
                </span>
              </div>
            </div>

            {/* Stats and Gamification Achievements Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.0rem' }}>
              
              {/* Level progression card */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.2rem', fontWeight: '700', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', color: 'var(--color-gold)' }}>
                  🏆 Level Progression
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                  <span>XP: {xp}</span>
                  <span style={{ color: 'var(--color-muted)' }}>Next Level: {level * 100} XP</span>
                </div>
                {/* Level progress bar */}
                <div style={{ width: '100%', height: '8px', background: '#0b0f19', borderRadius: '999px', overflow: 'hidden', border: '1px solid var(--color-border)', marginBottom: '1.25rem' }}>
                  <div style={{ width: `${Math.min((xp / (level * 100)) * 100, 100)}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-gold))' }}></div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: '1.6' }}>
                  Earn more experience points (XP) and level up your status by writing movie reviews, ranking discovery Shelves, and interacting with AI movie recommendation features!
                </p>
              </div>

              {/* Badges unlocked card */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.2rem', fontWeight: '700', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', color: 'var(--color-gold)' }}>
                  🎖️ Movie Badges
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
                        background: 'linear-gradient(135deg, rgba(245, 197, 24, 0.15) 0%, rgba(229, 9, 20, 0.05) 100%)',
                        border: '1px solid rgba(245, 197, 24, 0.3)',
                        color: 'var(--color-gold)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                    >
                      🌟 {badge}
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '1.25rem', lineHeight: '1.6' }}>
                  Achievements mark your deep connection to cinema. Discover hidden titles and leave critiques to unlock legendary custom profile badges!
                </p>
              </div>

            </div>

            {/* Logout trigger button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className="btn btn--secondary"
                style={{ padding: '0.75rem 2.5rem', fontSize: '0.95rem' }}
              >
                Log Out of Cineza
              </button>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
