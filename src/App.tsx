import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletProvider } from './contexts/WalletContext';
import { DIDProvider } from './contexts/DIDContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CampaignProvider } from './contexts/CampaignContext';
import { CardanoWalletProvider } from './contexts/CardanoWalletContext';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import Login from './pages/Login';
// DID Authentication
import { AuthProvider, useAuth } from './auth/AuthContext';
import DIDSetupWizard from './pages/DIDSetupWizard';
// Dashboard Pages
import Dashboard from './pages/Dashboard';
import Stats from './pages/Campaigns';
import CreateCampaign from './pages/CreateCampaign';
import Wallet from './pages/Wallet';
import Settings from './pages/Settings';
import Extras from './pages/Extras';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Page transition animation
const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 }
};

import { useGlobalHotkeys } from './hooks/useHotkeys';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/did-auth" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/did-auth';
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      {!isAuthPage && <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />}
      {!isAuthPage && <Navbar sidebarOpen={sidebarOpen} />}
      <PageTransition>
        <div className={!isAuthPage ? `pt-20 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}` : ''}>
          <div className={!isAuthPage ? 'p-8' : ''}>
            <AnimatePresence mode="wait">
            <Routes>
            {/* Landing Page */}
            <Route 
              path="/" 
              element={
                <motion.div {...pageTransition}>
                  <Login />
                </motion.div>
              } 
            />
            
            {/* DID Authentication Setup */}
            <Route 
              path="/did-auth" 
              element={
                <motion.div {...pageTransition}>
                  <DIDSetupWizard />
                </motion.div>
              } 
            />
            
            {/* Protected Dashboard Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <motion.div {...pageTransition}>
                    <Dashboard />
                  </motion.div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/stats" 
              element={
                <ProtectedRoute>
                  <motion.div {...pageTransition}>
                    <Stats />
                  </motion.div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/create-campaign" 
              element={
                <ProtectedRoute>
                  <motion.div {...pageTransition}>
                    <CreateCampaign />
                  </motion.div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/wallet" 
              element={
                <ProtectedRoute>
                  <motion.div {...pageTransition}>
                    <Wallet />
                  </motion.div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <motion.div {...pageTransition}>
                    <Settings />
                  </motion.div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/extras" 
              element={
                <ProtectedRoute>
                  <motion.div {...pageTransition}>
                    <Extras />
                  </motion.div>
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect all other routes to dashboard if authenticated, else home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
        </div>
      </div>
      </PageTransition>
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <ThemeProvider>
          <AuthProvider>
            <WalletProvider>
              <DIDProvider>
                <ToastProvider>
                  <CampaignProvider>
                    <CardanoWalletProvider>
                      <div className="min-h-screen bg-black dark:bg-black light-theme:bg-white text-white dark:text-white light-theme:text-black transition-colors">
                        <AppContent />
                      </div>
                    </CardanoWalletProvider>
                  </CampaignProvider>
                </ToastProvider>
              </DIDProvider>
            </WalletProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
