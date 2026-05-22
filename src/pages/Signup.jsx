import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Signup() {
  const { register, clearAuthError, error } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Clear authentication error states on mount
  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  // Sync state with global authentication errors
  useEffect(() => {
    if (error) {
      setErrorMsg(error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Strict frontend validations
    if (!name.trim()) {
      setErrorMsg('Name is required.');
      return;
    }
    if (!username.trim()) {
      setErrorMsg('Username is required.');
      return;
    }
    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await register({ name, username, email, password });
      if (res.success) {
        navigate('/profile', { replace: true });
      } else {
        setErrorMsg(res.error || 'Failed to register.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="page-shell__inner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
          <div className="glass-card" style={{ padding: '2.5rem', width: '100%', maxWidth: '440px', margin: '2rem auto' }}>
            <header className="section-header" style={{ marginBottom: '1.75rem' }}>
              <span className="section-header__icon" aria-hidden="true" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}>🎬</span>
              <h1 className="section-header__title" style={{ fontSize: '1.75rem', fontWeight: '800' }}>Join Cineza</h1>
              <p className="section-header__subtitle" style={{ fontSize: '0.9rem' }}>Create a profile to unlock cinematic achievements</p>
            </header>

            {errorMsg && (
              <div style={{ background: 'rgba(229, 9, 20, 0.1)', border: '1px solid var(--color-primary)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#ff4d4d', textAlign: 'center' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                  <label htmlFor="name" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-muted)' }}>Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    disabled={loading}
                    style={{ padding: '0.75rem 1rem', background: '#0b0f19', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', width: '100%' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                  <label htmlFor="username" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-muted)' }}>Username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="janedoe"
                    required
                    disabled={loading}
                    style={{ padding: '0.75rem 1rem', background: '#0b0f19', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', width: '100%' }}
                  />
                </div>
              </div>

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
                    placeholder="Min. 6 characters"
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label htmlFor="confirmPassword" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-muted)' }}>Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  disabled={loading}
                  style={{ padding: '0.75rem 1rem', background: '#0b0f19', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn--primary primary-btn"
                style={{ width: '100%', marginTop: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <p style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--color-gold)', fontWeight: '600' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
