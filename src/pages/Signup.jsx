import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Clapperboard, Eye, EyeOff } from 'lucide-react';

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
        <div className="page-shell__inner auth-wrapper">
          <div className="glass-card auth-card">
            <header className="section-header auth-header" style={{ marginBottom: '1.75rem' }}>
              <span className="section-header__icon" aria-hidden="true" style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}><Clapperboard size={40} color="var(--color-primary)" /></span>
              <h1 className="section-header__title" style={{ fontSize: '1.75rem', fontWeight: '800' }}>Join Cineza</h1>
              <p className="section-header__subtitle" style={{ fontSize: '0.9rem' }}>Create a profile to unlock cinematic achievements</p>
            </header>

            {errorMsg && (
              <div className="alert-box alert-box--error">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field-row">
                <div className="auth-field-col">
                  <label htmlFor="name" className="auth-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    disabled={loading}
                    className="auth-input"
                  />
                </div>
                <div className="auth-field-col">
                  <label htmlFor="username" className="auth-label">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="janedoe"
                    required
                    disabled={loading}
                    className="auth-input"
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <label htmlFor="email" className="auth-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  disabled={loading}
                  className="auth-input"
                />
              </div>

              <div className="auth-field-group">
                <label htmlFor="password" className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    disabled={loading}
                    className="auth-input"
                    style={{ paddingRight: '3rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-toggle-btn"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <div className="auth-field-group">
                <label htmlFor="confirmPassword" className="auth-label">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  disabled={loading}
                  className="auth-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn--primary primary-btn auth-submit-btn"
                style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <p className="auth-redirect-text">
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
