import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';
import { hasDid, loadDid } from '../wallet/did';

/**
 * Multi-step DID Setup Wizard
 * 1. Check if DID exists
 * 2. Create DID or import existing
 * 3. Collect company profile information
 * 4. Authenticate and proceed to dashboard
 */

type SetupStep = 'check' | 'create' | 'profile' | 'authenticate' | 'complete';

interface UserProfile {
  userName: string;
  companyName: string;
  industry: string;
  role: string;
}

const PROFILE_STORAGE_KEY = 'rize_user_profile';

export default function DIDSetupWizard() {
  const navigate = useNavigate();
  const { did, connectDid, login, importDidFromBackup, isLoading, error } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<SetupStep>('check');
  const [profile, setProfile] = useState<UserProfile>({
    userName: '',
    companyName: '',
    industry: '',
    role: ''
  });
  const [showImport, setShowImport] = useState(false);
  const [importDid, setImportDid] = useState('');
  const [importKey, setImportKey] = useState('');

  // Check if user already has DID and profile on mount
  useEffect(() => {
    const checkExistingSetup = async () => {
      const existingDid = hasDid();
      const existingProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      
      if (existingDid && existingProfile) {
        // User has completed setup before
        setCurrentStep('authenticate');
        setProfile(JSON.parse(existingProfile));
      } else if (existingDid) {
        // Has DID but no profile
        setCurrentStep('profile');
        const didData = loadDid();
        if (didData) {
          await connectDid();
        }
      } else {
        // New user
        setCurrentStep('create');
      }
    };
    
    checkExistingSetup();
  }, []);

  const handleCreateDid = async () => {
    try {
      await connectDid();
      setCurrentStep('profile');
    } catch (err) {
      console.error('Failed to create DID:', err);
    }
  };

  const handleImportDid = async () => {
    try {
      importDidFromBackup(importDid.trim(), importKey.trim());
      setShowImport(false);
      setCurrentStep('profile');
    } catch (err) {
      console.error('Failed to import DID:', err);
    }
  };

  const handleProfileSubmit = () => {
    if (!profile.companyName || !profile.industry || !profile.role) {
      return;
    }
    
    // Save profile to localStorage
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    setCurrentStep('authenticate');
  };

  const handleAuthenticate = async () => {
    try {
      await login();
      setCurrentStep('complete');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Authentication failed:', err);
    }
  };

  // Get current step number for progress indicator
  const getCurrentStepNumber = () => {
    switch (currentStep) {
      case 'create': return 1;
      case 'profile': return 2;
      case 'authenticate': return 3;
      case 'complete': return 3;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <div className="text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
            RIZE
          </div>
          <p className="text-gray-400">Setup Your Decentralized Identity</p>
        </div>

        {/* Step Progress Indicator */}
        {currentStep !== 'complete' && (
          <div className="flex items-center justify-center space-x-3">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: getCurrentStepNumber() === step ? 1.2 : 1,
                    backgroundColor: getCurrentStepNumber() >= step ? '#ffffff' : '#374151',
                  }}
                  transition={{ duration: 0.3 }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    font-semibold text-sm
                    ${getCurrentStepNumber() >= step ? 'text-black' : 'text-gray-500'}
                  `}
                >
                  {getCurrentStepNumber() > step ? '✓' : step}
                </motion.div>
                {step < 3 && (
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: getCurrentStepNumber() > step ? '#ffffff' : '#374151',
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-12 h-1 mx-2"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Single Card with Steps */}
        <AnimatePresence mode="wait">
          {/* Step 1: Create DID */}
          {currentStep === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card space-y-6"
            >
              <div>
                <div className="text-sm text-gray-400 mb-2">Step 1 of 3</div>
                <h2 className="text-2xl font-bold mb-2">Create Your DID</h2>
                <p className="text-gray-400">
                  Your Decentralized Identifier (DID) is your unique, cryptographically secure identity on the blockchain.
                </p>
              </div>

              {!showImport ? (
                <>
                  <button
                    onClick={handleCreateDid}
                    disabled={isLoading}
                    className="w-full btn-primary py-4 text-lg flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      'Creating DID...'
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Create New DID</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowImport(true)}
                    className="w-full btn-secondary py-3 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Import Existing DID</span>
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Import DID from Backup</h3>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">DID</label>
                    <input
                      type="text"
                      value={importDid}
                      onChange={(e) => setImportDid(e.target.value)}
                      placeholder="did:prism:abc123..."
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Private Key</label>
                    <input
                      type="password"
                      value={importKey}
                      onChange={(e) => setImportKey(e.target.value)}
                      placeholder="64 hex characters"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg font-mono text-sm"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleImportDid}
                      disabled={!importDid || !importKey || isLoading}
                      className="flex-1 btn-primary"
                    >
                      Import
                    </button>
                    <button
                      onClick={() => setShowImport(false)}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="text-xs text-gray-500 bg-gray-900/50 p-4 rounded-lg">
                <strong>What is a DID?</strong><br />
                A DID is like your digital fingerprint - unique, secure, and owned only by you. 
                It's stored locally and never shared with anyone.
              </div>

              {/* Progress Dots */}
              <div className="flex justify-center space-x-2 pt-4">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                <div className="w-2 h-2 rounded-full bg-gray-700"></div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Profile Setup */}
          {currentStep === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card space-y-6"
            >
              <div>
                <div className="text-sm text-gray-400 mb-2">Step 2 of 3</div>
                <h2 className="text-2xl font-bold mb-2">Company Profile</h2>
                <p className="text-gray-400">
                  Tell us about your company to personalize your experience.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={profile.userName}
                    onChange={(e) => setProfile({ ...profile, userName: e.target.value })}
                    placeholder="e.g., John Doe"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={profile.companyName}
                    onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                    placeholder="e.g., Acme Inc."
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Industry <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={profile.industry}
                    onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-white focus:outline-none"
                  >
                    <option value="">Select industry</option>
                    <option value="technology">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="retail">Retail & E-commerce</option>
                    <option value="education">Education</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="hospitality">Hospitality & Travel</option>
                    <option value="media">Media & Entertainment</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Role <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-white focus:outline-none"
                  >
                    <option value="">Select role</option>
                    <option value="ceo">CEO / Founder</option>
                    <option value="marketing">Marketing Manager</option>
                    <option value="product">Product Manager</option>
                    <option value="sales">Sales</option>
                    <option value="developer">Developer</option>
                    <option value="designer">Designer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleProfileSubmit}
                disabled={!profile.userName || !profile.companyName || !profile.industry || !profile.role}
                className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue →
              </button>

              <div className="text-xs text-gray-500 text-center">
                This information is stored locally and helps personalize your experience
              </div>

              {/* Progress Dots */}
              <div className="flex justify-center space-x-2 pt-4">
                <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <div className="w-2 h-2 rounded-full bg-gray-700"></div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Authenticate */}
          {currentStep === 'authenticate' && (
            <motion.div
              key="authenticate"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card space-y-6"
            >
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">Step 3 of 3</div>
                <h2 className="text-2xl font-bold mb-2">Ready to Sign In</h2>
                <p className="text-gray-400">
                  Authenticate using your DID to access the platform
                </p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Name:</span>
                  <span className="font-medium">{profile.userName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Company:</span>
                  <span className="font-medium">{profile.companyName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Industry:</span>
                  <span className="font-medium capitalize">{profile.industry}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">DID:</span>
                  <span className="font-mono text-xs">{did?.slice(0, 20)}...</span>
                </div>
              </div>

              <button
                onClick={handleAuthenticate}
                disabled={isLoading}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                    <span>Sign In with DID</span>
                  </>
                )}
              </button>

              {error && (
                <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="text-xs text-gray-500 bg-gray-900/50 p-4 rounded-lg">
                <strong>Authentication Process:</strong><br />
                1. Backend generates a random challenge<br />
                2. Your DID signs the challenge locally<br />
                3. Backend verifies the signature<br />
                4. You receive an access token
              </div>

              {/* Progress Dots */}
              <div className="flex justify-center space-x-2 pt-4">
                <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Complete */}
          {currentStep === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="flex items-center justify-center"
              >
                <svg className="w-24 h-24 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
              
              <div>
                <h2 className="text-3xl font-bold mb-2">Welcome to RIZE!</h2>
                <p className="text-gray-400">
                  Setup complete. Redirecting to your dashboard...
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2 text-gray-500">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
