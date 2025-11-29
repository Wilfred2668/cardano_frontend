import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useDID } from '../contexts/DIDContext';
import ZKProofBadge from './ZKProofBadge';

const TechnicalInfoPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { walletAddress } = useWallet();
  const { did } = useDID();

  // Mock IPFS hash for demo
  const ipfsHash = 'QmX7fZdKjH9tR3vBpQz2wN5mYx4sLk8aP9';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
    console.log(`${label} copied to clipboard`);
  };

  return (
    <div data-technical-panel>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-white text-black rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </motion.svg>
        <span className="absolute -top-10 right-0 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Technical Info
        </span>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-black border-l border-gray-800 z-50 overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Technical Details</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-lg hover:bg-gray-900 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* API Mode Badge */}
                <div className="card bg-gray-900/50 border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse" />
                    <div>
                      <div className="text-sm text-gray-400">API Mode</div>
                      <div className="font-semibold text-gray-400">Demo / Mock Data</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    All data is simulated. No real blockchain transactions are being made.
                  </p>
                </div>

                {/* Wallet Address */}
                <div className="card">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-400">Wallet Address</div>
                    <button
                      onClick={() => copyToClipboard(walletAddress || '', 'Wallet Address')}
                      className="text-xs text-gray-500 hover:text-white transition-colors flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copy</span>
                    </button>
                  </div>
                  <code className="text-xs text-white font-mono break-all bg-gray-900 p-3 rounded block">
                    {walletAddress || 'Not connected'}
                  </code>
                </div>

                {/* DID */}
                <div className="card">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-400">Decentralized ID (DID)</div>
                    <button
                      onClick={() => copyToClipboard(did || '', 'DID')}
                      className="text-xs text-gray-500 hover:text-white transition-colors flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copy</span>
                    </button>
                  </div>
                  <code className="text-xs text-white font-mono break-all bg-gray-900 p-3 rounded block">
                    {did || 'Not initialized'}
                  </code>
                </div>

                {/* IPFS Hash */}
                <div className="card">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-400">Campaign Data (IPFS)</div>
                    <button
                      onClick={() => copyToClipboard(ipfsHash, 'IPFS Hash')}
                      className="text-xs text-gray-500 hover:text-white transition-colors flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copy</span>
                    </button>
                  </div>
                  <code className="text-xs text-white font-mono break-all bg-gray-900 p-3 rounded block">
                    {ipfsHash}
                  </code>
                  <p className="text-xs text-gray-500 mt-2">
                    Campaign strategies are stored on IPFS for transparency and immutability.
                  </p>
                </div>

                {/* ZK Proof Status */}
                <div className="card">
                  <div className="text-sm text-gray-400 mb-3">Zero-Knowledge Proof Status</div>
                  <ZKProofBadge verified={true} />
                  <p className="text-xs text-gray-500 mt-3">
                    ZK proofs verify campaign performance without revealing sensitive data.
                  </p>
                </div>

                {/* Auth Token Info */}
                <div className="card">
                  <div className="text-sm text-gray-400 mb-2">Authentication</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Token Status</span>
                      <span className="text-green-400">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Session</span>
                      <span className="text-white">Persisted</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Expires</span>
                      <span className="text-white">24 hours</span>
                    </div>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="card">
                  <div className="text-sm text-gray-400 mb-3">Technology Stack</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-900 p-2 rounded">
                      <div className="text-gray-500">Blockchain</div>
                      <div className="font-medium">Cardano</div>
                    </div>
                    <div className="bg-gray-900 p-2 rounded">
                      <div className="text-gray-500">Storage</div>
                      <div className="font-medium">IPFS</div>
                    </div>
                    <div className="bg-gray-900 p-2 rounded">
                      <div className="text-gray-500">Identity</div>
                      <div className="font-medium">DID</div>
                    </div>
                    <div className="bg-gray-900 p-2 rounded">
                      <div className="text-gray-500">Privacy</div>
                      <div className="font-medium">ZK-SNARKs</div>
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="text-xs text-gray-600 text-center pt-4 border-t border-gray-900">
                  This is a demonstration environment. Real blockchain integration coming soon.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TechnicalInfoPanel;
