import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, TrendingUp, Users, Settings, Plus } from 'lucide-react';
import { ShareStore } from '@/components/sharing/ShareStore';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Redirect customers to customer dashboard
  if (user?.role === 'customer') {
    return <CustomerDashboardContent />;
  }

  // Business owner dashboard
  return <BusinessOwnerDashboard />;
};

const CustomerDashboardContent: React.FC = () => {
  const { user } = useAuth();

  const featuredStores = [
    {
      id: '1',
      name: 'Amina\'s Fashion Hub',
      description: 'Latest African fashion and accessories',
      logo: '/assets/images/store-placeholder.png',
      rating: 4.8,
      deliveryTime: '30-45 min',
      categories: ['Fashion', 'Accessories'],
    },
    {
      id: '2',
      name: 'Fresh Mart',
      description: 'Fresh groceries and organic products',
      logo: '/assets/images/store-placeholder.png',
      rating: 4.6,
      deliveryTime: '20-30 min',
      categories: ['Groceries', 'Organic'],
    },
    {
      id: '3',
      name: 'Tech Zone',
      description: 'Latest gadgets and electronics',
      logo: '/assets/images/store-placeholder.png',
      rating: 4.9,
      deliveryTime: '45-60 min',
      categories: ['Electronics', 'Gadgets'],
    },
  ];

  const recentOrders = [
    {
      id: '#ORD-001',
      store: 'Amina\'s Fashion Hub',
      items: 2,
      total: '₦15,000',
      status: 'delivered',
      date: '2024-01-15',
    },
    {
      id: '#ORD-002',
      store: 'Fresh Mart',
      items: 5,
      total: '₦8,500',
      status: 'preparing',
      date: '2024-01-16',
    },
  ];

  const quickCategories = [
    { name: 'Fashion', icon: '🛍️', color: 'bg-pink-100 text-pink-600' },
    { name: 'Food', icon: '🍔', color: 'bg-orange-100 text-orange-600' },
    { name: 'Electronics', icon: '💻', color: 'bg-blue-100 text-blue-600' },
    { name: 'Groceries', icon: '🥬', color: 'bg-green-100 text-green-600' },
    { name: 'Beauty', icon: '💄', color: 'bg-purple-100 text-purple-600' },
    { name: 'Home', icon: '🏠', color: 'bg-yellow-100 text-yellow-600' },
  ];

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
        <Link to="/favorites" className="customer-dashboard__action-button customer-dashboard__action-button--secondary">
          ❤️ Favorites
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
          {quickCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="customer-dashboard__category-card"
            >
              <div className={`customer-dashboard__category-icon ${category.color}`}>
                <span className="text-2xl">{category.icon}</span>
              </div>
              <span className="customer-dashboard__category-name">{category.name}</span>
            </motion.div>
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
        <div className="customer-dashboard__store-grid">
          {featuredStores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -4 }}
              className="customer-dashboard__store-card"
            >
              <div className="customer-dashboard__store-image">
                <img 
                  src={store.logo} 
                  alt={store.name} 
                  className="customer-dashboard__store-logo"
                />
              </div>
              <div className="customer-dashboard__store-info">
                <h3 className="customer-dashboard__store-name">{store.name}</h3>
                <p className="customer-dashboard__store-description">{store.description}</p>
                <div className="customer-dashboard__store-meta">
                  <div className="customer-dashboard__store-rating">
                    <span className="customer-dashboard__store-rating-text">⭐ {store.rating}</span>
                  </div>
                  <div className="customer-dashboard__store-delivery">
                    <span className="customer-dashboard__store-delivery-text">🕒 {store.deliveryTime}</span>
                  </div>
                </div>
                <div className="customer-dashboard__store-categories">
                  {store.categories.map((category) => (
                    <span key={category} className="customer-dashboard__store-category">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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
        <div className="customer-dashboard__order-list">
          {recentOrders.map((order) => (
            <div key={order.id} className="customer-dashboard__order-card">
              <div className="customer-dashboard__order-info">
                <div className="customer-dashboard__order-store">{order.store}</div>
                <div className="customer-dashboard__order-details">
                  {order.items} items • {order.total}
                </div>
                <div className="customer-dashboard__order-date">{order.date}</div>
              </div>
              <div className="customer-dashboard__order-status">
                <span className={`customer-dashboard__order-status-badge customer-dashboard__order-status-badge--${order.status}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const BusinessOwnerDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Orders',
      value: '24',
      change: '+12%',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Revenue',
      value: '₦125,000',
      change: '+8%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Products',
      value: '12',
      change: '+2',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Customers',
      value: '156',
      change: '+23',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const recentOrders = [
    {
      id: '#ORD-001',
      customer: 'Amina Bello',
      amount: '₦15,000',
      status: 'pending',
      date: '2024-01-15',
    },
    {
      id: '#ORD-002',
      customer: 'Usman Abdullahi',
      amount: '₦8,500',
      status: 'confirmed',
      date: '2024-01-14',
    },
    {
      id: '#ORD-003',
      customer: 'Hafsa Aliyu',
      amount: '₦22,000',
      status: 'delivered',
      date: '2024-01-13',
    },
  ];

  const topProducts = [
    {
      name: 'Tuwo Shinkafa',
      sales: 45,
      revenue: '₦67,500',
    },
    {
      name: 'Suya',
      sales: 32,
      revenue: '₦48,000',
    },
    {
      name: 'Dambu Nama',
      sales: 28,
      revenue: '₦14,000',
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
              Here's what's happening with your store today.
            </p>
            {user?.email === 'demo@riba.local' && (
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
                to="/products/new"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </motion.div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-card shadow-sm border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{order.amount}</p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{order.date}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200">
                <Link
                  to="/orders"
                  className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                >
                  View all orders →
                </Link>
              </div>
            </motion.div>

            {/* Top Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-card shadow-sm border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.sales} sales</p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900">{product.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200">
                <Link
                  to="/products"
                  className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                >
                  View all products →
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Share Store Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ShareStore 
              storeName="Demo Store" 
              storeUrl="https://riba.store/demo-store" 
              themeColor="#3B82F6"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};