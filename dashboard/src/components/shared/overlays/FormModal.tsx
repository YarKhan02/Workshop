import React from 'react';
import { X } from 'lucide-react';
import { useTheme, cn, getComponentClasses } from '../../ui';
import Portal from '../utility/Portal';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode; // Custom footer actions
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = 'md',
}) => {
  const { theme } = useTheme();

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
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
          <div className={getComponentClasses(theme, 'modal', 'header')}>
            <div>
              <h2 className={cn('text-2xl font-bold', theme.textPrimary)}>
                {title}
              </h2>
            </div>
            
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
          </div>
          
          {/* Content */}
          <div className={getComponentClasses(theme, 'modal', 'content')}>
            {children}
          </div>
          
          {/* Footer */}
          {actions && (
            <div className={getComponentClasses(theme, 'modal', 'footer')}>
              {actions}
            </div>
          )}
          
        </div>
      </div>
    </Portal>
  );
};

export default FormModal;
