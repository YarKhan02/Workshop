import React, { useEffect, useState } from 'react';

interface RouteTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const RouteTransition: React.FC<RouteTransitionProps> = ({ 
  children, 
  className = '' 
}) => {
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    setIsEntering(true);
    return () => setIsEntering(false);
  }, []);

  return (
    <div 
      className={`
        transition-all duration-500 ease-out
        ${isEntering 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default RouteTransition;
