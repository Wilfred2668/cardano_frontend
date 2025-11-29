import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCampaign } from '../contexts/CampaignContext';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { addPendingCampaign } = useCampaign();
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    campaign_name: '',
    campaign_description: '',
    campaign_objective: '',
    target_audience: '',
    budget: '',
    duration_days: '',
    input_text: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Store campaign locally (not sent to backend yet)
      addPendingCampaign({
        campaign_name: formData.campaign_name,
        campaign_description: formData.campaign_description,
        campaign_objective: formData.campaign_objective,
        target_audience: formData.target_audience,
        budget: formData.budget,
        duration_days: formData.duration_days,
        input_text: formData.input_text
      });

      // Redirect to dashboard to show the pending campaign
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error saving campaign:', err);
      setError('Failed to save campaign');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold mb-2">Create New Campaign</h1>
          <p className="text-gray-400">Fill in the details to launch your campaign</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Campaign Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="campaign_name"
              value={formData.campaign_name}
              onChange={handleChange}
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-white transition-colors"
              placeholder="e.g., Summer Product Launch 2025"
            />
          </div>

          {/* Campaign Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Campaign Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="campaign_description"
              value={formData.campaign_description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-white transition-colors resize-none"
              placeholder="Brief overview of your campaign..."
            />
          </div>

          {/* Grid Layout for Multiple Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campaign Objective */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Campaign Objective <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="campaign_objective"
                value={formData.campaign_objective}
                onChange={handleChange}
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-white transition-colors"
                placeholder="e.g., Increase brand awareness"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Target Audience <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="target_audience"
                value={formData.target_audience}
                onChange={handleChange}
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-white transition-colors"
                placeholder="e.g., Tech-savvy millennials"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Budget (ADA) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-white transition-colors"
                placeholder="e.g., 1000"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Duration (Days) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="duration_days"
                value={formData.duration_days}
                onChange={handleChange}
                required
                min="1"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-white transition-colors"
                placeholder="e.g., 30"
              />
            </div>
          </div>

          {/* Input Text (Processing) */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Campaign Instructions <span className="text-red-500">*</span>
            </label>
            <textarea
              name="input_text"
              value={formData.input_text}
              onChange={handleChange}
              required
              rows={5}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-white transition-colors resize-none"
              placeholder="Detailed explanation of what you want to achieve with this campaign..."
            />
            <p className="text-gray-500 text-xs mt-1">
              This will be used for processing your campaign request
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-white hover:bg-gray-200 text-black font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Create Campaign
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateCampaign;
