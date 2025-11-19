import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Store, ShoppingBag, Clock, Heart, Star } from 'lucide-react';

export const CustomerDashboardPage: React.FC = () => {
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
    { name: 'Fashion', icon: ShoppingBag, color: 'bg-pink-100 text-pink-600' },
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
          <Store className="w-5 h-5" />
          Browse Stores
        </Link>
        <Link to="/orders" className="customer-dashboard__action-button customer-dashboard__action-button--secondary">
          <Clock className="w-5 h-5" />
          My Orders
        </Link>
        <Link to="/favorites" className="customer-dashboard__action-button customer-dashboard__action-button--secondary">
          <Heart className="w-5 h-5" />
          Favorites
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
                {typeof category.icon === 'string' ? (
                  <span className="text-2xl">{category.icon}</span>
                ) : (
                  <category.icon className="w-6 h-6" />
                )}
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
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="customer-dashboard__store-rating-text">{store.rating}</span>
                  </div>
                  <div className="customer-dashboard__store-delivery">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="customer-dashboard__store-delivery-text">{store.deliveryTime}</span>
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