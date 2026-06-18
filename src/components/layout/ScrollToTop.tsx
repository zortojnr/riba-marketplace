import React from 'react';
import { useLocation } from 'react-router-dom';

// React Router doesn't reset scroll position on navigation, so without this
// a page can open already scrolled down if the previous page was scrolled.
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
