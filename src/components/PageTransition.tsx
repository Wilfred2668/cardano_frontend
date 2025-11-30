import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousPath, setPreviousPath] = useState(location.pathname);

  useEffect(() => {
    // Check if the path has changed and it's not the initial load
    if (location.pathname !== previousPath && previousPath !== location.pathname) {
      setIsTransitioning(true);
      
      // Stop transition after 1 second
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setPreviousPath(location.pathname);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, previousPath]);

  return (
    <>
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          >
            <div className="relative w-32 h-32">
              <video
                autoPlay
                muted
                playsInline
                className="w-full h-full object-contain"
                style={{ 
                  filter: 'brightness(1.2)'
                }}
                onLoadedMetadata={(e) => {
                  const video = e.currentTarget;
                  video.playbackRate = 4;
                }}
                onCanPlay={(e) => {
                  const video = e.currentTarget;
                  video.playbackRate = 4;
                }}
              >
                <source src="/logo.mp4" type="video/mp4" />
              </video>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: isTransitioning ? 0 : 1 }}
          transition={{ duration: 0.3, delay: isTransitioning ? 0 : 0.2 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default PageTransition;
