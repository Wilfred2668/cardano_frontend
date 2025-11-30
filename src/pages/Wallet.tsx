import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useCardanoWallet } from '../contexts/CardanoWalletContext';
import AnimatedBackground from '../components/AnimatedBackground';
import { useToast } from '../contexts/ToastContext';

export default function Wallet() {
  const { showToast } = useToast();
  const { lucid, address, connected, connecting, connectWallet, disconnectWallet } = useCardanoWallet();
  const [balance, setBalance] = useState<string>('0');
  const [loadingBalance, setLoadingBalance] = useState(false);

  // Fetch balance when wallet is connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (lucid && address) {
        setLoadingBalance(true);
        try {
          const utxos = await lucid.wallet().getUtxos();
          const totalLovelace = utxos.reduce((sum, utxo) => {
            return sum + (utxo.assets.lovelace || 0n);
          }, 0n);
          const ada = Number(totalLovelace) / 1_000_000;
          setBalance(ada.toFixed(2));
        } catch (error) {
          console.error('Failed to fetch balance:', error);
          setBalance('Error');
        } finally {
          setLoadingBalance(false);
        }
      }
    };

    fetchBalance();
  }, [lucid, address]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      showToast('Failed to connect wallet: ' + error.message, 'error');
    }
  };

  const handleDisconnect = () => {
    if (confirm('Are you sure you want to disconnect your wallet?')) {
      disconnectWallet();
      setBalance('0');
    }
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 15)}...${addr.slice(-15)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Address copied to clipboard!', 'success');
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AnimatedBackground />
      <div className="max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4">
            <img src="/crypto.svg" alt="Crypto" className="w-16 h-16 opacity-70" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Wallet</h1>
              <p className="text-gray-400">Connect your Cardano wallet to manage assets</p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wallet Connection Card */}
            <div className="card space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Eternl Wallet</h2>
                    <p className="text-gray-400 text-sm">
                      {connected ? 'Connected to Preprod Testnet' : 'Connect to access your Cardano assets'}
                    </p>
                  </div>
                </div>
                {connected && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">Connected</span>
                  </div>
                )}
              </div>

              {!connected ? (
                <motion.button
                  onClick={handleConnectWallet}
                  disabled={connecting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white hover:bg-gray-200 text-black font-medium py-4 text-lg rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {connecting ? (
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
              ) : (
                <motion.button
                  onClick={handleDisconnect}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-4 text-lg rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Disconnect Wallet</span>
                </motion.button>
              )}

              {!connected && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-400">
                    <strong className="text-white">Note:</strong> Make sure you have Eternl browser extension installed and your wallet is set to Preprod Testnet.
                  </p>
                </div>
              )}
            </div>

            {/* Wallet Info */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Wallet Information</h3>
              <div className="space-y-3">
                {/* Status */}
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Status</span>
                  <div className="flex items-center space-x-2">
                    {connected ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-400 font-medium">Connected</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        <span className="text-gray-500">Not Connected</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Balance */}
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Balance</span>
                  <div className="flex items-center space-x-2">
                    {connected ? (
                      loadingBalance ? (
                        <svg className="w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <span className="text-white font-bold text-lg">₳{balance} ADA</span>
                      )
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </div>
                </div>

                {/* Network */}
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Network</span>
                  <span className={connected ? "text-white font-medium" : "text-gray-500"}>
                    {connected ? 'Preprod Testnet' : '—'}
                  </span>
                </div>

                {/* Address */}
                <div className="py-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-400">Address</span>
                    {connected && address && (
                      <button
                        onClick={() => copyToClipboard(address)}
                        className="text-xs text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Copy</span>
                      </button>
                    )}
                  </div>
                  {connected && address ? (
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                      <code className="text-xs text-white font-mono break-all">{address}</code>
                    </div>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
