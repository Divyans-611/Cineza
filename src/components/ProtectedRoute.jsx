import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

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
        <Loader2 className="spinning-loader" style={{ animation: 'spin 1.5s linear infinite' }} size={48} />
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
