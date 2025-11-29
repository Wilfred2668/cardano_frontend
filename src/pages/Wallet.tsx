import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Wallet() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = () => {
    setIsConnecting(true);
    // Placeholder - no actual connection yet
    setTimeout(() => {
      setIsConnecting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold mb-2">Wallet</h1>
            <p className="text-gray-400">Connect your Cardano wallet to manage assets</p>
          </div>

          {/* Connect Wallet Card */}
          <div className="max-w-2xl">
            <div className="card space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Eternl Wallet</h2>
                  <p className="text-gray-400 text-sm">Connect to access your Cardano assets</p>
                </div>
              </div>

              <motion.button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center space-x-2"
              >
                {isConnecting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Connect Eternl Wallet</span>
                  </>
                )}
              </motion.button>

              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-500">
                  <strong className="text-gray-400">Note:</strong> Wallet integration is not yet implemented. 
                  This is a placeholder for the Connect Eternl Wallet functionality.
                </p>
              </div>
            </div>
          </div>

          {/* Wallet Info (Placeholder) */}
          <div className="max-w-2xl">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Wallet Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Status</span>
                  <span className="text-gray-500">Not Connected</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Balance</span>
                  <span className="text-gray-500">—</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Address</span>
                  <span className="text-gray-500">—</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
