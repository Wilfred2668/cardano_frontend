import { Navigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../auth/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { walletAddress } = useWallet();
  const { isAuthenticated } = useAuth();

  // Require both wallet connection and JWT authentication
  if (!walletAddress || !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
