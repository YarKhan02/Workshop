import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
  duration?: number;
  type?: 'fade' | 'slide' | 'scale' | 'blur';
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  duration = 300,
  type = 'fade'
}) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== currentPath) {
      setIsVisible(false);
      
      const timer = setTimeout(() => {
        setCurrentPath(location.pathname);
        setIsVisible(true);
      }, duration / 2);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [location.pathname, currentPath, duration]);

  const getTransitionStyles = () => {
    const baseStyles = {
      transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      willChange: 'opacity, transform, filter'
    };

    switch (type) {
      case 'fade':
        return {
          ...baseStyles,
          opacity: isVisible ? 1 : 0
        };
      
      case 'slide':
        return {
          ...baseStyles,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(20px)'
        };
      
      case 'scale':
        return {
          ...baseStyles,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.95)'
        };
      
      case 'blur':
        return {
          ...baseStyles,
          opacity: isVisible ? 1 : 0,
          filter: isVisible ? 'blur(0px)' : 'blur(4px)'
        };
      
      default:
        return baseStyles;
    }
  };

  return (
    <div style={getTransitionStyles()}>
      {children}
    </div>
  );
};

export default PageTransition;
