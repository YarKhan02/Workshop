import React from 'react';
import { motion } from 'framer-motion';

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  icon,
  children,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  className = ""
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600';
      case 'success':
        return 'bg-green-500/20 text-green-400 hover:bg-green-500/30';
      case 'danger':
        return 'bg-red-500/20 text-red-400 hover:bg-red-500/30';
      case 'warning':
        return 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30';
      default:
        return 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-2 rounded-lg transition-all shadow-lg
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {icon}
      {children}
    </motion.button>
  );
};

export default ActionButton;
