import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { logoAnimationVariants, staggerContainer } from './animationVariants';

interface LogoAnimationProps {
  onAnimationComplete: () => void;
  duration?: number;
  showLoading?: boolean;
  loadingText?: string;
}

export const LogoAnimation: React.FC<LogoAnimationProps> = ({
  onAnimationComplete,
  duration = 2500,
  showLoading = false,
  loadingText = "Loading your experience..."
}) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [animationError, setAnimationError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => {
        onAnimationComplete();
      }, 300); // Small delay for fade out
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onAnimationComplete]);

  const handleAnimationError = () => {
    setAnimationError(true);
    setTimeout(() => {
      onAnimationComplete();
    }, 500);
  };

  // Use the imported animation variants
  const logoVariants = logoAnimationVariants.container;
  const textVariants = logoAnimationVariants.text;
  const loadingVariants = logoAnimationVariants.loading;
  const backgroundVariants = logoAnimationVariants.background;
  const progressBarVariants = logoAnimationVariants.progressBar;
  const particleVariants = logoAnimationVariants.particle;

  if (animationError) {
    return null; // Skip animation on error
  }

  return (
    <AnimatePresence mode="wait">
      {isAnimating && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800"
          variants={backgroundVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onError={handleAnimationError}
        >
          <motion.div
            className="relative"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Logo Container */}
            <motion.div
              className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
              variants={logoVariants}
            >
              {/* Background Circle with Pulsing Effect */}
              <motion.div
                className="absolute inset-0 bg-white/10 rounded-full backdrop-blur-sm"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Logo */}
              <div className="relative w-full h-full flex items-center justify-center">
                <motion.img
                  src="/assets/images/logo.svg"
                  alt="RIBA Logo"
                  className="w-full h-full object-contain drop-shadow-lg"
                  onError={handleAnimationError}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                />
              </div>

              {/* Multiple Pulsing Ring Effects */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 border border-white/20 rounded-full"
                  animate={{
                    scale: [1, 1.3 + (i * 0.2), 1],
                    opacity: [0.6, 0, 0.6]
                  }}
                  transition={{
                    duration: 2 + (i * 0.5),
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: i * 0.3
                  }}
                />
              ))}
            </motion.div>

            {/* Brand Text */}
            <motion.div
              className="text-center mt-8"
              variants={textVariants}
            >
              <motion.h1 
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                RIBA
              </motion.h1>
              <motion.p 
                className="text-white/80 text-sm sm:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                Quick Menu & Cart Creator
              </motion.p>
            </motion.div>

            {/* Loading Indicator */}
            {showLoading && (
              <motion.div
                className="text-center mt-6"
                variants={loadingVariants}
              >
                <div className="flex items-center justify-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <Loader2 className="h-5 w-5 text-white/70" />
                  </motion.div>
                  <span className="text-white/70 text-sm">
                    {loadingText}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Enhanced Progress Bar */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden"
              variants={progressBarVariants}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-white/40 to-white/80 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: duration / 1000,
                  ease: "linear"
                }}
              />
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ["-100%", "200%"]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.div>
          </motion.div>

          {/* Enhanced Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                initial={{
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                  opacity: 0,
                  scale: 0
                }}
                animate={{
                  x: Math.random() * 300 - 150,
                  y: Math.random() * 300 - 150,
                  opacity: [0, 0.4, 0],
                  scale: [0, 1, 0.5]
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};