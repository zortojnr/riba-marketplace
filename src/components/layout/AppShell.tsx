import React from 'react';
import { useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { MobileBottomNav } from './MobileBottomNav';
import { useAuth } from '@/contexts/AuthContext';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Determine if we should show navigation based on current route and user role
  const isStoreView = location.pathname.startsWith('/store/');
  const isAuthPage = location.pathname.startsWith('/auth');
  const isOnboarding = location.pathname === '/onboarding';
  const isHome = location.pathname === '/';
  const isBusinessOwner = user?.role === 'owner';
  
  // Remove secondary navigation for business owners
  const showTopBar = !isAuthPage && !isOnboarding && !isHome && !isBusinessOwner;
  const showBottomNav = !isAuthPage && !isOnboarding && !isStoreView && !isHome && !isBusinessOwner;

  return (
    <div className="min-h-screen bg-gray-50">
      {showTopBar && <TopBar />}
      
      <main className={showTopBar ? 'pt-16' : ''}>
        {children}
      </main>
      
      {showBottomNav && <MobileBottomNav />}
    </div>
  );
};