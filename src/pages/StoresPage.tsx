import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store as StoreIcon, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { mapStoreRowToStore, type StoreRow } from '@/lib/mappers';
import type { Store } from '@/types';

const BUSINESS_TYPES: { value: NonNullable<Store['businessType']>; label: string }[] = [
  { value: 'food', label: 'Food & Restaurant' },
  { value: 'products', label: 'Products & Retail' },
  { value: 'services', label: 'Services' },
];

export const StoresPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeFilter = searchParams.get('type');
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      let query = supabase
        .from('stores')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (typeFilter) {
        query = query.eq('business_type', typeFilter);
      }
      const { data, error } = await query;
      if (cancelled) return;

      if (error) {
        toast.error('Failed to load stores');
        setStores([]);
      } else {
        setStores((data as StoreRow[]).map(mapStoreRowToStore));
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [typeFilter]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Stores</h1>
          <p className="text-gray-600">Discover storefronts from local businesses</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSearchParams({})}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              !typeFilter ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
            }`}
          >
            All
          </button>
          {BUSINESS_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setSearchParams({ type: type.value })}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                typeFilter === type.value ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <StoreIcon className="w-10 h-10 text-emerald-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading stores...</p>
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-16">
            <StoreIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stores yet</h3>
            <p className="text-gray-600">Check back soon as more businesses join RIBA.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/store/${store.slug}`}
                  className="block bg-white rounded-card shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-emerald-300 transition-all h-full"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <StoreIcon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{store.name}</h3>
                      {store.businessType && (
                        <span className="text-xs text-emerald-700 capitalize">{store.businessType}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{store.description}</p>
                  {(store.city || store.state) && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{[store.city, store.state].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoresPage;
