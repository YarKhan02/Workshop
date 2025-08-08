import React from 'react';
import { Mail, Lock } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { LoginFormData } from '../../services/interfaces/auth';

interface LoginFormProps {
  isLogin: boolean;
  formData: LoginFormData;
  loading: boolean;
  error: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  loading,
  error,
  onInputChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Email Field */}
      <Input
        type="email"
        name="email"
        value={formData.email}
        onChange={onInputChange}
        placeholder="Email Address"
        leftIcon={<Mail className="h-5 w-5" />}
        required
        variant="filled"
      />

      {/* Password Field */}
      <Input
        type="password"
        name="password"
        value={formData.password}
        onChange={onInputChange}
        placeholder="Password"
        leftIcon={<Lock className="h-5 w-5" />}
        showPasswordToggle
        required
        variant="filled"
      />

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4 text-orange-500 bg-black/50 border-orange-900/30 rounded focus:ring-orange-500 focus:ring-2"
          />
          <span className="ml-2 text-sm text-white/60">Remember me</span>
        </label>
        <a 
          href="#" 
          className="text-sm text-orange-400 hover:text-orange-300 transition-colors duration-300"
        >
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        disabled={loading}
      >
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
