import { motion } from 'framer-motion';
import { useEffect, useState, memo } from 'react';

export interface MetricData {
  label: string;
  value: number;
  target?: number;
  color?: string;
}

interface AnimatedMetricsChartProps {
  metrics: MetricData[];
  className?: string;
}

const AnimatedMetricsChart = memo(({ metrics, className = '' }: AnimatedMetricsChartProps) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {metrics.map((metric, index) => {
        const percentage = metric.target 
          ? Math.min((metric.value / metric.target) * 100, 100)
          : 100;

        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{metric.label}</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{metric.value.toLocaleString()}</span>
                {metric.target && (
                  <span className="text-gray-500">/ {metric.target.toLocaleString()}</span>
                )}
              </div>
            </div>
            <div className="relative w-full h-2 bg-gray-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: animate ? `${percentage}%` : 0 }}
                transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                className={`h-full rounded-full ${metric.color || 'bg-white'}`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});

AnimatedMetricsChart.displayName = 'AnimatedMetricsChart';

export default AnimatedMetricsChart;
