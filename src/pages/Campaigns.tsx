import { motion } from 'framer-motion';

export default function Stats() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 mt-20"
        >
          <svg className="w-20 h-20 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          
          <div>
            <h1 className="text-4xl font-bold mb-4">Stats</h1>
            <p className="text-gray-400 text-lg">
              Analytics and statistics will be implemented later.
            </p>
          </div>

          <div className="inline-block p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
            <p className="text-sm text-gray-500">
              Coming soon: View detailed analytics and performance metrics
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
