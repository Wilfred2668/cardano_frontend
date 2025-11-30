import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';
import { useToast } from '../contexts/ToastContext';

export default function Settings() {
  const { showToast } = useToast();
  const { did } = useAuth();
  const [userName, setUserName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  // Fetch data from localStorage on mount
  useEffect(() => {
    const profileData = localStorage.getItem('rize_user_profile');
    if (profileData) {
      const profile = JSON.parse(profileData);
      setUserName(profile.userName || '');
    }

    const cardanoAddress = localStorage.getItem('cardano_wallet_address');
    if (cardanoAddress) {
      setWalletAddress(cardanoAddress);
    }
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`, 'success');
  };

  const handleExportDID = () => {
    if (!did) {
      showToast('No DID available to export', 'error');
      return;
    }

    const didData = {
      did: did,
      userName: userName,
      walletAddress: walletAddress,
      exportedAt: new Date().toISOString(),
      network: 'Preprod'
    };

    const dataStr = JSON.stringify(didData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `did-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('DID backup downloaded successfully!', 'success');
  };  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AnimatedBackground />
      <div className="max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold mb-2">Settings</h1>
            <p className="text-gray-400">Manage your account and preferences</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Information Card */}
            <div className="card space-y-6">
            <h2 className="text-xl font-semibold">User Information</h2>

            <div className="space-y-4">
              {/* DID */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Decentralized Identity (DID)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={did || 'Not connected'}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg font-mono text-sm text-gray-400"
                  />
                  <button 
                    onClick={() => did && copyToClipboard(did, 'DID')}
                    disabled={!did}
                    className="p-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Your unique identifier on the Cardano blockchain
                </p>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={userName}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-400"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Your display name
                </p>
              </div>

              {/* Wallet Address */}
              {walletAddress && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Connected Wallet Address
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={walletAddress}
                      readOnly
                      className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg font-mono text-xs text-gray-400"
                    />
                    <button 
                      onClick={() => copyToClipboard(walletAddress, 'Wallet address')}
                      className="p-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Your Cardano Preprod testnet address
                  </p>
                </div>
              )}
            </div>
            </div>

            {/* Account Actions Card */}
            <div className="card space-y-4">
                <h2 className="text-xl font-semibold">Account Actions</h2>
              
              <div className="space-y-3">
                <button 
                onClick={handleExportDID}
                disabled={!did}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <span>Export DID Backup</span>
                </div>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
