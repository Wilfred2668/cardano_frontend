import { motion } from 'framer-motion';
import type { ContentVariant } from '../types';
import { memo } from 'react';

interface VariantCardProps {
  variant: ContentVariant;
  index: number;
  selected?: boolean;
  onSelect?: () => void;
}

const VariantCard = memo(({ variant, index, selected = false, onSelect }: VariantCardProps) => {
  // Mock additional metadata
  const metadata = {
    tone: ['Professional', 'Friendly', 'Urgent'][index % 3],
    hookStrength: [92, 88, 85][index % 3],
    psychologyTag: ['Scarcity', 'Social Proof', 'Authority'][index % 3],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: selected ? 1.02 : 1,
      }}
      transition={{ delay: index * 0.15 }}
      whileHover={{ 
        y: -4,
        boxShadow: selected 
          ? '0 20px 40px rgba(255,255,255,0.15), 0 0 30px rgba(255,255,255,0.1)' 
          : '0 10px 30px rgba(255,255,255,0.08)',
      }}
      data-variant-index={index}
      data-variant-selected={selected}
      className={`
        card cursor-pointer transition-all duration-300 relative overflow-hidden
        ${selected 
          ? 'border-white shadow-lg shadow-white/10 bg-gradient-to-br from-gray-900 to-black' 
          : 'hover:border-gray-600'
        }
      `}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
            <span className="text-lg font-bold">{variant.type}</span>
          </div>
          <div>
            <div className="text-xs text-gray-400">Variant {variant.type}</div>
            {variant.score && (
              <div className="text-sm font-medium text-green-400">Score: {variant.score}%</div>
            )}
          </div>
        </div>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 bg-white rounded-full flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-xs text-gray-500 mb-1">Headline</div>
          <h4 className="font-semibold text-lg">{variant.headline}</h4>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Body</div>
          <p className="text-sm text-gray-300">{variant.body}</p>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Call to Action</div>
          <div className="inline-block px-4 py-2 bg-white text-black text-sm font-medium rounded">
            {variant.cta}
          </div>
        </div>
        
        {/* Additional Metadata */}
        <div className="pt-3 mt-3 border-t border-gray-800 grid grid-cols-3 gap-2">
          <div>
            <div className="text-xs text-gray-600 mb-0.5">Tone</div>
            <div className="text-xs font-medium text-gray-400">{metadata.tone}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-0.5">Hook</div>
            <div className="text-xs font-medium text-green-400">{metadata.hookStrength}%</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-0.5">Psychology</div>
            <div className="text-xs font-medium text-gray-400">{metadata.psychologyTag}</div>
          </div>
        </div>
      </div>

      {/* Selection Glow Effect */}
      {selected && (
        <motion.div
          className="absolute inset-0 border-2 border-white rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.div>
  );
});

VariantCard.displayName = 'VariantCard';

export default VariantCard;
