import React from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const STYLES = {
  input: {
    borderRadius: '4px',
    color: '#E0E0E0'
  },
  label: { fontWeight: 300, color: '#A0A0A0' }
};

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder: string;
  Icon: React.ComponentType<{ className?: string }>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasToggle?: boolean;
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  value,
  placeholder,
  Icon,
  onChange,
  hasToggle,
  showPassword,
  togglePasswordVisibility
}) => (
  <div>
    <label htmlFor={id} className="block text-sm text-slate-400 mb-3 transition-all duration-200" style={STYLES.label}>
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-slate-500 group-focus-within:text-orange-400/80 transition-colors duration-200" />
      </div>
      <input
        id={id}
        name={id}
        type={type}
        required
        value={value}
        onChange={onChange}
        className={`block w-full pl-12 ${hasToggle ? 'pr-12' : 'pr-4'} py-4 border border-slate-600/50 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400/80 focus:border-orange-400/80 bg-slate-800/50 text-slate-100 placeholder-slate-500 transition-all duration-200 hover:border-orange-400/60`}
        style={STYLES.input}
        placeholder={placeholder}
      />
      {hasToggle && togglePasswordVisibility && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-slate-700/30 rounded-r-md transition-all duration-200"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5 text-slate-500 hover:text-orange-400/80 transition-colors duration-200" />
          ) : (
            <EyeIcon className="h-5 w-5 text-slate-500 hover:text-orange-400/80 transition-colors duration-200" />
          )}
        </button>
      )}
    </div>
  </div>
);

export default InputField;
