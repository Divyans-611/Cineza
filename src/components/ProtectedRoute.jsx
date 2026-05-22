import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route guard for routes that require an authenticated user session.
 * If user details are loading, renders a premium loading state.
 * If not logged in, redirects to /login while saving the current URL in location state.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '80vh', 
          color: 'var(--color-gold)',
          gap: '1rem'
        }}
      >
        <span className="spinning-loader" style={{ fontSize: '3.5rem', animation: 'spin 2s linear infinite' }}>⏳</span>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', fontWeight: '500', letterSpacing: '0.02em' }}>
          Loading your Cineza profile...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
