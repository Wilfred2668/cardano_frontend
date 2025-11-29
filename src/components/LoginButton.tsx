import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { motion } from 'framer-motion';

const LoginButton = () => {
  const { did, login, isLoading, error } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLocalLoading(true);
    setLocalError(null);
    
    try {
      await login();
      // Navigate to dashboard on successful login
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLocalLoading(false);
    }
  };

  if (!did) {
    return (
      <div className="text-sm text-gray-500 text-center">
        Please create a DID first
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogin}
        disabled={isLoading || localLoading}
        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg font-semibold border border-gray-700 transition-colors hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading || localLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Authenticating...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span>Sign In with DID</span>
          </>
        )}
      </motion.button>
      
      {(error || localError) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-900/20 border border-red-800 rounded text-sm text-red-400"
        >
          {localError || error}
        </motion.div>
      )}
    </div>
  );
};

export default LoginButton;
