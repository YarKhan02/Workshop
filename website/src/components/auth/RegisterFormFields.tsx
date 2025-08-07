import React from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { RegisterFormData } from '../../services/interfaces/auth';

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
  return (
    <div className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <User className="w-5 h-5 text-orange-400" />
          </div>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            placeholder="First Name"
            required
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-4 bg-black/50 border border-orange-900/30 rounded-xl text-white placeholder-white/50 focus:border-orange-500 focus:outline-none transition-colors disabled:opacity-50"
          />
        </div>
        <div className="relative">
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            placeholder="Last Name"
            required
            disabled={isLoading}
            className="w-full px-4 py-4 bg-black/50 border border-orange-900/30 rounded-xl text-white placeholder-white/50 focus:border-orange-500 focus:outline-none transition-colors disabled:opacity-50"
          />
        </div>
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
          onChange={onChange}
          placeholder="Phone Number"
          required
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
