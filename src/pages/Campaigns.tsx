import { motion } from 'framer-motion';
import { useCampaign } from '../contexts/CampaignContext';
import { useMemo } from 'react';
import AnimatedBackground from '../components/AnimatedBackground';

export default function Stats() {
  const { pendingCampaigns } = useCampaign();

  // Calculate real stats
  const stats = useMemo(() => {
    const ongoing = pendingCampaigns.filter(c => c.status === 'paid' || c.status === 'submitted').length;
    const pending = pendingCampaigns.filter(c => c.status === 'pending_payment').length;
    const totalSpent = pendingCampaigns
      .filter(c => c.status === 'paid' || c.status === 'submitted')
      .reduce((sum, c) => sum + parseFloat(c.budget || '0'), 0);
    const avgBudget = ongoing > 0 ? totalSpent / ongoing : 0;

    return { ongoing, pending, totalSpent, avgBudget, total: pendingCampaigns.length };
  }, [pendingCampaigns]);

  // Generate chart data (last 7 days with some mock progression)
  const chartData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const baseSpending = stats.totalSpent / 7;
    return days.map((day, i) => ({
      day,
      spending: Math.round(baseSpending * (0.7 + Math.random() * 0.6)),
      campaigns: Math.floor(stats.ongoing / 7 * (0.8 + Math.random() * 0.4))
    }));
  }, [stats]);

  // Performance metrics (mock but realistic based on ongoing campaigns)
  const performanceData = useMemo(() => {
    return [
      { label: 'Click Rate', value: 3.2 + Math.random() * 2, max: 10, color: 'bg-blue-500' },
      { label: 'Conversion', value: 1.8 + Math.random() * 1.5, max: 5, color: 'bg-green-500' },
      { label: 'Engagement', value: 6.5 + Math.random() * 3, max: 15, color: 'bg-purple-500' },
      { label: 'Reach', value: 72 + Math.random() * 20, max: 100, color: 'bg-orange-500' },
    ];
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AnimatedBackground />
      <div className="max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <img src="/add.svg" alt="Advertising" className="w-16 h-16 opacity-70" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Campaign Statistics</h1>
              <p className="text-gray-400">Track your campaign performance and spending</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Ongoing Campaigns */}
            <motion.div variants={itemVariants} className="card bg-gray-900/50 border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Ongoing Campaigns</p>
                  <p className="text-4xl font-bold text-white">{stats.ongoing}</p>
                </div>
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-white">●</span>
                <span className="text-gray-400 ml-2">Active right now</span>
              </div>
            </motion.div>

            {/* Total Spent */}
            <motion.div variants={itemVariants} className="card bg-gray-900/50 border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Spent</p>
                  <p className="text-4xl font-bold text-white">₳{stats.totalSpent.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </div>
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-white">↑</span>
                <span className="text-gray-400 ml-2">Across all campaigns</span>
              </div>
            </motion.div>

            {/* Pending Campaigns */}
            <motion.div variants={itemVariants} className="card bg-gray-900/50 border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Pending Payment</p>
                  <p className="text-4xl font-bold text-white">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-white">●</span>
                <span className="text-gray-400 ml-2">Awaiting payment</span>
              </div>
            </motion.div>

            {/* Average Budget */}
            <motion.div variants={itemVariants} className="card bg-gray-900/50 border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Avg. Budget</p>
                  <p className="text-4xl font-bold text-white">₳{stats.avgBudget.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </div>
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-white">~</span>
                <span className="text-gray-400 ml-2">Per campaign</span>
              </div>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spending Chart */}
            <motion.div variants={itemVariants} className="card bg-gray-900/50 border-gray-700">
              <h3 className="text-xl font-bold mb-6">Weekly Spending</h3>
              <div className="space-y-3">
                {chartData.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm w-12">{item.day}</span>
                    <div className="flex-1 h-8 bg-gray-800 rounded-lg overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.spending / Math.max(...chartData.map(d => d.spending))) * 100}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="h-full bg-white rounded-lg"
                      />
                    </div>
                    <span className="text-white font-medium text-sm w-16 text-right">₳{item.spending}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total this week</span>
                  <span className="text-white font-bold">₳{chartData.reduce((sum, d) => sum + d.spending, 0)}</span>
                </div>
              </div>
            </motion.div>

            {/* Campaign Activity Chart */}
            <motion.div variants={itemVariants} className="card bg-gray-900/50 border-gray-700">
              <h3 className="text-xl font-bold mb-6">Campaign Activity</h3>
              <div className="h-48 flex items-end justify-between gap-2">
                {chartData.map((item, i) => {
                  const maxCampaigns = Math.max(...chartData.map(d => d.campaigns), 1);
                  const height = (item.campaigns / maxCampaigns) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="w-full bg-white rounded-t-lg relative group cursor-pointer"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {item.campaigns} campaigns
                        </div>
                      </motion.div>
                      <span className="text-gray-400 text-xs">{item.day}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Peak activity</span>
                  <span className="text-white font-bold">{Math.max(...chartData.map(d => d.campaigns))} campaigns</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Performance Metrics */}
          <motion.div variants={itemVariants} className="card bg-gray-900/50 border-gray-700">
            <h3 className="text-xl font-bold mb-6">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {performanceData.map((metric, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">{metric.label}</span>
                    <span className="text-white font-bold">{metric.value.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(metric.value / metric.max) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.15 }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Additional Info */}
          {stats.total === 0 && (
            <motion.div variants={itemVariants} className="card bg-gray-900/30 border-gray-800 text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">No Campaign Data Yet</h3>
              <p className="text-gray-400">Create your first campaign to see statistics here</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
