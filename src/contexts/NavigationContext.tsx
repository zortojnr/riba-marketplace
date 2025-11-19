import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigation } from '@/hooks/useNavigation';
import type { NavigationItem } from '@/hooks/useNavigation';


interface NavigationContextType {
  isNavigating: boolean;
  navigationHistory: string[];
  currentRoute: NavigationItem | null;
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
  navigateTo: (path: string, replace?: boolean) => void;
  addToHistory: (path: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {

  const { currentRoute, goBack: routerGoBack, navigateTo } = useNavigation();
  
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < navigationHistory.length - 1;

  useEffect(() => {
    if (currentRoute) {
      addToHistory(currentRoute.path);
    }
  }, [currentRoute]);

  const addToHistory = (path: string) => {
    if (navigationHistory[historyIndex] === path) {
      return; // Don't add duplicate consecutive entries
    }

    const newHistory = navigationHistory.slice(0, historyIndex + 1);
    newHistory.push(path);
    setNavigationHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (canGoBack) {
      setIsNavigating(true);
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      routerGoBack();
      setTimeout(() => setIsNavigating(false), 300);
    }
  };

  const goForward = () => {
    if (canGoForward) {
      setIsNavigating(true);
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      navigateTo(navigationHistory[newIndex]);
      setTimeout(() => setIsNavigating(false), 300);
    }
  };

  const handleNavigateTo = (path: string, replace = false) => {
    setIsNavigating(true);
    navigateTo(path, replace);
    
    if (!replace) {
      addToHistory(path);
    }
    
    setTimeout(() => setIsNavigating(false), 300);
  };

  const value: NavigationContextType = {
    isNavigating,
    navigationHistory,
    currentRoute: currentRoute || null,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    navigateTo: handleNavigateTo,
    addToHistory
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};