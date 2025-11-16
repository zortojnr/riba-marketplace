import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface TopBarProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuToggle, isMenuOpen }) => {
  const { user } = useAuth();
  const cart = useCart(); // CartContextType extends Cart, so we can use it directly
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemsCount = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);

  const handleAuthClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <header className="bg-white border-b border-muted-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Menu Toggle */}
          <div className="flex items-center space-x-4">
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="p-2 rounded-lg text-muted-600 hover:text-primary-600 hover:bg-primary-50 transition-colors lg:hidden"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/assets/images/logo.svg" 
                alt="RIBA Logo" 
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-xl font-bold text-gray-900">RIBA</span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-primary-600'
                  : 'text-muted-600 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/dashboard'
                    ? 'text-primary-600'
                    : 'text-muted-600 hover:text-primary-600'
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <button
              onClick={handleCartClick}
              className="relative p-2 rounded-lg text-muted-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={handleAuthClick}
                className="flex items-center space-x-2 p-2 rounded-lg text-muted-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:block text-sm font-medium">
                  {user ? user.name : 'Sign In'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};