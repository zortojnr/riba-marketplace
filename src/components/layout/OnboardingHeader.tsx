import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const OnboardingHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 rounded-full overflow-hidden">
                <img
                  src="/assets/images/logo.png"
                  alt="RIBA Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          </div>
          
          {/* Back Button */}
          <Link
            to="/"
            className="flex items-center gap-2 min-h-[44px] px-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
      </div>
    </header>
  );
};