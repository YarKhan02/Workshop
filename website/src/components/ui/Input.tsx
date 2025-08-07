import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  size = 'md',
  variant = 'default',
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  type = 'text',
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type;

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  const variants = {
    default: 'bg-black/50 border border-orange-900/30 focus:border-orange-500',
    filled: 'bg-orange-900/20 border border-transparent focus:border-orange-500',
    outlined: 'bg-transparent border-2 border-orange-500/50 focus:border-orange-500'
  };

  const baseClasses = `
    w-full rounded-lg text-white placeholder-white/50
    focus:outline-none focus:ring-2 focus:ring-orange-500/20
    transition-all duration-200
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
  `;

  return (
    <div className="w-full">
      {label && (
        <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
          error ? 'text-red-400' : isFocused ? 'text-orange-400' : 'text-white/80'
        }`}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
            {leftIcon}
          </div>
        )}
        
        <input
          type={inputType}
          className={`
            ${baseClasses}
            ${variants[variant]}
            ${sizes[size]}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon || showPasswordToggle ? 'pr-10' : ''}
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {(rightIcon || showPasswordToggle) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {showPasswordToggle ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-white/50 hover:text-white transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            ) : (
              <div className="text-white/50">{rightIcon}</div>
            )}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${
          error ? 'text-red-400' : 'text-white/60'
        }`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
