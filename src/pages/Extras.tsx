import { motion } from 'framer-motion';

export default function Extras() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 mt-20"
        >
          <svg className="w-20 h-20 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
          
          <div>
            <h1 className="text-4xl font-bold mb-4">Extras</h1>
            <p className="text-gray-400 text-lg">
              Additional features coming soon
            </p>
          </div>

          <div className="inline-block p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
            <p className="text-sm text-gray-500">
              This is a placeholder page for future functionality
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
