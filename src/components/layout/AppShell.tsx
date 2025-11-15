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
  const { user: _user } = useAuth();
  
  // Determine if we should show navigation based on current route
  const isStoreView = location.pathname.startsWith('/store/');
  const isAuthPage = location.pathname === '/auth';
  const isOnboarding = location.pathname === '/onboarding';
  
  const showTopBar = !isAuthPage && !isOnboarding;
  const showBottomNav = !isAuthPage && !isOnboarding && !isStoreView;

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