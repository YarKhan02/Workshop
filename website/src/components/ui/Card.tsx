import React from 'react';
import { LucideIcon } from 'lucide-react';
import { themeClasses } from '../../config/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'glass' | 'outlined';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
} = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = ''
}) => {
  const variants = {
    default: themeClasses.card.primary,
    gradient: 'bg-gradient-to-br from-orange-900/20 via-black/90 to-orange-800/20 border border-orange-500/30 backdrop-blur-sm',
    glass: 'bg-black/20 backdrop-blur-md border border-white/10 shadow-2xl',
    outlined: 'bg-transparent border-2 border-orange-500/50 hover:border-orange-500'
  };

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  const hoverEffect = hover ? 'hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300' : '';

  return (
    <div className={`
      ${variants[variant]}
      ${paddings[padding]}
      ${hoverEffect}
      rounded-2xl shadow-lg
      ${className}
    `}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ children, icon: Icon, className = '' }) => (
  <div className={`flex items-center mb-4 ${className}`}>
    {Icon && (
      <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mr-4">
        <Icon className="w-6 h-6 text-orange-400" />
      </div>
    )}
    <div className="flex-1">{children}</div>
  </div>
);

const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`mt-auto ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
