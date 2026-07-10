import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

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
        <Loader2 className="spinning-loader" style={{ animation: 'spin 1.5s linear infinite' }} size={48} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
