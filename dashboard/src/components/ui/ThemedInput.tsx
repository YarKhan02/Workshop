// ==================== THEMED INPUT COMPONENT ====================

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn, getComponentClasses } from '../../utils/themeUtils';

interface ThemedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'error';
}

export const ThemedInput: React.FC<ThemedInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  className,
  ...props
}) => {
  const { theme } = useTheme();
  
  const inputClasses = cn(
    getComponentClasses(theme, 'input', 'base'),
    variant === 'error' || error ? getComponentClasses(theme, 'input', 'error') : getComponentClasses(theme, 'input', 'focus'),
    props.disabled && getComponentClasses(theme, 'input', 'disabled'),
    leftIcon ? 'pl-10' : undefined,
    rightIcon ? 'pr-10' : undefined,
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className={cn('block text-sm font-medium', theme.textSecondary)}>
          {label}
          {props.required && <span className={theme.error}>*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className={cn('absolute left-3 top-1/2 transform -translate-y-1/2', theme.textTertiary)}>
            {leftIcon}
          </div>
        )}
        
        <input
          {...props}
          className={inputClasses}
        />
        
        {rightIcon && (
          <div className={cn('absolute right-3 top-1/2 transform -translate-y-1/2', theme.textTertiary)}>
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className={cn('text-sm', theme.error)}>{error}</p>
      )}
      
      {helperText && !error && (
        <p className={cn('text-sm', theme.textMuted)}>{helperText}</p>
      )}
    </div>
  );
};
