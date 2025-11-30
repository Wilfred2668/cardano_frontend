import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { createDid, loadDid, signWithDid, clearDid, hasDid, importDid, exportDid, downloadDidBackup } from '../wallet/did';
import { getChallenge, verifyAuthentication } from '../api/auth';
import { setAuthToken, clearAuthTokens, getAuthToken, isTokenExpired } from '../utils/apiClient';

interface AuthContextType {
  did: string | null;
  jwt: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  connectDid: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => void;
  importDidFromBackup: (did: string, privateKey: string) => void;
  exportDidBackup: () => void;
  downloadBackup: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [did, setDid] = useState<string | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing DID and JWT on mount
  useEffect(() => {
    const existingDid = loadDid();
    if (existingDid) {
      setDid(existingDid.did);
    }

    const existingJwt = getAuthToken();
    if (existingJwt) {
      // Check if token is expired
      if (isTokenExpired()) {
        console.log('Token expired on mount, clearing...');
        clearAuthTokens();
      } else {
        setJwt(existingJwt);
      }
    }
  }, []);

  /**
   * Connect/Create a DID if user doesn't have one.
   */
  const connectDid = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if DID already exists
      if (hasDid()) {
        const existingDid = loadDid();
        if (existingDid) {
          setDid(existingDid.did);
          return;
        }
      }

      // Create new DID
      const newDid = await createDid();
      setDid(newDid.did);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect DID';
      setError(errorMessage);
      console.error('Connect DID error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Complete DID-based login flow:
   * 1. Get challenge from backend
   * 2. Sign challenge with DID private key
   * 3. Send signature to backend for verification
   * 4. Receive and store JWT token
   */
  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Ensure we have a DID
      const didData = loadDid();
      if (!didData) {
        throw new Error('No DID found. Please create a DID first.');
      }

      // Step 1: Get challenge
      console.log('Requesting challenge for DID:', didData.did);
      const challengeResponse = await getChallenge(didData.did);
      console.log('Received challenge:', challengeResponse.challenge);

      // Step 2: Sign challenge
      console.log('Signing challenge with private key...');
      const signature = await signWithDid(
        challengeResponse.challenge,
        didData.privateKey
      );
      console.log('Challenge signed successfully');

      // Step 3: Verify authentication
      console.log('Verifying authentication with backend...');
      const authResponse = await verifyAuthentication({
        did: didData.did,
        challenge: challengeResponse.challenge,
        signature: signature,
      });

      console.log('Authentication successful!');

      // Step 4: Store JWT with expiry (default 24 hours if not provided by backend)
      setJwt(authResponse.access_token);
      setAuthToken(authResponse.access_token, 24 * 60 * 60); // 24 hours in seconds

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      console.error('Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout: Clear JWT but KEEP the DID for future logins.
   * DID is like your username - it should persist across sessions.
   * User can manually delete DID from browser settings if needed.
   */
  const logout = () => {
    // Don't delete DID - user can reuse it for next login
    // clearDid();
    // setDid(null);
    
    // Clear JWT token and expiry using apiClient utility
    setJwt(null);
    clearAuthTokens();
    setError(null);
  };

  /**
   * Import DID from backup (DID + private key).
   */
  const importDidFromBackup = (didString: string, privateKey: string) => {
    try {
      setIsLoading(true);
      const imported = importDid(didString, privateKey);
      setDid(imported.did);
      setError(null);
      console.log('DID imported successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import DID';
      setError(errorMessage);
      console.error('Import DID error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Export DID for backup (returns DID data).
   */
  const exportDidBackup = () => {
    const didData = exportDid();
    if (!didData) {
      setError('No DID found to export');
      return;
    }
    return didData;
  };

  /**
   * Download DID backup as JSON file.
   */
  const downloadBackup = () => {
    try {
      downloadDidBackup();
      console.log('DID backup downloaded');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download backup';
      setError(errorMessage);
      console.error('Download backup error:', err);
    }
  };

  const value: AuthContextType = {
    did,
    jwt,
    isAuthenticated: !!jwt,
    isLoading,
    error,
    connectDid,
    login,
    logout,
    importDidFromBackup,
    exportDidBackup,
    downloadBackup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
