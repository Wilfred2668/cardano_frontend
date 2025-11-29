import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GradientButton from '../components/GradientButton';

const Login = () => {
  const navigate = useNavigate();

  const handleConnect = () => {
    // Navigate to DID setup wizard
    navigate('/did-auth');
  };

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'AI-Powered Strategy',
      description: 'Generate optimized campaigns in seconds with advanced machine learning'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Autonomous Execution',
      description: 'AI agents run campaigns 24/7, optimizing for maximum performance'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Zero-Knowledge Proofs',
      description: 'Verify campaign metrics without exposing sensitive data'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Smart Contract Escrow',
      description: 'Funds locked on-chain, released automatically based on milestones'
    }
  ];

  const stats = [
    { value: '4.2x', label: 'Average ROI' },
    { value: '10hrs', label: 'Saved Weekly' },
    { value: '99.9%', label: 'Uptime' },
    { value: '<1min', label: 'Setup Time' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Radial gradient overlays */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl" />

      <div className="relative z-10 w-full px-8 lg:px-16 xl:px-24 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-32 max-w-6xl mx-auto"
        >
          {/* Logo/Wordmark */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-16"
          >
            <h1 className="text-8xl md:text-9xl lg:text-[10rem] font-bold mb-8 leading-none">
              <motion.span
                className="inline-block gradient-text"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                RIZE
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-400 text-2xl md:text-3xl mb-6"
            >
              Autonomous Marketing Intelligence
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-gray-500 text-lg max-w-3xl mx-auto leading-relaxed"
            >
              Deploy AI agents to generate, execute, and optimize your marketing campaigns.
              Powered by blockchain for transparency and trust.
            </motion.p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-20"
          >
            <GradientButton
              onClick={handleConnect}
              className="min-w-[260px] text-lg py-5 px-10"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Login with DID</span>
              </div>
            </GradientButton>
            <p className="mt-5 text-sm text-gray-600">
              Secure decentralized identity authentication
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-6xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-3">{stat.value}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mb-32 max-w-7xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Everything you need to scale
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                className="card group cursor-default"
              >
                <div className="flex items-start space-x-5">
                  <div className="flex-shrink-0 w-14 h-14 bg-gray-900 rounded-lg flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-base text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mb-32 max-w-7xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Launch in three steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {[
              {
                step: '01',
                title: 'Connect & Create',
                description: 'Connect your wallet and describe your campaign goals'
              },
              {
                step: '02',
                title: 'AI Generates Strategy',
                description: 'Get instant campaign strategy with A/B test variants'
              },
              {
                step: '03',
                title: 'Lock & Launch',
                description: 'Approve and lock funds. AI agents execute automatically'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.1 + index * 0.15 }}
                className="text-center relative"
              >
                <div className="text-7xl md:text-8xl font-bold text-gray-900 mb-6">{item.step}</div>
                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-400 text-base leading-relaxed">{item.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 -right-8 lg:-right-12 text-gray-800">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
          className="text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-6 md:gap-8 px-10 py-8 glass-panel">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-base text-gray-400">Cardano Blockchain</span>
            </div>
            <div className="hidden md:block h-6 w-px bg-gray-800" />
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-base text-gray-400">Smart Contract Secured</span>
            </div>
            <div className="hidden md:block h-6 w-px bg-gray-800" />
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-base text-gray-400">ZK Verified</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
