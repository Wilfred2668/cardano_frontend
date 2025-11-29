import type { Variants } from 'framer-motion';

// ===================================================================
// SHARED ANIMATION VARIANTS
// ===================================================================

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

// ===================================================================
// STAGGER ANIMATIONS
// ===================================================================

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerFastContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const staggerSlowContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// ===================================================================
// HOVER & TAP ANIMATIONS
// ===================================================================

export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};

export const hoverLift = {
  whileHover: { y: -4, boxShadow: '0 10px 30px rgba(255,255,255,0.1)' },
  whileTap: { y: 0 },
};

export const hoverGlow = {
  whileHover: { boxShadow: '0 0 20px rgba(255,255,255,0.15)' },
};

// ===================================================================
// NUMBER COUNTER ANIMATION
// ===================================================================

export const numberAnimation = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: 'spring', stiffness: 200, damping: 15 },
};

// ===================================================================
// LOADING ANIMATIONS
// ===================================================================

export const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export const spinAnimation = {
  animate: { rotate: 360 },
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: 'linear',
  },
};

// ===================================================================
// TRANSITION CONFIGS
// ===================================================================

export const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const smoothTransition = {
  duration: 0.3,
  ease: 'easeInOut',
};

export const fastTransition = {
  duration: 0.15,
  ease: 'easeOut',
};

export const slowTransition = {
  duration: 0.5,
  ease: 'easeInOut',
};

// ===================================================================
// UTILITY FUNCTIONS
// ===================================================================

/**
 * Creates a stagger delay for list items
 */
export const getStaggerDelay = (index: number, baseDelay: number = 0.1): number => {
  return index * baseDelay;
};

/**
 * Creates a custom fade in animation with delay
 */
export const createFadeIn = (delay: number = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
});

/**
 * Creates a slide animation from a specific direction
 */
export const createSlide = (direction: 'up' | 'down' | 'left' | 'right', distance: number = 20) => {
  const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
  const value = direction === 'down' || direction === 'right' ? distance : -distance;
  
  return {
    initial: { opacity: 0, [axis]: value },
    animate: { opacity: 1, [axis]: 0 },
    exit: { opacity: 0, [axis]: -value },
  };
};
