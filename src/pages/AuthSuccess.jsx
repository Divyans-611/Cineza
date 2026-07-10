import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function AuthSuccess() {
  const { handleAuthSuccess } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const processToken = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (!token) {
          setErrorMsg('Authentication token was missing. Please try logging in again.');
          return;
        }

        // Call context success handler to save token and load profile
        const res = await handleAuthSuccess(token);
        
        if (res.success) {
          // Erase url query string by replacing navigation stack cleanly
          navigate('/profile', { replace: true });
        } else {
          setErrorMsg(res.error || 'Google Authentication failed. Please try again.');
        }
      } catch (err) {
        console.error('Google Auth Success component crash:', err);
        setErrorMsg('Something went wrong during sign in. Please try again.');
      }
    };

    processToken();
  }, [location, handleAuthSuccess, navigate]);

  return (
    <div className="auth-success-container">
      <div className="glass-card auth-success-card">
        {errorMsg ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <AlertTriangle size={56} color="var(--color-primary)" />
            </div>
            <h1 style={{ color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>
              Authentication Failed
            </h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '2rem' }}>
              {errorMsg}
            </p>
            <button 
              onClick={() => navigate('/login', { replace: true })}
              className="btn btn--primary primary-btn"
              style={{ width: '100%', padding: '0.75rem' }}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Loader2 className="spinning-loader" style={{ animation: 'spin 1.5s linear infinite' }} size={64} color="var(--color-gold)" />
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em', color: 'var(--color-gold)' }}>
              Completing Sign In
            </h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: 0 }}>
              Establishing secure session. You will be redirected to your profile shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
