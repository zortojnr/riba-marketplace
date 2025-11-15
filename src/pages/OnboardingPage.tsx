import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const OnboardingPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome to RIBA</h1>
        <p className="text-muted-foreground">Let’s set up your store in a few steps</p>
      </div>

      <motion.ol
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-card p-6 space-y-4 list-decimal list-inside"
      >
        <li>Add store details (name, description, theme)</li>
        <li>Create your first products</li>
        <li>Configure payments</li>
        <li>Share your store link</li>
      </motion.ol>

      <div className="flex gap-3">
        <Link to="/dashboard" className="btn btn-outline">Skip for now</Link>
        <Link to="/products" className="btn btn-primary">Create Products</Link>
      </div>
    </div>
  );
};