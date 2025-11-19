import { useEffect, useCallback } from 'react';

interface KeyboardNavigationOptions {
  enabled?: boolean;
  focusableElements?: string;
  trapFocus?: boolean;
  onEscape?: () => void;
  onEnter?: () => void;
  onTab?: (e: KeyboardEvent) => void;
  onArrowKeys?: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export const useKeyboardNavigation = (ref: React.RefObject<HTMLElement>, options: KeyboardNavigationOptions = {}) => {
  const {
    enabled = true,
    focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    trapFocus = false,
    onEscape,
    onEnter,
    onTab,
    onArrowKeys,
  } = options;

  const getFocusableElements = useCallback(() => {
    if (!ref.current) return [];
    return Array.from(ref.current.querySelectorAll(focusableElements)) as HTMLElement[];
  }, [ref, focusableElements]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    const focusableElements = getFocusableElements();
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

    switch (e.key) {
      case 'Escape':
        if (onEscape) {
          e.preventDefault();
          onEscape();
        }
        break;

      case 'Enter':
        if (onEnter) {
          e.preventDefault();
          onEnter();
        }
        break;

      case 'Tab':
        if (onTab) {
          onTab(e);
        }
        
        if (trapFocus && focusableElements.length > 0) {
          e.preventDefault();
          
          if (e.shiftKey) {
            // Shift + Tab (previous)
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
            focusableElements[prevIndex].focus();
          } else {
            // Tab (next)
            const nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
            focusableElements[nextIndex].focus();
          }
        }
        break;

      case 'ArrowUp':
        if (onArrowKeys) {
          e.preventDefault();
          onArrowKeys('up');
        }
        break;

      case 'ArrowDown':
        if (onArrowKeys) {
          e.preventDefault();
          onArrowKeys('down');
        }
        break;

      case 'ArrowLeft':
        if (onArrowKeys) {
          e.preventDefault();
          onArrowKeys('left');
        }
        break;

      case 'ArrowRight':
        if (onArrowKeys) {
          e.preventDefault();
          onArrowKeys('right');
        }
        break;
    }
  }, [enabled, getFocusableElements, onEscape, onEnter, onTab, onArrowKeys, trapFocus]);

  const focusFirstElement = useCallback(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, [getFocusableElements]);

  const focusLastElement = useCallback(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }, [getFocusableElements]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref, handleKeyDown]);

  return {
    focusFirstElement,
    focusLastElement,
    getFocusableElements,
  };
};

// Hook for managing focus within a modal or dialog
export const useFocusTrap = (ref: React.RefObject<HTMLElement>, isOpen: boolean) => {
  useEffect(() => {
    if (!isOpen || !ref.current) return;

    const focusableElements = ref.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element when opened
    setTimeout(() => firstElement.focus(), 100);

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    ref.current.addEventListener('keydown', handleTabKey);

    return () => {
      ref.current?.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, ref]);
};

// Hook for managing skip links for accessibility
export const useSkipLinks = () => {
  useEffect(() => {
    const handleSkipLink = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        const skipLink = document.getElementById('skip-to-content');
        if (skipLink) {
          skipLink.focus();
        }
      }
    };

    document.addEventListener('keydown', handleSkipLink);

    return () => {
      document.removeEventListener('keydown', handleSkipLink);
    };
  }, []);
};

// Hook for announcing navigation changes to screen readers
export const useNavigationAnnouncements = () => {
  const announceNavigation = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announceNavigation };
};