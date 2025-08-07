import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { themeClasses } from '../../config/theme';

interface ErrorStateProps {
  message: string;
  actionText?: string;
  actionLink?: string;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  message, 
  actionText = "Book New Service",
  actionLink = "/book",
  className = "" 
}) => {
  return (
    <div className={`${themeClasses.section.primary} min-h-screen flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="text-red-400 text-xl mb-4">{message}</div>
        <Link 
          to={actionLink} 
          className={`${themeClasses.button.primary} px-6 py-3 rounded-lg inline-flex items-center space-x-2`}
        >
          <span>{actionText}</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default ErrorState;
