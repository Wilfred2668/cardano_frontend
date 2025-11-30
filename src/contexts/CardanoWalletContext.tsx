import React, { createContext, useContext, useState } from 'react';
import { Lucid, Blockfrost, type LucidEvolution } from '@lucid-evolution/lucid';

interface CardanoWalletState {
  lucid: LucidEvolution | null;
  address: string | null;
  connected: boolean;
  connecting: boolean;
  walletApi: any | null;
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
    connecting: false,
    walletApi: null
  });

  // Auto-reconnect on mount if wallet was previously connected
  React.useEffect(() => {
    const autoReconnect = async () => {
      const savedAddress = localStorage.getItem('cardano_wallet_address');
      if (savedAddress) {
        try {
          await connectWallet();
        } catch (error) {
          console.log('Auto-reconnect failed:', error);
          localStorage.removeItem('cardano_wallet_address');
        }
      }
    };
    autoReconnect();
  }, []);

  const connectWallet = async () => {
    setState(prev => ({ ...prev, connecting: true }));

    try {
      // Check if Eternl wallet is installed
      const cardano = (window as any).cardano;
      if (!cardano || !cardano.eternl) {
        throw new Error('Eternl wallet not found. Please install Eternl browser extension.');
      }

      // Check if wallet is already enabled
      const isEnabled = await cardano.eternl.isEnabled();
      console.log('Wallet already enabled:', isEnabled);

      // Enable Eternl wallet (this will prompt user if not already enabled)
      const api = await cardano.eternl.enable();
      console.log('Wallet API enabled:', api);

      // Initialize Lucid with Blockfrost provider
      const lucid = await Lucid(
        new Blockfrost(
          'https://cardano-preprod.blockfrost.io/api/v0',
          'preprod2h4kWjYDXOimqTbfPwr0Vxs3eslDxRd9'
        ),
        'Preprod'
      );

      // Select wallet
      lucid.selectWallet.fromAPI(api);

      // Get wallet address
      const address = await lucid.wallet().address();

      setState({
        lucid,
        address,
        connected: true,
        connecting: false,
        walletApi: api
      });

      // Save to localStorage for auto-reconnect
      localStorage.setItem('cardano_wallet_address', address);

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
      connecting: false,
      walletApi: null
    });
    
    // Remove from localStorage
    localStorage.removeItem('cardano_wallet_address');
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
