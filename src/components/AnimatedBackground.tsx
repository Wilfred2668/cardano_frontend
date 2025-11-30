import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <>
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
        className="absolute top-20 left-10 w-[500px] h-[500px] bg-white rounded-full blur-3xl pointer-events-none"
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
        className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-white rounded-full blur-3xl pointer-events-none"
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
        className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-white rounded-full blur-3xl pointer-events-none"
      />

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
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Floating particles */}
      {typeof window !== 'undefined' && [...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full pointer-events-none"
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
    </>
  );
}
