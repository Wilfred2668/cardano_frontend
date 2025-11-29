import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface WalletContextType {
  walletAddress: string | undefined;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const WALLET_STORAGE_KEY = 'rize_wallet_address';

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const storedAddress = localStorage.getItem(WALLET_STORAGE_KEY);
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }
    setIsLoading(false);
  }, []);

  const connectWallet = async () => {
    // Placeholder implementation - will be replaced with actual Cardano wallet integration
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockAddress = 'addr1qxy...abc123def456';
    setWalletAddress(mockAddress);
    localStorage.setItem(WALLET_STORAGE_KEY, mockAddress);
  };

  const disconnectWallet = () => {
    setWalletAddress(undefined);
    localStorage.removeItem(WALLET_STORAGE_KEY);
    localStorage.removeItem('rize_did'); // Also clear DID
    localStorage.removeItem('rize_auth_token'); // Clear auth token
  };

  return (
    <WalletContext.Provider value={{ walletAddress, connectWallet, disconnectWallet, isLoading }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
