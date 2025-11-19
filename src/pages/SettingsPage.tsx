import React from 'react';
import { motion } from 'framer-motion';
import BackButton from '@/components/BackButton';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="mb-4">
        <BackButton to="/dashboard" variant="ghost" />
      </div>
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-muted-foreground">Configure your store preferences</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-card p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input className="input" placeholder="Enter store name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Theme Color</label>
            <input type="color" className="w-12 h-12 p-0 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select className="input">
              <option value="NGN">NGN (₦)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee</label>
            <input type="number" step="0.01" className="input" placeholder="0.00" />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="btn btn-primary">Save Changes</button>
        </div>
      </motion.div>
    </div>
  );
};