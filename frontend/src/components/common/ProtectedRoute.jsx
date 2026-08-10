import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium text-sm">Authenticating HealthPoint Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (role || user?.role || 'MEMBER').toUpperCase();
    const hasRole = allowedRoles.some(r => r.toUpperCase() === userRole);
    
    if (!hasRole) {
      if (userRole === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
      if (userRole === 'TRAINER') return <Navigate to="/trainer/dashboard" replace />;
      return <Navigate to="/member/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
