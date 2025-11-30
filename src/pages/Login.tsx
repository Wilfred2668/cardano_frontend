import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GradientButton from '../components/GradientButton';

// Import SVG illustrations inline to avoid file size issues
const AddIllustration = () => (
  <svg className="w-full max-w-xs h-auto opacity-10" viewBox="0 0 806 593" fill="none">
    <path d="M40 69H707V587C707 590.314 704.314 593 701 593H47C43.686 593 41 590.321 41 587L40 69Z" fill="currentColor"/>
    <path d="M428 306C428 302.686 430.686 300 434 300H800C803.314 300 806 302.686 806 306V541C806 544.314 803.314 547 800 547H434C430.686 547 428 544.314 428 541V306Z" fill="currentColor" opacity="0.5"/>
  </svg>
);

const CryptoIllustration = () => (
  <svg className="w-full max-w-xs h-auto opacity-10" viewBox="0 0 763 654" fill="none">
    <path d="M466.835 0C441.013 0 414.439 20.1594 407.482 45.0273L268.597 541.453C261.64 566.321 276.933 586.48 302.756 586.48L512.954 586.497C531.197 586.499 549.969 572.244 554.86 554.675L569.523 502L680.452 105.5L693.812 57.7983C702.752 25.8799 683.126 0 649.982 0H595.5H466.835Z" fill="currentColor" opacity="0.3"/>
    <circle cx="277.5" cy="164.5" r="61.5" fill="currentColor"/>
  </svg>
);

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
      
      {/* Animated floating orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.03, 0.06, 0.03],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 w-[500px] h-[500px] bg-white rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.02, 0.05, 0.02],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-white rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.02, 0.04, 0.02],
          x: [0, 30, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
        className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-white rounded-full blur-3xl"
      />
      
      {/* Left side illustration */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-800 hidden lg:block">
        <AddIllustration />
      </div>
      
      {/* Right side illustration */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-800 hidden lg:block">
        <CryptoIllustration />
      </div>
      
      {/* Animated grid pattern */}
      <motion.div
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: Math.random() * 0.5,
          }}
          animate={{
            y: [null, Math.random() * window.innerHeight],
            opacity: [null, Math.random() * 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}

      <div className="relative z-10 w-full px-8 lg:px-16 xl:px-24 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-40 max-w-7xl mx-auto"
        >
          {/* Logo/Wordmark */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-20"
          >
            <h1 className="text-[8rem] md:text-[12rem] lg:text-[14rem] font-bold mb-10 leading-none tracking-tight">
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                RIZE
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-300 text-3xl md:text-4xl mb-8 font-light"
            >
              Autonomous Marketing Intelligence
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-gray-400 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed"
            >
              Deploy AI agents to generate, execute, and optimize your marketing campaigns.
              Powered by blockchain for transparency and trust.
            </motion.p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mb-24"
          >
            <GradientButton
              onClick={handleConnect}
              className="min-w-[300px] text-xl py-6 px-12 font-semibold"
            >
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Login with DID</span>
              </div>
            </GradientButton>
            <p className="mt-6 text-base text-gray-500">
              Secure decentralized identity authentication
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-16 max-w-6xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-bold mb-4">{stat.value}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mb-40 max-w-7xl mx-auto"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-20">
            Everything you need to scale
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 + index * 0.1 }}
                className="card bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 group cursor-default p-8"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-lg text-gray-400 leading-relaxed">{feature.description}</p>
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
          transition={{ delay: 2.1 }}
          className="mb-40 max-w-7xl mx-auto"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-20">
            Launch in three steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-20">
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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 + index * 0.15 }}
                className="text-center relative group"
              >
                <div className="text-8xl md:text-9xl font-bold text-gray-900 mb-8 group-hover:text-gray-800 transition-colors">{item.step}</div>
                <h3 className="text-2xl md:text-3xl font-bold mb-5">{item.title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed">{item.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-20 -right-10 lg:-right-14 text-gray-800">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          transition={{ delay: 2.6 }}
          className="text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-8 md:gap-12 px-12 py-10 bg-gray-900/30 border border-gray-800 rounded-2xl">
            <div className="flex items-center space-x-4">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-lg text-gray-300 font-medium">Cardano Blockchain</span>
            </div>
            <div className="hidden md:block h-8 w-px bg-gray-700" />
            <div className="flex items-center space-x-4">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-lg text-gray-300 font-medium">Smart Contract Secured</span>
            </div>
            <div className="hidden md:block h-8 w-px bg-gray-700" />
            <div className="flex items-center space-x-4">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-lg text-gray-300 font-medium">ZK Verified</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
