import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Campaign } from '../types';

interface CampaignCardProps {
  campaign: Campaign;
  index: number;
}

const CampaignCard = ({ campaign, index }: CampaignCardProps) => {
  const statusColors: Record<string, string> = {
    draft: 'text-gray-400 bg-gray-900',
    active: 'text-green-400 bg-green-900/20',
    completed: 'text-gray-400 bg-gray-900/50',
    paused: 'text-yellow-400 bg-yellow-900/20',
    cancelled: 'text-red-400 bg-red-900/20',
  };

  const getProgress = () => {
    return (campaign.spend / campaign.budget) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/campaign/${campaign.id}`}>
        <div className="card group cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-gray-300 transition-colors">
                {campaign.name}
              </h3>
              <span className={`text-xs px-2 py-1 rounded ${statusColors[campaign.status]}`}>
                {campaign.status.toUpperCase()}
              </span>
            </div>
            <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Budget</span>
              <span className="font-medium">${campaign.budget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Spend</span>
              <span className="font-medium">${campaign.spend.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getProgress()}%` }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                className="bg-white h-1.5 rounded-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
            <div>
              <div className="text-xs text-gray-400 mb-1">Impressions</div>
              <div className="text-lg font-semibold">{campaign.impressions.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Clicks</div>
              <div className="text-lg font-semibold">{campaign.clicks.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CampaignCard;
