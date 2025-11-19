import React from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationBar } from '../navigation/NavigationBar';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const location = useLocation();
  
  // Don't show navigation bar on auth pages and onboarding pages
  const shouldShowNavBar = !location.pathname.startsWith('/auth') && !location.pathname.startsWith('/onboarding');
  
  return (
    <>
      {shouldShowNavBar && <NavigationBar />}
      {children}
    </>
  );
};