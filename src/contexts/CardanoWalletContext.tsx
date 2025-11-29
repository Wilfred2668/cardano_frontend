import React, { createContext, useContext, useState } from 'react';
import { Lucid, Koios, type LucidEvolution } from '@lucid-evolution/lucid';

interface CardanoWalletState {
  lucid: LucidEvolution | null;
  address: string | null;
  connected: boolean;
  connecting: boolean;
}

interface CardanoWalletContextType extends CardanoWalletState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const CardanoWalletContext = createContext<CardanoWalletContextType | undefined>(undefined);

export const CardanoWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CardanoWalletState>({
    lucid: null,
    address: null,
    connected: false,
    connecting: false
  });

  const connectWallet = async () => {
    setState(prev => ({ ...prev, connecting: true }));

    try {
      // Check if Eternl wallet is installed
      const cardano = (window as any).cardano;
      if (!cardano || !cardano.eternl) {
        throw new Error('Eternl wallet not found. Please install Eternl browser extension.');
      }

      // Enable Eternl wallet
      const api = await cardano.eternl.enable();

      // Initialize Lucid with Koios provider (free, no API key needed)
      const lucid = await Lucid(
        new Koios('https://preview.koios.rest/api/v1'),
        'Preview'
      );

      // Select wallet
      lucid.selectWallet.fromAPI(api);

      // Get wallet address
      const address = await lucid.wallet().address();

      setState({
        lucid,
        address,
        connected: true,
        connecting: false
      });

      console.log('Wallet connected:', address);
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setState(prev => ({ ...prev, connecting: false }));
      throw error;
    }
  };

  const disconnectWallet = () => {
    setState({
      lucid: null,
      address: null,
      connected: false,
      connecting: false
    });
  };

  return (
    <CardanoWalletContext.Provider
      value={{
        ...state,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </CardanoWalletContext.Provider>
  );
};

export const useCardanoWallet = () => {
  const context = useContext(CardanoWalletContext);
  if (!context) {
    throw new Error('useCardanoWallet must be used within CardanoWalletProvider');
  }
  return context;
};
