import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface NavbarProps {
  sidebarOpen: boolean;
}

const Navbar = ({ sidebarOpen }: NavbarProps) => {
  const { did, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get profile from localStorage
  const profileData = localStorage.getItem('rize_user_profile');
  const profile = profileData ? JSON.parse(profileData) : null;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        transition: { duration: 0.3 }
      }}
      className={`fixed top-0 right-0 z-30 bg-black/80 backdrop-blur-sm border-b border-gray-800 transition-all duration-300 ${sidebarOpen ? 'left-0 lg:left-64' : 'left-0 lg:left-20'}`}
    >
      <div className="px-6 py-[1.125rem]">
        <div className="flex items-center justify-between h-8">
          {/* Left side - RIZE branding */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              RIZE
            </h1>
          </div>

          {/* Right side - Profile & Logout */}
          <div className="flex items-center space-x-4">
            {/* Profile Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm font-medium hidden md:inline">{profile?.userName || 'Profile'}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowProfileMenu(false)}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50"
                    >
                      {/* Profile Info */}
                      <div className="px-4 py-3 border-b border-gray-800">
                        <div className="text-sm font-medium text-white">{profile?.userName || 'User'}</div>
                        <div className="text-xs text-gray-400 mt-1">{profile?.companyName || 'Company'}</div>
                        <div className="text-xs text-gray-500 mt-1 truncate font-mono">
                          {did?.slice(0, 20)}...
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate('/settings');
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-800 transition-colors flex items-center space-x-3"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate('/wallet');
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-800 transition-colors flex items-center space-x-3"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <span>Wallet</span>
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-800">
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            handleLogout();
                          }}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-red-900/20 transition-colors flex items-center space-x-3 text-red-400"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
