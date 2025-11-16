import React from 'react';
import type { Store } from '@/types';
import { motion } from 'framer-motion';

interface StoreHeaderProps {
  store: Store;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({ store }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4">
          {store.logo ? (
            <img
              src={store.logo}
              alt={store.name}
              className="h-16 w-16 rounded-lg object-cover"
            />
          ) : (
            <img
              src="/assets/images/logo.svg"
              alt="RIBA Store"
              className="h-16 w-16 rounded-lg object-cover"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
            {store.description && (
              <p className="text-gray-600 mt-1">{store.description}</p>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};