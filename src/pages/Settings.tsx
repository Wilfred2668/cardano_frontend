import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';

export default function Settings() {
  const { did } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto">
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
                  <button className="p-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Your unique identifier on the Cardano blockchain
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-white focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Will be stored in backend (not implemented yet)
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-white focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Will be stored in backend (not implemented yet)
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary px-6 py-3"
                disabled
              >
                Save Changes
              </motion.button>
              <p className="text-xs text-gray-500 mt-3">
                Settings functionality will be implemented with backend integration
              </p>
            </div>
          </div>

          {/* Account Actions Card */}
          <div className="card space-y-4">
            <h2 className="text-xl font-semibold">Account Actions</h2>
            
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-left flex items-center justify-between">
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

              <button className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-left flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span>Change Password</span>
                </div>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
