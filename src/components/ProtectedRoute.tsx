import { Navigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { walletAddress } = useWallet();

  if (!walletAddress) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
