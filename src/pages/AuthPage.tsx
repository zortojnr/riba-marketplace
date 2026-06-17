import React from 'react';
import { motion } from 'framer-motion';
import { AuthForm } from '../components/auth/AuthForm';
import BackButton from '../components/BackButton';

export const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <BackButton to="/" variant="ghost" />
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-50 rounded-full opacity-30"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full overflow-hidden mb-6 shadow-lg"
          >
            <img
              src="/assets/images/logo.png"
              alt="RIBA Marketplace"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="text-4xl font-bold text-gray-900 mb-3"
          >
            Welcome to RIBA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            className="text-lg text-gray-600 mb-4"
          >
            Your trusted marketplace for quality products
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
            className="flex items-center justify-center gap-2 text-sm text-emerald-600"
          >
            <span className="inline-flex items-center justify-center w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>Trusted by thousands of customers</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
        >
          <AuthForm />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          <p>© 2025 RIBA Marketplace. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage;