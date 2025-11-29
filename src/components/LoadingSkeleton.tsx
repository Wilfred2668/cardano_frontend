import { motion } from 'framer-motion';

export const SkeletonCard = () => {
  return (
    <div className="card animate-pulse">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-800 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-800 rounded w-3/4" />
            <div className="h-3 bg-gray-900 rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-900 rounded" />
          <div className="h-3 bg-gray-900 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonKPI = () => {
  return (
    <div className="card animate-pulse">
      <div className="space-y-3">
        <div className="h-3 bg-gray-900 rounded w-1/3" />
        <div className="h-8 bg-gray-800 rounded w-2/3" />
        <div className="h-2 bg-gray-900 rounded w-1/2" />
      </div>
    </div>
  );
};

export const SkeletonVariantCard = () => {
  return (
    <div className="card animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gray-800" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-900 rounded w-16" />
            <div className="h-3 bg-gray-800 rounded w-20" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="h-2 bg-gray-900 rounded w-16 mb-2" />
          <div className="h-4 bg-gray-800 rounded w-full" />
        </div>
        <div>
          <div className="h-2 bg-gray-900 rounded w-16 mb-2" />
          <div className="h-3 bg-gray-800 rounded w-full mb-1" />
          <div className="h-3 bg-gray-800 rounded w-4/5" />
        </div>
        <div>
          <div className="h-2 bg-gray-900 rounded w-16 mb-2" />
          <div className="h-8 bg-gray-800 rounded w-32" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonMetric = () => {
  return (
    <div className="animate-pulse space-y-2">
      <div className="flex items-center justify-between">
        <div className="h-3 bg-gray-900 rounded w-24" />
        <div className="h-3 bg-gray-800 rounded w-20" />
      </div>
      <div className="h-2 bg-gray-900 rounded-full" />
    </div>
  );
};

export const SkeletonLine = ({ width = 'full' }: { width?: string }) => {
  return (
    <motion.div
      className={`h-3 bg-gray-800 rounded w-${width}`}
      animate={{
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

export const SkeletonText = () => {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-3 bg-gray-800 rounded w-full" />
      <div className="h-3 bg-gray-800 rounded w-5/6" />
      <div className="h-3 bg-gray-800 rounded w-4/6" />
    </div>
  );
};

// Shimmer effect skeleton
export const SkeletonShimmer = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`relative overflow-hidden bg-gray-900 rounded ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/30 to-transparent"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

export const SkeletonCampaignCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="animate-pulse space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-gray-800 rounded w-2/3" />
            <div className="h-3 bg-gray-900 rounded w-20" />
          </div>
          <div className="w-4 h-4 bg-gray-800 rounded" />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="h-3 bg-gray-900 rounded w-16" />
            <div className="h-3 bg-gray-800 rounded w-20" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-900 rounded w-16" />
            <div className="h-3 bg-gray-800 rounded w-20" />
          </div>
          <div className="w-full bg-gray-900 rounded-full h-1.5" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
          <div className="space-y-2">
            <div className="h-2 bg-gray-900 rounded w-16" />
            <div className="h-4 bg-gray-800 rounded w-12" />
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-gray-900 rounded w-16" />
            <div className="h-4 bg-gray-800 rounded w-12" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
