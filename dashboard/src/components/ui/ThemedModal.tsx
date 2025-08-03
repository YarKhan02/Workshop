// ==================== THEMED MODAL COMPONENT ====================

import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn, getComponentClasses } from '../../utils/themeUtils';
import Portal from '../shared/utility/Portal';

interface ThemedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export const ThemedModal: React.FC<ThemedModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
}) => {
  const { theme } = useTheme();
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };
  
  if (!isOpen) return null;

  return (
    <Portal>
      <div className={getComponentClasses(theme, 'modal', 'overlay')}>
        <div className={cn(
          getComponentClasses(theme, 'modal', 'container'),
          sizeClasses[size]
        )}>
          
          {/* Header */}
          {(title || showCloseButton) && (
            <div className={getComponentClasses(theme, 'modal', 'header')}>
              <div>
                {title && (
                  <h2 className={cn('text-2xl font-bold', theme.textPrimary)}>
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className={cn('text-sm mt-1', theme.textTertiary)}>{subtitle}</p>
                )}
              </div>
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={cn(
                    'p-2 rounded-xl transition-colors',
                    theme.secondaryHover,
                    theme.textTertiary,
                    'hover:' + theme.textSecondary
                  )}
                >
                  <X size={24} />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className={getComponentClasses(theme, 'modal', 'content')}>
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className={getComponentClasses(theme, 'modal', 'footer')}>
              {footer}
            </div>
          )}
          
        </div>
      </div>
    </Portal>
  );
};
