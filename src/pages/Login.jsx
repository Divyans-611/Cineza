import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGoogleAuthUrl } from '../services/authService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Login() {
  const { login, clearAuthError, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  // Extract from redirection state in React Router (e.g. from ProtectedRoute)
  useEffect(() => {
    clearAuthError();
    if (location.state?.from) {
      setInfoMsg('Please log in to continue.');
    }
  }, [location, clearAuthError]);

  // Sync state with global authentication errors
  useEffect(() => {
    if (error) {
      setErrorMsg(error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      const res = await login({ email, password });
      if (res.success) {
        // Redirect back to original path if specified, otherwise profile
        const fromPath = location.state?.from?.pathname || '/profile';
        navigate(fromPath, { replace: true });
      } else {
        setErrorMsg(res.error || 'Invalid credentials.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = getGoogleAuthUrl();
  };

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="page-shell__inner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div className="glass-card" style={{ padding: '2.5rem', width: '100%', maxWidth: '420px', margin: '2rem auto' }}>
            <header className="section-header" style={{ marginBottom: '1.75rem' }}>
              <span className="section-header__icon" aria-hidden="true" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}>🔐</span>
              <h1 className="section-header__title" style={{ fontSize: '1.75rem', fontWeight: '800' }}>Welcome Back</h1>
              <p className="section-header__subtitle" style={{ fontSize: '0.9rem' }}>Cinema is how we dream with our eyes open</p>
            </header>

            {infoMsg && (
              <div style={{ background: 'rgba(245, 197, 24, 0.1)', border: '1px solid var(--color-gold)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--color-gold)', textAlign: 'center', fontWeight: '600' }}>
                {infoMsg}
              </div>
            )}

            {errorMsg && (
              <div style={{ background: 'rgba(229, 9, 20, 0.1)', border: '1px solid var(--color-primary)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#ff4d4d', textAlign: 'center' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label htmlFor="email" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-muted)' }}>Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  disabled={loading}
                  style={{ padding: '0.75rem 1rem', background: '#0b0f19', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label htmlFor="password" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-muted)' }}>Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    style={{ padding: '0.75rem 3rem 0.75rem 1rem', background: '#0b0f19', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', width: '100%' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '0.75rem', background: 'transparent', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '1.1rem', padding: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn--primary primary-btn"
                style={{ width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.5rem 0', color: 'var(--color-muted)', fontSize: '0.8rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
              <span>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="btn btn--secondary secondary-btn"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ display: 'block' }}>
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.84-2.45 2.4l3.83 2.97c2.24-2.07 3.675-5.11 3.675-9.22z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.83-2.97c-1.08.73-2.48 1.16-4.1 1.16-3.15 0-5.81-2.13-6.76-5.01L1.31 17.2C3.26 21.09 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.24 14.27c-.24-.73-.38-1.5-.38-2.27s.14-1.54.38-2.27L1.31 6.76C.47 8.41 0 10.15 0 12s.47 3.59 1.31 5.24l3.93-2.97z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.91 1.31 6.76l3.93 2.97c.95-2.88 3.61-5.01 6.76-5.01z"/>
              </svg>
              Continue with Google
            </button>

            <p style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
              New to Cineza?{' '}
              <Link to="/signup" style={{ color: 'var(--color-gold)', fontWeight: '600' }}>
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
