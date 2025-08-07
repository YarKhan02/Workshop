import React from 'react';
import { themeClasses } from '../../config/theme';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  className = "" 
}) => {
  return (
    <div className={`${themeClasses.section.primary} min-h-screen flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-white">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
