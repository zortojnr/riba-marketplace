import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Lock, ShoppingBag, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface CustomerAccessFlowProps {
  businessSlug: string;
  children: React.ReactNode;
}

interface BusinessAccess {
  hasAccess: boolean;
  businessId: string;
  businessName: string;
  isAuthorized: boolean;
  accessType: 'full' | 'restricted' | 'none';
}

export const CustomerAccessFlow: React.FC<CustomerAccessFlowProps> = ({ 
  businessSlug, 
  children 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accessStatus, setAccessStatus] = useState<BusinessAccess | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAccessModal, setShowAccessModal] = useState(false);

  useEffect(() => {
    checkBusinessAccess();
  }, [businessSlug, user]);

  const checkBusinessAccess = async () => {
    try {
      setLoading(true);
      
      // Simulate API call to check business access
      // In real implementation, this would call your backend API
      const response = await simulateBusinessAccessCheck(businessSlug);
      
      setAccessStatus(response);
      
      // Show access modal if restricted access
      if (response.accessType === 'restricted') {
        setShowAccessModal(true);
      }
      
    } catch (error) {
      console.error('Error checking business access:', error);
      toast.error('Failed to check business access');
      
      // Default to restricted access on error
      setAccessStatus({
        hasAccess: false,
        businessId: '',
        businessName: 'Unknown Business',
        isAuthorized: false,
        accessType: 'none'
      });
    } finally {
      setLoading(false);
    }
  };

  const simulateBusinessAccessCheck = async (slug: string): Promise<BusinessAccess> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock business data - in real app, this would come from your API
    const mockBusinesses: Record<string, BusinessAccess> = {
      'demo-store': {
        hasAccess: true,
        businessId: 'demo-store-id',
        businessName: 'Demo Store',
        isAuthorized: true,
        accessType: 'full'
      },
      'test-business': {
        hasAccess: true,
        businessId: 'test-business-id',
        businessName: 'Test Business',
        isAuthorized: false,
        accessType: 'restricted'
      }
    };

    // Return mock data or default to restricted
    return mockBusinesses[slug] || {
      hasAccess: false,
      businessId: slug,
      businessName: 'Business Not Found',
      isAuthorized: false,
      accessType: 'none'
    };
  };

  const handleRequestAccess = () => {
    toast.info('Access request sent to business owner');
    setShowAccessModal(false);
  };

  const handleBrowseSimilar = () => {
    navigate('/dashboard'); // Redirect to customer dashboard with similar businesses
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <ShoppingBag className="w-12 h-12 text-emerald-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  // No access - show restricted message
  if (accessStatus?.accessType === 'none') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Business Not Found</h3>
            <p className="text-gray-600 mb-6">
              The business you're trying to access doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Available Stores
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Restricted access - show modal and allow browsing only
  if (accessStatus?.accessType === 'restricted') {
    return (
      <div className="relative min-h-screen bg-gray-50">
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-40" />
        
        {/* Main content with restricted functionality */}
        <div className="relative z-30">
          {children}
        </div>

        {/* Access restriction modal */}
        <AnimatePresence>
          {showAccessModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Access Required
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Business owner has to give you access! You can browse products but cannot make purchases.
                  </p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleRequestAccess}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                      Request Access
                    </button>
                    <button
                      onClick={handleBrowseSimilar}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Browse Similar Stores
                    </button>
                    <button
                      onClick={() => setShowAccessModal(false)}
                      className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors"
                    >
                      Continue Browsing
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Restricted access banner */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-30"
        >
          <div className="bg-yellow-100 border border-yellow-400 rounded-lg px-4 py-3 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800 font-medium">
              Business owner has to give you access!
            </span>
            <button
              onClick={() => setShowAccessModal(true)}
              className="text-yellow-700 underline hover:no-underline ml-2"
            >
              Learn More
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Full access - render children normally
  return <>{children}</>;
};

export default CustomerAccessFlow;