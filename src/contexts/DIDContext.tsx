import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface DIDContextType {
  did: string | undefined;
  generateDid: () => Promise<void>;
  initDid: (walletAddress: string) => Promise<void>;
}

const DIDContext = createContext<DIDContextType | undefined>(undefined);

const DID_STORAGE_KEY = 'rize_did';

// Simple hash function for mock DID generation
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

export const DIDProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [did, setDid] = useState<string | undefined>(undefined);

  const generateDid = async () => {
    // Placeholder implementation - will be replaced with actual DID generation
    await new Promise(resolve => setTimeout(resolve, 800));
    const randomHash = Math.random().toString(36).substring(2, 15);
    const mockDid = `did:rize:${randomHash}`;
    setDid(mockDid);
    localStorage.setItem(DID_STORAGE_KEY, mockDid);
  };

  const initDid = async (walletAddress: string) => {
    // Generate DID based on wallet address (mock strategy)
    await new Promise(resolve => setTimeout(resolve, 500));
    const hash = simpleHash(walletAddress);
    const didIdentifier = `did:rize:${hash}`;
    setDid(didIdentifier);
    localStorage.setItem(DID_STORAGE_KEY, didIdentifier);
  };

  useEffect(() => {
    // Restore DID from localStorage on mount
    const storedDid = localStorage.getItem(DID_STORAGE_KEY);
    if (storedDid) {
      setDid(storedDid);
    }
  }, []);

  return (
    <DIDContext.Provider value={{ did, generateDid, initDid }}>
      {children}
    </DIDContext.Provider>
  );
};

export const useDID = () => {
  const context = useContext(DIDContext);
  if (context === undefined) {
    throw new Error('useDID must be used within a DIDProvider');
  }
  return context;
};
