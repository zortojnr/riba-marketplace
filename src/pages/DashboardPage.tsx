import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { Package, ShoppingCart, ExternalLink, Settings, Plus, Store as StoreIcon } from 'lucide-react';
import { ShareStore } from '@/components/sharing/ShareStore';
import { supabase } from '@/lib/supabase';
import { mapStoreRowToStore, mapOrderRowToOrder, type StoreRow, type OrderRow } from '@/lib/mappers';
import type { Store, Order } from '@/types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Redirect customers to customer dashboard
  if (user?.role === 'customer') {
    return <CustomerDashboardContent />;
  }

  // Business owner dashboard
  return <BusinessOwnerDashboard />;
};

const QUICK_CATEGORIES: { value: NonNullable<Store['businessType']>; label: string; icon: string; color: string }[] = [
  { value: 'food', label: 'Food', icon: '🍔', color: 'bg-orange-100 text-orange-600' },
  { value: 'products', label: 'Products', icon: '🛍️', color: 'bg-pink-100 text-pink-600' },
  { value: 'services', label: 'Services', icon: '🧰', color: 'bg-blue-100 text-blue-600' },
];

type RecentOrder = Order & { storeName: string; storeSlug: string };

const CustomerDashboardContent: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [featuredStores, setFeaturedStores] = React.useState<Store[]>([]);
  const [recentOrders, setRecentOrders] = React.useState<RecentOrder[]>([]);

  React.useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);

      const [{ data: storeRows }, { data: orderRows }] = await Promise.all([
        supabase
          .from('stores')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('orders')
          .select('*, order_items(*), stores(name, slug)')
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3),
      ]);
      if (cancelled) return;

      setFeaturedStores(((storeRows ?? []) as StoreRow[]).map(mapStoreRowToStore));

      type JoinedOrderRow = OrderRow & { stores: { name: string; slug: string } | null };
      setRecentOrders(
        ((orderRows ?? []) as JoinedOrderRow[]).map((row) => ({
          ...mapOrderRowToOrder(row),
          storeName: row.stores?.name ?? 'Store',
          storeSlug: row.stores?.slug ?? '',
        }))
      );

      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return (
    <div className="customer-dashboard">
      
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="customer-dashboard__welcome"
      >
        <h1 className="customer-dashboard__title">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="customer-dashboard__subtitle">
          Discover amazing products from local businesses
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="customer-dashboard__actions"
      >
        <Link to="/stores" className="customer-dashboard__action-button customer-dashboard__action-button--primary">
          🛍️ Browse Stores
        </Link>
        <Link to="/orders" className="customer-dashboard__action-button customer-dashboard__action-button--secondary">
          📋 My Orders
        </Link>
      </motion.div>

      {/* Quick Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="customer-dashboard__categories"
      >
        <h2 className="customer-dashboard__section-title">Shop by Category</h2>
        <div className="customer-dashboard__category-grid">
          {QUICK_CATEGORIES.map((category, index) => (
            <Link key={category.value} to={`/stores?type=${category.value}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="customer-dashboard__category-card"
              >
                <div className={`customer-dashboard__category-icon ${category.color}`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <span className="customer-dashboard__category-name">{category.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Featured Stores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="customer-dashboard__stores"
      >
        <div className="customer-dashboard__stores-header">
          <h2 className="customer-dashboard__section-title">Featured Stores</h2>
          <Link to="/stores" className="customer-dashboard__view-all">
            View all stores →
          </Link>
        </div>
        {loading ? (
          <p className="text-gray-600">Loading stores...</p>
        ) : featuredStores.length === 0 ? (
          <p className="text-gray-600">No stores have joined RIBA yet.</p>
        ) : (
          <div className="customer-dashboard__store-grid">
            {featuredStores.map((store, index) => (
              <Link key={store.id} to={`/store/${store.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="customer-dashboard__store-card"
                >
                  <div className="customer-dashboard__store-image">
                    <div className="customer-dashboard__store-logo flex items-center justify-center bg-emerald-100">
                      <StoreIcon className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                  <div className="customer-dashboard__store-info">
                    <h3 className="customer-dashboard__store-name">{store.name}</h3>
                    <p className="customer-dashboard__store-description">{store.description}</p>
                    {store.businessType && (
                      <div className="customer-dashboard__store-categories">
                        <span className="customer-dashboard__store-category capitalize">
                          {store.businessType}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="customer-dashboard__orders"
      >
        <div className="customer-dashboard__orders-header">
          <h2 className="customer-dashboard__section-title">Recent Orders</h2>
          <Link to="/orders" className="customer-dashboard__view-all">
            View all orders →
          </Link>
        </div>
        {loading ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : recentOrders.length === 0 ? (
          <p className="text-gray-600">You haven't placed any orders yet.</p>
        ) : (
          <div className="customer-dashboard__order-list">
            {recentOrders.map((order) => (
              <div key={order.id} className="customer-dashboard__order-card">
                <div className="customer-dashboard__order-info">
                  <div className="customer-dashboard__order-store">{order.storeName}</div>
                  <div className="customer-dashboard__order-details">
                    {order.items.length} items • {order.total.toLocaleString('en-NG', { style: 'currency', currency: order.currency, minimumFractionDigits: 0 })}
                  </div>
                  <div className="customer-dashboard__order-date">{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="customer-dashboard__order-status">
                  <span className={`customer-dashboard__order-status-badge customer-dashboard__order-status-badge--${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

const BusinessOwnerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [store, setStore] = React.useState<Store | null>(null);
  const [productCount, setProductCount] = React.useState(0);
  const [orderCount, setOrderCount] = React.useState(0);

  React.useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data: storeRow, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();
      if (cancelled) return;

      if (storeError || !storeRow) {
        setStore(null);
        setLoading(false);
        return;
      }

      const mappedStore = mapStoreRowToStore(storeRow as StoreRow);
      setStore(mappedStore);

      const [{ count: products }, { count: orders }] = await Promise.all([
        supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('store_id', mappedStore.id),
        supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('store_id', mappedStore.id),
      ]);
      if (cancelled) return;

      setProductCount(products ?? 0);
      setOrderCount(orders ?? 0);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-16 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-10 h-10 text-emerald-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return <Navigate to="/onboarding" replace />;
  }

  const storeUrl = `${window.location.origin}/store/${store.slug}`;

  const stats = [
    {
      title: 'Total Orders',
      value: orderCount,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Products',
      value: productCount,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening with {store.name} today.
            </p>
            <Link
              to={`/store/${store.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              View your storefront
            </Link>
            {user?.email?.endsWith('@riba.demo') && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 text-xs rounded-full border border-gray-200 text-gray-700">
                <span>Demo Mode</span>
                <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="btn btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </Link>
              <Link
                to="/settings"
                className="btn btn-outline flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Store Settings</span>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-card shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-card shadow-sm border border-gray-200 mb-8"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            </div>
            {orderCount === 0 ? (
              <div className="p-8 text-center">
                <ShoppingCart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No orders yet.</p>
                <p className="text-sm text-gray-500">Orders placed on your storefront will show up here.</p>
              </div>
            ) : (
              <div className="p-4 border-t border-gray-200">
                <Link
                  to="/orders"
                  className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                >
                  View all orders →
                </Link>
              </div>
            )}
          </motion.div>

          {/* Share Store Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ShareStore
              storeName={store.name}
              storeUrl={storeUrl}
              themeColor={store.themeColor || '#3B82F6'}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};