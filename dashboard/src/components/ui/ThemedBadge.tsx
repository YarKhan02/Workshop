// ==================== THEMED BADGE COMPONENT ====================

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn, getComponentClasses, getStatusClasses, getPriorityClasses } from '../../utils/themeUtils';

interface ThemedBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  status?: string; // for automatic status coloring
  priority?: string; // for automatic priority coloring
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ThemedBadge: React.FC<ThemedBadgeProps> = ({
  children,
  variant = 'default',
  status,
  priority,
  size = 'md',
  className,
}) => {
  const { theme } = useTheme();
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };
  
  // Determine classes based on props
  let badgeClasses: string;
  
  if (status) {
    badgeClasses = getStatusClasses(theme, status);
  } else if (priority) {
    badgeClasses = getPriorityClasses(theme, priority);
  } else {
    badgeClasses = getComponentClasses(theme, 'badge', variant);
  }
  
  return (
    <span className={cn(
      badgeClasses,
      sizeClasses[size],
      'rounded-full font-medium inline-flex items-center justify-center',
      className
    )}>
      {children}
    </span>
  );
};
