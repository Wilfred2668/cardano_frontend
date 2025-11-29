import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRouteDID = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRouteDID;
