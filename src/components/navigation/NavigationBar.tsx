import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Settings, Package, ShoppingCart, Menu, X, ArrowLeft, TrendingUp, Users, Shield, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigationContext } from '@/contexts/NavigationContext';
import { useCart } from '@/contexts/CartContext';
import { Breadcrumb } from './Breadcrumb';

interface NavigationBarProps {
  className?: string;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ className = '' }) => {
  const { user, logout } = useAuth();
  const { goBack } = useNavigationContext();
  const { getItemCount } = useCart();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const profileMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isProfileMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: '/products', label: 'Products', icon: Package, requiresAuth: true },
    { path: '/orders', label: 'Orders', icon: ShoppingCart, requiresAuth: true },
    { path: '/settings', label: 'Settings', icon: Settings, requiresAuth: true },
  ];

  // Business owner specific navigation items
  const businessOwnerItems = [
    { path: '/products', label: 'Products', icon: Package, requiresAuth: true },
    { path: '/orders', label: 'Orders', icon: ShoppingCart, requiresAuth: true },
    { path: '/analytics', label: 'Analytics', icon: TrendingUp, requiresAuth: true },
    { path: '/customers', label: 'Customers', icon: Users, requiresAuth: true },
    { path: '/settings', label: 'Settings', icon: Settings, requiresAuth: true },
  ];

  // Admin-only navigation
  const adminItems = [
    { path: '/admin', label: 'Admin', icon: Shield, requiresAuth: true },
  ];

  // Use role-specific navigation
  const activeNavItems =
    user?.role === 'owner' ? businessOwnerItems : user?.role === 'admin' ? adminItems : navigationItems;
  const filteredNavItems = activeNavItems.filter(item => {
    if (item.requiresAuth && !user) return false;
    return true;
  });

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const cartItemCount = getItemCount();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`bg-white border-b border-gray-200 sticky top-0 z-50 ${className}`} role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section - Logo and Back button */}
          <div className="flex items-center">
            <button
              onClick={goBack}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <Link to="/" className="flex items-center" aria-label="RIBA Home">
              <img
                src="/assets/images/logo.png"
                alt="RIBA"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">RIBA</span>
            </Link>
          </div>

          {/* Center section - Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive(item.path)
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  aria-label={item.label}
                >
                  <Icon className="w-4 h-4 mr-2" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right section - User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                {user.role !== 'owner' && (
                  <Link
                    to="/cart"
                    className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="View cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </span>
                    )}
                  </Link>
                )}

                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen((open) => !open)}
                    className="hidden md:flex items-center space-x-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-haspopup="menu"
                    aria-expanded={isProfileMenuOpen}
                    aria-label="Open profile menu"
                  >
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    </div>
                    {!location.pathname.startsWith('/store') && (
                      <span className="text-sm text-gray-700">{user.name}</span>
                    )}
                    <ChevronDown className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  </button>

                  {/* Mobile: tapping the avatar opens the menu too */}
                  <button
                    onClick={() => setIsProfileMenuOpen((open) => !open)}
                    className="md:hidden flex items-center justify-center w-9 h-9 bg-emerald-100 rounded-full"
                    aria-haspopup="menu"
                    aria-expanded={isProfileMenuOpen}
                    aria-label="Open profile menu"
                  >
                    <User className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  </button>

                  {isProfileMenuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        role="menuitem"
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  aria-current={isActive('/auth') ? 'page' : undefined}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="border-t border-gray-200 pt-2 pb-2">
          <Breadcrumb />
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="mobile-menu-button"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors
                  ${isActive(item.path)
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
                role="menuitem"
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                <Icon className="w-5 h-5 mr-3" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};