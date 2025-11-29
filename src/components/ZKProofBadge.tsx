import { motion } from 'framer-motion';
import Tooltip from './Tooltip';

interface ZKProofBadgeProps {
  verified?: boolean;
  className?: string;
}

const ZKProofBadge = ({ verified = true, className = '' }: ZKProofBadgeProps) => {
  return (
    <Tooltip
      content={verified 
        ? "This campaign's data integrity has been cryptographically verified using zero-knowledge proofs on Cardano blockchain." 
        : "Campaign verification is pending. ZK proofs will be generated upon completion."}
      position="bottom"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`
          inline-flex items-center space-x-2 px-3 py-1.5 rounded-full cursor-help
          ${verified ? 'bg-green-900/20 border border-green-800' : 'bg-gray-900 border border-gray-800'}
          ${className}
        `}
      >
        <svg 
          className={`w-4 h-4 ${verified ? 'text-green-400' : 'text-gray-400'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
          />
        </svg>
        <span className={`text-xs font-medium ${verified ? 'text-green-400' : 'text-gray-400'}`}>
          {verified ? 'ZK Verified' : 'Pending Verification'}
        </span>
      </motion.div>
    </Tooltip>
  );
};

export default ZKProofBadge;
