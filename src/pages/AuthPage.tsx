import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthForm } from '../components/auth/AuthForm';
import { LogoAnimation } from '../components/auth/LogoAnimation';
import { authFormVariants } from '../components/auth/animationVariants';

export const AuthPage: React.FC = () => {
  const [showAnimation, setShowAnimation] = useState(true);
  const [showAuthForm, setShowAuthForm] = useState(false);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setShowAuthForm(true);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 relative overflow-hidden">
      {/* Logo Animation */}
      {showAnimation && (
        <LogoAnimation
          onAnimationComplete={handleAnimationComplete}
          duration={2500}
          showLoading={true}
          loadingText="Preparing your experience..."
        />
      )}

      {/* Authentication Form */}
      <AnimatePresence mode="wait">
        {showAuthForm && (
          <motion.div
            variants={authFormVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full min-h-screen flex items-center justify-center"
          >
            <AuthForm />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};