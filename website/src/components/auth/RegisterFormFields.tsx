import React from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, CreditCard } from 'lucide-react';
import { RegisterFormData } from '../../services/interfaces/auth';
import { formatNIC } from '../../utils/nicValidation';

interface RegisterFormFieldsProps {
  formData: RegisterFormData;
  showPassword: boolean;
  showConfirmPassword: boolean;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: (field: 'password' | 'confirmPassword') => void;
}

const RegisterFormFields: React.FC<RegisterFormFieldsProps> = ({
  formData,
  showPassword,
  showConfirmPassword,
  isLoading,
  onChange,
  onTogglePassword,
}) => {
  // Custom NIC handler using the utility function
  const handleNICChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, max 13
    const raw = e.target.value.replace(/\D/g, '').slice(0, 13);
    const formatted = formatNIC(raw);
    // Create a synthetic event to pass to parent
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: formatted,
        name: 'nic',
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  // Custom phone handler: only allow numbers, must start with 03, max 11 digits
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (!raw.startsWith('03')) {
      raw = '03';
    }
    if (raw.length > 11) {
      raw = raw.slice(0, 11);
    }
    // Create a synthetic event to pass to parent
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: raw,
        name: 'phone',
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  return (
    <div className="space-y-6">
      {/* NIC */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <CreditCard className="w-5 h-5 text-orange-400" />
        </div>
        <input
          type="text"
          name="nic"
          value={formData.nic}
          onChange={handleNICChange}
          maxLength={15} // 13 digits + 2 dashes
          placeholder="National Identity Card (NIC)"
          required
          disabled={isLoading}
          className="w-full pl-12 pr-4 py-4 bg-black/50 border border-orange-900/30 rounded-xl text-white placeholder-white/50 focus:border-orange-500 focus:outline-none transition-colors disabled:opacity-50"
        />
      </div>

      {/* Name Fields */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <User className="w-5 h-5 text-orange-400" />
        </div>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={onChange}
          placeholder="Full Name"
          required
          disabled={isLoading}
          className="w-full pl-12 pr-4 py-4 bg-black/50 border border-orange-900/30 rounded-xl text-white placeholder-white/50 focus:border-orange-500 focus:outline-none transition-colors disabled:opacity-50"
        />
      </div>

      {/* Email */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Mail className="w-5 h-5 text-orange-400" />
        </div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Email Address"
          required
          disabled={isLoading}
          className="w-full pl-12 pr-4 py-4 bg-black/50 border border-orange-900/30 rounded-xl text-white placeholder-white/50 focus:border-orange-500 focus:outline-none transition-colors disabled:opacity-50"
        />
      </div>

      {/* Phone */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Phone className="w-5 h-5 text-orange-400" />
        </div>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handlePhoneChange}
          placeholder="Phone Number (e.g. 03XXXXXXXXX)"
          required
          pattern="03[0-9]{9}"
          minLength={11}
          maxLength={11}
          disabled={isLoading}
          className="w-full pl-12 pr-4 py-4 bg-black/50 border border-orange-900/30 rounded-xl text-white placeholder-white/50 focus:border-orange-500 focus:outline-none transition-colors disabled:opacity-50"
        />
      </div>

      {/* Password */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Lock className="w-5 h-5 text-orange-400" />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={onChange}
          placeholder="Password"
          required
          minLength={6}
          disabled={isLoading}
          className="w-full pl-12 pr-12 py-4 bg-black/50 border border-orange-900/30 rounded-xl text-white placeholder-white/50 focus:border-orange-500 focus:outline-none transition-colors disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => onTogglePassword('password')}
          disabled={isLoading}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-orange-400 hover:text-orange-300 disabled:opacity-50"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Lock className="w-5 h-5 text-orange-400" />
        </div>
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={onChange}
          placeholder="Confirm Password"
          required
          minLength={6}
          disabled={isLoading}
          className="w-full pl-12 pr-12 py-4 bg-black/50 border border-orange-900/30 rounded-xl text-white placeholder-white/50 focus:border-orange-500 focus:outline-none transition-colors disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => onTogglePassword('confirmPassword')}
          disabled={isLoading}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-orange-400 hover:text-orange-300 disabled:opacity-50"
        >
          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default RegisterFormFields;
