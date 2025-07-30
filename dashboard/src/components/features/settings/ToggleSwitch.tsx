import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6'
  };

  const thumbSizeClasses = {
    sm: 'after:h-3 after:w-3 after:top-[2px] after:left-[2px] peer-checked:after:translate-x-4',
    md: 'after:h-5 after:w-5 after:top-[2px] after:left-[2px] peer-checked:after:translate-x-full'
  };

  return (
    <label className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only peer"
      />
      <div className={`
        ${sizeClasses[size]}
        bg-slate-600 
        peer-focus:outline-none 
        peer-focus:ring-4 
        peer-focus:ring-orange-500/30 
        rounded-full 
        peer 
        peer-checked:after:border-white 
        after:content-[''] 
        after:absolute 
        after:bg-white 
        after:border-slate-300 
        after:border 
        after:rounded-full 
        after:transition-all 
        peer-checked:bg-orange-600
        ${thumbSizeClasses[size]}
      `} />
    </label>
  );
};

export default ToggleSwitch;
