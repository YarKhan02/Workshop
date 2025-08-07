import React from 'react';
import { Link } from 'react-router-dom';
import { themeClasses } from '../../../config/theme';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link to="/" className={`${themeClasses.spacing.logoContainer} ${className}`}>
      <img 
        src="/detailing-hub-logo.png" 
        alt="Detailing Hub" 
        className="h-12 w-auto"
      />
      <div className={themeClasses.spacing.logoTextContainer}>
        <span className={themeClasses.text.logoMain}>
          Detailing Hub
        </span>
        <span className={themeClasses.text.logoSub}>
          POWERED BY BIKE DOCTORS
        </span>
      </div>
    </Link>
  );
};

export default Logo;
