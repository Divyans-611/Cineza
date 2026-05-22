import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * A handy component to easily protect any routes in the application.
 * If the user is not logged in, they are redirected to /login.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', color: 'var(--color-gold)' }}>
        <span className="spinning-loader" style={{ fontSize: '3rem', animation: 'spin 2s linear infinite' }}>⏳</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
