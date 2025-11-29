import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const existingCampaigns = [
    { id: 1, title: 'Summer Sale 2025', icon: '📊' },
    { id: 2, title: 'Product Launch', icon: '🚀' },
    { id: 3, title: 'Brand Awareness', icon: '💡' },
    { id: 4, title: 'Holiday Special', icon: '🎁' },
  ];

  // Get profile from localStorage
  const profileData = localStorage.getItem('rize_user_profile');
  const profile = profileData ? JSON.parse(profileData) : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Welcome back, {profile?.userName || 'User'}</h1>
          <p className="text-gray-400">Manage your campaigns and track performance</p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Create Campaign Card - Big */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/stats')}
            className="md:col-span-2 lg:col-span-1 card cursor-pointer bg-gradient-to-br from-gray-900 to-black border-gray-700 hover:border-white transition-all min-h-[200px] flex flex-col justify-center items-center space-y-4"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-1">Create Campaign</h3>
              <p className="text-gray-400 text-sm">Start a new marketing campaign</p>
            </div>
          </motion.div>

          {/* Existing Campaigns */}
          {existingCampaigns.map((campaign) => (
            <motion.div
              key={campaign.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              className="card border-gray-800 hover:border-gray-600 transition-all min-h-[200px] flex flex-col justify-center items-center space-y-3"
            >
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-center">
                <h3 className="font-semibold mb-1">{campaign.title}</h3>
                <p className="text-gray-500 text-xs">View campaign details</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
