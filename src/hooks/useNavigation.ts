import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export interface NavigationItem {
  path: string;
  label: string;
  icon?: string;
  requiresAuth?: boolean;
  roles?: string[];
  breadcrumb?: string;
}

export const navigationRoutes: NavigationItem[] = [
  { path: '/', label: 'Home', breadcrumb: 'Home' },
  { path: '/auth', label: 'Sign In', breadcrumb: 'Authentication' },
  { path: '/store/:slug', label: 'Store', breadcrumb: 'Store' },
  { path: '/cart', label: 'Cart', breadcrumb: 'Shopping Cart', requiresAuth: false },
  { path: '/checkout', label: 'Checkout', breadcrumb: 'Checkout', requiresAuth: true },
  { path: '/products', label: 'Products', breadcrumb: 'Products', requiresAuth: true },
  { path: '/orders', label: 'Orders', breadcrumb: 'Orders', requiresAuth: true },
  { path: '/settings', label: 'Settings', breadcrumb: 'Settings', requiresAuth: true },
  { path: '/onboarding', label: 'Onboarding', breadcrumb: 'Getting Started' },
];

export const useNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentRoute = useMemo(() => {
    return navigationRoutes.find(route => {
      if (route.path.includes(':')) {
        const pattern = route.path.replace(/:\w+/g, '\\w+');
        return new RegExp(`^${pattern}$`).test(location.pathname);
      }
      return route.path === location.pathname;
    });
  }, [location.pathname]);

  const getBreadcrumbs = useCallback(() => {
    const breadcrumbs: Array<{ path: string; label: string; isLast: boolean }> = [];
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const route = navigationRoutes.find(r => {
        if (r.path.includes(':')) {
          const pattern = r.path.replace(/:\w+/g, segment);
          return pattern === currentPath;
        }
        return r.path === currentPath;
      });
      
      if (route) {
        breadcrumbs.push({
          path: currentPath,
          label: route.breadcrumb || route.label,
          isLast: index === pathSegments.length - 1
        });
      }
    });
    
    return breadcrumbs.length > 0 ? breadcrumbs : [{ path: '/', label: 'Home', isLast: true }];
  }, [location.pathname]);

  const navigateTo = useCallback((path: string, replace = false) => {
    navigate(path, { replace });
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const canAccessRoute = useCallback((route: NavigationItem, userRole?: string, isAuthenticated = false) => {
    if (route.requiresAuth && !isAuthenticated) {
      return false;
    }
    
    if (route.roles && userRole && !route.roles.includes(userRole)) {
      return false;
    }
    
    return true;
  }, []);

  const getNavigationState = useCallback(() => {
    return {
      currentPath: location.pathname,
      currentRoute: currentRoute || { path: location.pathname, label: 'Unknown' },
      breadcrumbs: getBreadcrumbs(),
      canGoBack: window.history.length > 1,
      searchParams: Object.fromEntries(new URLSearchParams(location.search)),
      hash: location.hash
    };
  }, [location, currentRoute, getBreadcrumbs]);

  return {
    currentRoute,
    getBreadcrumbs,
    navigateTo,
    goBack,
    canAccessRoute,
    getNavigationState,
    navigationRoutes
  };
};