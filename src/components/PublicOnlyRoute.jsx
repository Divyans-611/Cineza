import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route guard that prevents logged-in users from accessing authentication pages (e.g. Login, Signup).
 * If authenticated, redirects straight to /profile.
 */
export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '80vh', 
          color: 'var(--color-gold)'
        }}
      >
        <span className="spinning-loader" style={{ fontSize: '3rem', animation: 'spin 2s linear infinite' }}>⏳</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
