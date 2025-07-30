// ==================== THEME UTILITY FUNCTIONS ====================

import { useTheme } from '../contexts/ThemeContext';
import type { Theme } from '../styles/themes';

// Hook to get theme classes
export const useThemeClasses = () => {
  const { theme } = useTheme();
  return theme;
};

// Utility function to combine theme classes
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Helper function to get component classes with variants
export const getComponentClasses = (
  theme: Theme,
  component: keyof Theme['components'],
  variant: string = 'base',
  additional?: string
): string => {
  const componentClasses = theme.components[component];
  const baseClasses = typeof componentClasses === 'object' 
    ? (componentClasses as any)[variant] || ''
    : componentClasses;
  
  return cn(baseClasses, additional);
};

// Status color helper
export const getStatusClasses = (theme: Theme, status: string): string => {
  switch (status) {
    case 'completed':
    case 'success':
      return theme.success;
    case 'pending':
    case 'warning':
      return theme.warning;
    case 'error':
    case 'cancelled':
      return theme.error;
    case 'in_progress':
    case 'info':
      return theme.info;
    default:
      return theme.components.badge.default;
  }
};

// Priority color helper
export const getPriorityClasses = (theme: Theme, priority: string): string => {
  switch (priority) {
    case 'urgent':
      return theme.error;
    case 'high':
      return theme.warning;
    case 'medium':
      return theme.info;
    case 'low':
      return theme.success;
    default:
      return theme.components.badge.default;
  }
};
