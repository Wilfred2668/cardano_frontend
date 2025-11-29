import { motion } from 'framer-motion';
import ConnectDidButton from '../components/ConnectDidButton';
import LoginButton from '../components/LoginButton';
import DIDBackup from '../components/DIDBackup';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Hero Section */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="mb-6"
          >
            <div className="text-6xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              RIZE
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wider mt-2">
              Autonomous Marketing Platform
            </div>
          </motion.div>

          <h1 className="text-3xl font-bold mb-3">
            DID-Based Authentication
          </h1>
          <p className="text-gray-400 text-lg">
            Powered by Hyperledger Identus
          </p>
        </div>

        {/* Authentication Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">Get Started</h2>
            <p className="text-sm text-gray-400">
              Create your decentralized identity and sign in securely
            </p>
          </div>

          {/* Step 1: Create/Connect DID */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div className="text-sm font-medium text-gray-300">Create your DID</div>
            </div>
            <ConnectDidButton />
          </div>

          {/* Step 2: Sign In */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div className="text-sm font-medium text-gray-300">Sign in with your DID</div>
            </div>
            <LoginButton />
          </div>

          {/* Backup/Import Section */}
          <div className="mt-6">
            <DIDBackup />
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs text-gray-400 space-y-1">
                <p className="font-medium text-gray-300">How it works:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Your DID is stored locally in your browser</li>
                  <li>No passwords or personal data required</li>
                  <li>Cryptographic signatures verify your identity</li>
                  <li>Full control over your digital identity</li>
                  <li>Backup your DID to restore on other devices</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-600">
          <p>Using Hyperledger Identus for decentralized identity</p>
          <p className="mt-1">Ed25519 cryptographic signatures • Zero-knowledge authentication</p>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
