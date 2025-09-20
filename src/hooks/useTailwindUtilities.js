import { useState, useEffect } from 'react';

/**
 * Hook để detect responsive breakpoints
 * Sử dụng breakpoints từ Tailwind config
 */
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('desktop');

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width <= 480) {
        setBreakpoint('mobile');
      } else if (width <= 768) {
        setBreakpoint('tablet');
      } else if (width >= 1200) {
        setBreakpoint('large');
      } else {
        setBreakpoint('desktop');
      }
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);

    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    isLarge: breakpoint === 'large'
  };
};

/**
 * Hook để quản lý dark mode
 * Tích hợp với Tailwind dark mode
 */
export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check localStorage và system preference
    const stored = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = stored ? JSON.parse(stored) : prefersDark;
    setIsDark(shouldBeDark);
    
    // Apply to document
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    localStorage.setItem('darkMode', JSON.stringify(newValue));
    
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return { isDark, toggleDarkMode };
};

/**
 * Hook để tạo class names conditionally
 * Giúp combine SCSS classes với Tailwind utilities
 */
export const useClassNames = () => {
  const cn = (...classes) => {
    return classes
      .filter(Boolean)
      .join(' ')
      .trim();
  };

  const conditional = (condition, trueClass, falseClass = '') => {
    return condition ? trueClass : falseClass;
  };

  return { cn, conditional };
};

/**
 * Hook để animate elements khi scroll vào view
 * Sử dụng với Tailwind animation classes
 */
export const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const [elementRef, setElementRef] = useState(null);

  useEffect(() => {
    if (!elementRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Unobserve after animation triggers
          observer.unobserve(elementRef);
        }
      },
      { threshold }
    );

    observer.observe(elementRef);

    return () => {
      if (elementRef) observer.unobserve(elementRef);
    };
  }, [elementRef, threshold]);

  return [setElementRef, isVisible];
};

/**
 * Hook để quản lý notifications với Tailwind styles
 */
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const notification = { id, message, type };
    
    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const success = (message, duration) => addNotification(message, 'success', duration);
  const error = (message, duration) => addNotification(message, 'error', duration);
  const info = (message, duration) => addNotification(message, 'info', duration);

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info
  };
};