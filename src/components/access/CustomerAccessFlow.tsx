import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { mapStoreRowToStore, type StoreRow } from '@/lib/mappers';
import type { Store } from '@/types';

interface CustomerAccessFlowProps {
  businessSlug: string;
  children: React.ReactNode;
}

interface BusinessAccess {
  accessType: 'full' | 'none';
  store?: Store;
}

export const CustomerAccessFlow: React.FC<CustomerAccessFlowProps> = ({
  businessSlug,
  children,
}) => {
  const navigate = useNavigate();
  const [accessStatus, setAccessStatus] = useState<BusinessAccess | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkBusinessAccess();
  }, [businessSlug]);

  const checkBusinessAccess = async () => {
    setLoading(true);

    // Active stores (and the owner's own inactive store) are readable by
    // anyone via RLS, so a successful fetch here means real, full access.
    // There's no partial/"restricted" access concept in the schema.
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('slug', businessSlug)
      .maybeSingle();

    if (error || !data) {
      setAccessStatus({ accessType: 'none' });
      setLoading(false);
      return;
    }

    setAccessStatus({ accessType: 'full', store: mapStoreRowToStore(data as StoreRow) });
    setLoading(false);
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">Store Not Found</h3>
            <p className="text-gray-600 mb-6">This store doesn't exist or is no longer active.</p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 font-semibold transition-colors"
            >
              Browse Available Stores
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <AccessContext.Provider value={accessStatus}>
      {children}
    </AccessContext.Provider>
  );
};

export default CustomerAccessFlow;

// Access context and hook to allow children to read access status
const AccessContext = createContext<BusinessAccess | null>(null);
export const useCustomerAccess = () => useContext(AccessContext);
