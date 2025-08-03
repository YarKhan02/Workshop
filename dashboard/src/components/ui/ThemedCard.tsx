// ==================== THEMED CARD COMPONENT ====================

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn, getComponentClasses } from '../../utils/themeUtils';

interface ThemedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const ThemedCard: React.FC<ThemedCardProps> = ({
  children,
  className,
  hoverable = false,
  padding = 'md',
  onClick,
}) => {
  const { theme } = useTheme();
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const cardClasses = cn(
    getComponentClasses(theme, 'card', 'base'),
    hoverable && getComponentClasses(theme, 'card', 'hover'),
    paddingClasses[padding],
    onClick && 'cursor-pointer',
    className
  );

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};
