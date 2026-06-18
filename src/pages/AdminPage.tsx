import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Store as StoreIcon, Package, ShoppingCart, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/utils';
import type { StoreRow } from '@/lib/mappers';

interface StoreWithOwner extends StoreRow {
  profiles: { email: string } | null;
}

interface RecentOrderRow {
  id: string;
  total: number;
  currency: 'NGN' | 'USD';
  status: string;
  created_at: string;
  customer_name: string;
  stores: { name: string } | null;
}

interface PlatformCounts {
  stores: number;
  products: number;
  orders: number;
  users: number;
}

export const AdminPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<PlatformCounts>({ stores: 0, products: 0, orders: 0, users: 0 });
  const [stores, setStores] = useState<StoreWithOwner[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrderRow[]>([]);
  const [togglingStoreId, setTogglingStoreId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);

    const [
      { count: storeCount },
      { count: productCount },
      { count: orderCount },
      { count: userCount },
      { data: storeRows, error: storeError },
      { data: orderRows, error: orderError },
    ] = await Promise.all([
      supabase.from('stores').select('id', { count: 'exact', head: true }),
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('stores').select('*, profiles(email)').order('created_at', { ascending: false }),
      supabase
        .from('orders')
        .select('id, total, currency, status, created_at, customer_name, stores(name)')
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    if (storeError || orderError) {
      toast.error('Failed to load some admin data');
    }

    setCounts({
      stores: storeCount ?? 0,
      products: productCount ?? 0,
      orders: orderCount ?? 0,
      users: userCount ?? 0,
    });
    setStores((storeRows ?? []) as StoreWithOwner[]);
    setRecentOrders((orderRows ?? []) as unknown as RecentOrderRow[]);
    setLoading(false);
  };

  const toggleStoreActive = async (store: StoreWithOwner) => {
    setTogglingStoreId(store.id);
    const { error } = await supabase
      .from('stores')
      .update({ is_active: !store.is_active })
      .eq('id', store.id);

    if (error) {
      toast.error('Failed to update store status');
    } else {
      setStores((prev) =>
        prev.map((s) => (s.id === store.id ? { ...s, is_active: !s.is_active } : s))
      );
      toast.success(`${store.name} is now ${!store.is_active ? 'active' : 'inactive'}`);
    }
    setTogglingStoreId(null);
  };

  const statCards = [
    { title: 'Total Stores', value: counts.stores, icon: StoreIcon, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    { title: 'Total Products', value: counts.products, icon: Package, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { title: 'Total Orders', value: counts.orders, icon: ShoppingCart, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Total Users', value: counts.users, icon: Users, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin</h1>
          <p className="text-gray-600">Platform-wide visibility and store moderation</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-card shadow-sm border border-gray-200 p-6"
            >
              <div className={`inline-flex p-3 rounded-lg ${stat.bgColor} mb-4`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Stores table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-card shadow-sm border border-gray-200 mb-8"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Stores</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{store.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{store.profiles?.email ?? 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          store.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {store.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => toggleStoreActive(store)}
                        disabled={togglingStoreId === store.id}
                        className="text-primary-600 hover:text-primary-500 font-medium disabled:opacity-50"
                      >
                        {togglingStoreId === store.id ? 'Updating...' : store.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {stores.length === 0 && (
              <div className="text-center py-12">
                <StoreIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No stores have been created yet.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent orders (read-only) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-card shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders (Platform-wide)</h2>
            <p className="text-sm text-gray-500 mt-1">Read-only. Order status is managed by the store owner.</p>
          </div>
          <div className="divide-y divide-gray-200">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{order.stores?.name ?? 'Store'}</p>
                  <p className="text-sm text-gray-600">{order.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(order.total, order.currency)}</p>
                  <p className="text-sm text-gray-500">{order.status} • {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No orders have been placed yet.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;
