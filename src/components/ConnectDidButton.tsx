import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { motion } from 'framer-motion';

const ConnectDidButton = () => {
  const { did, connectDid, isLoading, error } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);

  const handleConnect = async () => {
    setLocalLoading(true);
    try {
      await connectDid();
    } finally {
      setLocalLoading(false);
    }
  };

  if (did) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center space-x-3 px-4 py-2 bg-green-900/20 border border-green-800 rounded-lg"
      >
        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-400">DID Connected</div>
          <div className="text-sm font-mono text-green-400 truncate">
            {did.slice(0, 20)}...{did.slice(-10)}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleConnect}
        disabled={isLoading || localLoading}
        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-white text-black rounded-lg font-semibold transition-colors hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading || localLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Creating DID...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Create DID</span>
          </>
        )}
      </motion.button>
      {error && (
        <div className="text-sm text-red-400 text-center">{error}</div>
      )}
    </div>
  );
};

export default ConnectDidButton;
