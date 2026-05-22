import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AuthSuccess() {
  const { handleAuthSuccess } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const processToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        setErrorMsg('Authentication token was missing. Please try logging in again.');
        return;
      }

      try {
        const res = await handleAuthSuccess(token);
        if (res.success) {
          // Redirect to profile page after setting states successfully
          navigate('/profile');
        } else {
          setErrorMsg(res.error || 'Failed to authenticate with Google.');
        }
      } catch (err) {
        setErrorMsg(err.message || 'An error occurred during Google sign in.');
      }
    };

    processToken();
  }, [handleAuthSuccess, navigate]);

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="page-shell__inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          {errorMsg ? (
            <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '480px', width: '100%', textAlign: 'center', margin: '2rem auto' }}>
              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1.25rem' }}>⚠️</span>
              <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem', fontWeight: '800' }}>Authentication Failed</h2>
              <p style={{ color: 'var(--color-muted)', marginBottom: '1.75rem', lineHeight: '1.6' }}>{errorMsg}</p>
              <button onClick={() => navigate('/login')} className="btn btn--primary primary-btn" style={{ width: '100%' }}>
                Back to Login
              </button>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '3.5rem', maxWidth: '480px', width: '100%', textAlign: 'center', margin: '2rem auto' }}>
              <span className="spinning-loader" style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1.5rem', animation: 'spin 2s linear infinite' }}>⏳</span>
              <h2 style={{ marginBottom: '1rem', fontWeight: '800', letterSpacing: '-0.01em' }}>Completing Sign In</h2>
              <p style={{ color: 'var(--color-muted)', lineHeight: '1.6' }}>Establishing secure session. You will be redirected to your profile shortly.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
