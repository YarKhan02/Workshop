// ==================== THEMED BUTTON COMPONENT ====================

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn, getComponentClasses } from '../../utils/themeUtils';
import { Loader2 } from 'lucide-react';

interface ThemedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}) => {
  const { theme } = useTheme();
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };
  
  const buttonClasses = cn(
    getComponentClasses(theme, 'button', variant),
    sizeClasses[size],
    (disabled || loading) && getComponentClasses(theme, 'button', 'disabled'),
    className
  );

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={buttonClasses}
    >
      <div className="flex items-center justify-center gap-2">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : leftIcon ? (
          leftIcon
        ) : null}
        
        {children}
        
        {!loading && rightIcon && rightIcon}
      </div>
    </button>
  );
};
