import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCampaign, type PendingCampaign } from '../contexts/CampaignContext';
import PaymentModal from '../components/PaymentModal';
import { useDID } from '../contexts/DIDContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { pendingCampaigns, removePendingCampaign, submitCampaign } = useCampaign();
  const { did } = useDID();
  const [selectedCampaign, setSelectedCampaign] = useState<PendingCampaign | null>(null);
  const [paymentCampaign, setPaymentCampaign] = useState<PendingCampaign | null>(null);

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
            onClick={() => navigate('/create-campaign')}
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

          {/* Pending Campaigns (Awaiting Payment) */}
          {pendingCampaigns.filter(c => c.status === 'pending_payment').map((campaign) => (
            <motion.div
              key={campaign.id}
              variants={itemVariants}
              onClick={() => setSelectedCampaign(campaign)}
              className="card border-gray-700 bg-gray-900/50 transition-all min-h-[200px] flex flex-col justify-between p-6 relative cursor-pointer hover:border-white"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Are you sure you want to delete this campaign?')) {
                    removePendingCampaign(campaign.id);
                  }
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3 pr-8">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 truncate">{campaign.campaign_name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{campaign.campaign_description}</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded-full whitespace-nowrap ml-2">Pending</span>
                </div>
                <div className="space-y-1 text-sm text-gray-500">
                  {campaign.budget && (
                    <p>Budget: <span className="text-white font-medium">₳{parseFloat(campaign.budget).toLocaleString()}</span></p>
                  )}
                  {campaign.duration_days && (
                    <p>Duration: <span className="text-white">{campaign.duration_days} days</span></p>
                  )}
                  {campaign.target_audience && (
                    <p className="truncate">Target: <span className="text-white">{campaign.target_audience}</span></p>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPaymentCampaign(campaign);
                }}
                className="w-full mt-4 bg-white hover:bg-gray-200 text-black font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Complete Payment
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Payment Modal */}
      {paymentCampaign && (
        <PaymentModal
          isOpen={true}
          onClose={() => setPaymentCampaign(null)}
          campaign={paymentCampaign}
          onSuccess={async (txHash) => {
            if (!did) {
              alert('DID not found. Please connect your wallet first.');
              return;
            }
            try {
              await submitCampaign(paymentCampaign.id, txHash, did);
              setPaymentCampaign(null);
              alert('Campaign submitted successfully!');
            } catch (error) {
              console.error('Failed to submit campaign:', error);
              alert('Failed to submit campaign. Please try again.');
            }
          }}
        />
      )}

      {/* Campaign Detail Modal */}
      <AnimatePresence>
        {selectedCampaign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCampaign(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{selectedCampaign.campaign_name}</h2>
                  <span className="px-3 py-1 text-xs bg-gray-800 text-gray-400 rounded-full">Pending Payment</span>
                </div>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="text-gray-400 hover:text-white transition-colors ml-4"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                  <p className="text-white">{selectedCampaign.campaign_description}</p>
                </div>

                {/* Campaign Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Budget</h3>
                    <p className="text-xl font-bold text-white">₳{parseFloat(selectedCampaign.budget).toLocaleString()} ADA</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Duration</h3>
                    <p className="text-xl font-bold text-white">{selectedCampaign.duration_days} days</p>
                  </div>
                </div>

                {/* Objective */}
                {selectedCampaign.campaign_objective && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Campaign Objective</h3>
                    <p className="text-white">{selectedCampaign.campaign_objective}</p>
                  </div>
                )}

                {/* Target Audience */}
                {selectedCampaign.target_audience && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Target Audience</h3>
                    <p className="text-white">{selectedCampaign.target_audience}</p>
                  </div>
                )}

                {/* Instructions */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Campaign Instructions</h3>
                  <p className="text-white whitespace-pre-wrap">{selectedCampaign.input_text}</p>
                </div>

                {/* Created At */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Created</h3>
                  <p className="text-white">{new Date(selectedCampaign.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-6 flex gap-3">
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this campaign?')) {
                      removePendingCampaign(selectedCampaign.id);
                      setSelectedCampaign(null);
                    }
                  }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Delete Campaign
                </button>
                <button
                  onClick={() => {
                    setPaymentCampaign(selectedCampaign);
                    setSelectedCampaign(null);
                  }}
                  className="flex-1 bg-white hover:bg-gray-200 text-black font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Complete Payment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
