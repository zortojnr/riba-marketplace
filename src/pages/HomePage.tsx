import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  ShoppingBag, 
  Users, 
  CreditCard, 
  Smartphone, 
  TrendingUp, 
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

export const HomePage: React.FC = () => { 
  const { user, loginDemo, isLoading } = useAuth();
  const [demoLoading, setDemoLoading] = useState<'owner' | 'customer' | null>(null);

  const handleDemoLogin = async (type: 'owner' | 'customer') => {
    setDemoLoading(type);
    try {
      await loginDemo();
    } catch (error) {
      console.error('Demo login failed:', error);
      toast.error('Demo login failed. Please try again.');
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-600 text-white px-4 py-2 z-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        Skip to main content
      </a>

      {/* Simplified Header with Prominent Auth Buttons */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-4 group" aria-label="RIBA Marketplace - Home">
              <motion.div 
                className="relative w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-all duration-500"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <img 
                  src="/assets/images/logo.png" 
                  alt="RIBA Marketplace Logo" 
                  className="w-12 h-12 object-contain filter drop-shadow-lg contrast-125 brightness-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <ShoppingBag className="w-10 h-10 text-emerald-400 drop-shadow-lg hidden" />
              </motion.div>
              <motion.span 
                className="text-3xl font-bold text-white drop-shadow-lg group-hover:text-emerald-300 transition-all duration-500"
                whileHover={{ scale: 1.05 }}
              >
                RIBA
              </motion.span>
            </Link>

            {/* Prominent Auth Buttons - Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link 
                  to="/auth" 
                  className="px-4 py-2 text-gray-100 hover:text-white transition-all duration-300 font-medium text-base border border-gray-600 hover:border-emerald-500 drop-shadow-sm"
                >
                  Sign In
                </Link>
                <Link 
                  to="/auth" 
                  className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white px-6 py-2 font-semibold text-base shadow-lg hover:shadow-emerald-500/40 transition-all duration-500 border border-emerald-400 drop-shadow-sm"
                >
                  Sign Up Free
                </Link>
              </motion.div>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="lg:hidden flex items-center space-x-2">
              <Link 
                to="/auth" 
                className="px-3 py-1.5 text-gray-100 hover:text-white transition-all duration-300 font-medium text-xs border border-gray-600 hover:border-emerald-500"
              >
                Sign In
              </Link>
              <Link 
                to="/auth" 
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1.5 font-semibold text-xs"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="main-content" className="pt-32 pb-20 bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 relative overflow-hidden min-h-screen flex items-center" aria-labelledby="hero-title">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/images/1.jpg" 
            alt="RIBA Marketplace Background - Modern e-commerce platform" 
            className="w-full h-full object-cover opacity-20"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-800/70 to-emerald-900/80"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
              >
                <h1 id="hero-title" className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Launch Your
                  <span className="text-emerald-400"> Online Store</span>
                  <br />in Minutes
                </h1>
                
                <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  RIBA empowers Nigerian businesses to create stunning, mobile-friendly stores, 
                  accept payments seamlessly, and manage orders with unprecedented ease.
                </p>
              </motion.div>

              {/* Primary CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link 
                  to="/auth"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 font-semibold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-emerald-500/25"
                >
                  Start Free Trial
                </Link>
                <Link 
                  to="/auth"
                  className="border-2 border-emerald-500 text-emerald-400 px-8 py-4 font-semibold text-lg hover:bg-emerald-500/10 hover:border-emerald-400 transition-all duration-300"
                >
                  Sign In
                </Link>
              </motion.div>

              {/* Demo Login Buttons */}
              {!user && (
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <p className="text-sm text-gray-200 font-medium drop-shadow-sm">Try our demo accounts:</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <button
                      onClick={() => handleDemoLogin('owner')}
                      disabled={isLoading || demoLoading === 'owner'}
                      className="bg-gray-800/90 text-white px-6 py-3 hover:bg-gray-700/90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 border-2 border-gray-600 hover:border-emerald-500 drop-shadow-sm font-medium"
                    >
                      <Users className="w-4 h-4" />
                      <span>{demoLoading === 'owner' ? 'Logging in...' : 'Demo Store Owner'}</span>
                    </button>
                    <button
                      onClick={() => handleDemoLogin('customer')}
                      disabled={isLoading || demoLoading === 'customer'}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25 border-2 border-blue-500 drop-shadow-sm font-medium"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{demoLoading === 'customer' ? 'Logging in...' : 'Demo Customer'}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="relative mx-auto w-full max-w-md">
                {/* Floating cards effect */}
                <div className="absolute -top-4 -left-4 w-32 h-32 bg-emerald-500/20 rounded-2xl backdrop-blur-sm"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-2xl backdrop-blur-sm"></div>
                
                {/* Main visual */}
                <div className="relative bg-gray-800/50 backdrop-blur-md rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 border border-gray-700">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                      <ShoppingBag className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Your Store, Your Way</h3>
                    <p className="text-gray-200 font-medium">Professional e-commerce made simple</p>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-600">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-300 drop-shadow-lg">5min</div>
                      <div className="text-xs text-gray-200 font-medium">Setup Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-300 drop-shadow-lg">100%</div>
                      <div className="text-xs text-gray-200 font-medium">Mobile Ready</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-300 drop-shadow-lg">24/7</div>
                      <div className="text-xs text-gray-200 font-medium">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Modernized Design */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 relative overflow-hidden">
        {/* Professional Image Layout */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl transform rotate-45 opacity-20">
            <img 
              src="/assets/images/1.jpg" 
              alt="Business success" 
              className="w-full h-full object-cover filter brightness-110"
              loading="lazy"
            />
          </div>
          <div className="absolute bottom-1/4 left-1/4 w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl transform -rotate-12 opacity-20">
            <img 
              src="/assets/images/2.jpg" 
              alt="E-commerce platform" 
              className="w-full h-full object-cover filter brightness-110"
              loading="lazy"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl transform rotate-6 opacity-20">
            <img 
              src="/assets/images/3.jpg" 
              alt="Digital transformation" 
              className="w-full h-full object-cover filter brightness-110"
              loading="lazy"
            />
          </div>
        </div>
        
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need to <span className="text-emerald-400 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Succeed</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Powerful features designed specifically for Nigerian businesses to thrive in the digital marketplace
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Feature 1 - Enhanced Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-500 group hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-105"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-emerald-500/40 transition-all duration-500 transform group-hover:scale-110">
                  <Smartphone className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-all duration-300">Mobile-First Design</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Your store looks perfect on every device. Customers can shop seamlessly from their phones with our responsive design.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
                </div>
                <div className="text-emerald-400 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">Learn more →</div>
              </div>
            </motion.div>

            {/* Feature 2 - Enhanced Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 group hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-blue-500/40 transition-all duration-500 transform group-hover:scale-110">
                  <CreditCard className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-all duration-300">Multiple Payment Options</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Accept payments via cards, bank transfers, mobile money, and cash on delivery with secure processing.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                </div>
                <div className="text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">Learn more →</div>
              </div>
            </motion.div>

            {/* Feature 3 - Enhanced Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 group hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-purple-500/40 transition-all duration-500 transform group-hover:scale-110">
                  <TrendingUp className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-400 transition-all duration-300">Sales Analytics</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Track your sales performance, customer behavior, and inventory in real-time with detailed insights.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                </div>
                <div className="text-purple-400 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">Learn more →</div>
              </div>
            </motion.div>

            {/* Feature 4 - Enhanced Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 hover:border-orange-500/50 transition-all duration-500 group hover:shadow-2xl hover:shadow-orange-500/20 hover:scale-105"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-orange-500/40 transition-all duration-500 transform group-hover:scale-110">
                  <Users className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-orange-400 transition-all duration-300">Customer Management</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Build customer relationships with order history, preferences, and communication tools.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
                </div>
                <div className="text-orange-400 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">Learn more →</div>
              </div>
            </motion.div>

            {/* Feature 5 - Enhanced Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 hover:border-green-500/50 transition-all duration-500 group hover:shadow-2xl hover:shadow-green-500/20 hover:scale-105"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-green-500/40 transition-all duration-500 transform group-hover:scale-110">
                  <CheckCircle className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-green-400 transition-all duration-300">Inventory Management</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Keep track of stock levels, set low-stock alerts, and manage your product catalog.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                </div>
                <div className="text-green-400 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">Learn more →</div>
              </div>
            </motion.div>

            {/* Feature 6 - Enhanced Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 hover:border-red-500/50 transition-all duration-500 group hover:shadow-2xl hover:shadow-red-500/20 hover:scale-105"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-red-500/40 transition-all duration-500 transform group-hover:scale-110">
                  <Star className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-red-400 transition-all duration-300">24/7 Support</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Get help whenever you need it with our dedicated support team and comprehensive resources.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-300 rounded-full"></div>
                </div>
                <div className="text-red-400 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">Learn more →</div>
              </div>
            </motion.div>
          </div>

          {/* CTA - Removed Start Your Journey button as requested */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400 text-lg">No credit card required • 14-day free trial</p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section - Two Column Professional Design */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It <span className="text-emerald-400 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your business with our professional platform. Get your online store up and running efficiently.
            </p>
          </motion.div>

          {/* Two Column Layout */}
          <div className="relative">
            {/* Center Divider - Desktop */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500 transform -translate-x-1/2"></div>
            
            {/* Mobile Divider - Hidden on desktop */}
            <div className="lg:hidden absolute left-8 right-8 top-1/2 h-0.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 transform -translate-y-1/2"></div>

            <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
              {/* Left Column - Setup & Launch */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="bg-gray-800/40 backdrop-blur-xl p-8 border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20">
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 flex items-center justify-center shadow-xl flex-shrink-0">
                      <span className="text-2xl font-bold text-white">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-4">Setup Your Store</h3>
                      <p className="text-gray-300 leading-relaxed mb-6">
                        Create your professional online store in minutes. Choose your store name, upload your branding, and configure payment methods.
                      </p>
                      <div className="relative h-48 rounded-lg overflow-hidden">
                        <img 
                          src="/assets/images/1.jpg" 
                          alt="Store setup process" 
                          className="w-full h-full object-cover filter brightness-90"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/40 backdrop-blur-xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 flex items-center justify-center shadow-xl flex-shrink-0">
                      <span className="text-2xl font-bold text-white">3</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-4">Launch & Grow</h3>
                      <p className="text-gray-300 leading-relaxed mb-6">
                        Launch your store and start accepting orders. Track performance, manage inventory, and scale your business.
                      </p>
                      <div className="relative h-48 rounded-lg overflow-hidden">
                        <img 
                          src="/assets/images/3.jpg" 
                          alt="Business growth" 
                          className="w-full h-full object-cover filter brightness-90"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Products & Manage */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="space-y-8 lg:mt-16"
              >
                <div className="bg-gray-800/40 backdrop-blur-xl p-8 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center shadow-xl flex-shrink-0">
                      <span className="text-2xl font-bold text-white">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-4">Add Your Products</h3>
                      <p className="text-gray-300 leading-relaxed mb-6">
                        Upload product photos, set prices, write descriptions, and organize your catalog. Our bulk upload saves time.
                      </p>
                      <div className="relative h-48 rounded-lg overflow-hidden">
                        <img 
                          src="/assets/images/2.jpg" 
                          alt="Product management" 
                          className="w-full h-full object-cover filter brightness-90"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Link 
                    to="/auth"
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white px-8 py-3 font-bold text-lg shadow-lg hover:shadow-emerald-500/40 transition-all duration-500 transform hover:scale-105"
                  >
                    <span>Start Your Journey</span>
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Pricing Section */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple, <span className="text-emerald-400 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Transparent</span> Pricing
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Choose the perfect plan for your business. No hidden fees, no surprises. Start free and scale as you grow.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-emerald-500/20 group-hover:scale-105">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                  <p className="text-gray-400">Perfect for getting started</p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-white">₦0</span>
                    <span className="text-gray-400 ml-2">/month</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">Up to 10 products</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">Basic mobile store</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">Customer support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">Basic analytics</span>
                  </li>
                </ul>
                
                <Link 
                  to="/auth"
                  className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white py-4 font-semibold text-lg shadow-xl hover:shadow-emerald-500/40 transition-all duration-500 block text-center"
                >
                  Start Free
                </Link>
              </div>
            </motion.div>

            {/* Professional Plan - Featured */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative group scale-105 z-10"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white px-6 py-2 text-sm font-semibold shadow-xl z-20">
                Most Popular
              </div>
              <div className="bg-gray-800/60 backdrop-blur-xl p-8 border-2 border-blue-500/80 hover:border-blue-400/80 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/30 group-hover:scale-105">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                  <p className="text-gray-400">For growing businesses</p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-white">₦15,000</span>
                    <span className="text-gray-400 ml-2">/month</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">Up to 100 products</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">Advanced mobile store</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">Priority support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">Advanced analytics</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">Custom domain</span>
                  </li>
                </ul>
                
                <Link 
                  to="/auth"
                  className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white py-4 font-semibold text-lg shadow-xl hover:shadow-blue-500/40 transition-all duration-500 block text-center"
                >
                  Start Professional
                </Link>
              </div>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/20 group-hover:scale-105">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                  <p className="text-gray-400">For large businesses</p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-white">₦50,000</span>
                    <span className="text-gray-400 ml-2">/month</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">Unlimited products</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">Premium mobile store</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">Dedicated support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">Advanced analytics</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">API access</span>
                  </li>
                </ul>
                
                <Link 
                  to="/auth"
                  className="w-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white py-4 font-semibold text-lg shadow-xl hover:shadow-purple-500/40 transition-all duration-500 block text-center"
                >
                  Start Enterprise
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Pricing CTA */}
          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400 text-lg mb-8">All plans include a 14-day free trial • No credit card required</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/auth"
                className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white px-8 py-4 font-semibold text-lg shadow-xl hover:shadow-emerald-500/40 transition-all duration-500"
              >
                Start Your Free Trial
              </Link>
              <button className="border-2 border-gray-600 text-gray-300 px-8 py-4 font-semibold text-lg hover:bg-gray-800/50 hover:border-emerald-500 transition-all duration-500">
                Compare All Features
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-6 group">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300">
                  <img 
                    src="/assets/images/logo.png" 
                    alt="RIBA Marketplace" 
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <ShoppingBag className="w-6 h-6 text-white hidden" />
                </div>
                <span className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">RIBA</span>
              </Link>
              
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Built by the Riba Project Team. Empowering Nigerian businesses with professional e-commerce solutions. 
                Create your online store in minutes and start selling today.
              </p>
              
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-all duration-300 transform hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-all duration-300 transform hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21.08 8.12 21.08 16.24 21.08 20.96 14.46 20.96 8.73c0-.21 0-.42-.01-.63.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-all duration-300 transform hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-all duration-300 transform hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/auth" className="text-gray-300 hover:text-emerald-400 transition-all duration-300 flex items-center space-x-2 group">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span>Sign Up</span>
                  </Link>
                </li>
                <li>
                  <Link to="/auth" className="text-gray-300 hover:text-emerald-400 transition-all duration-300 flex items-center space-x-2 group">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span>Sign In</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 group">
                  <Phone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">+234 808 825 6055</span>
                </li>
                <li className="flex items-center space-x-3 group">
                  <Mail className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">hello@riba.ng</span>
                </li>
                <li className="flex items-center space-x-3 group">
                  <MapPin className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Yola, Nigeria</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 RIBA. All rights reserved. Built with ❤️ for Nigerian businesses.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Built by the Riba Project Team - Empowering African Entrepreneurs
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};