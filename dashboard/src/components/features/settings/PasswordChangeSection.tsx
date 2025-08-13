import React, { useState } from 'react';
import { Lock, Save, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../lib/utils';
import type { ChangePasswordData } from '../../../types/settings';

interface PasswordChangeProps {
  onPasswordChange: (data: ChangePasswordData) => Promise<void>;
  isLoading: boolean;
}

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggleShow: () => void;
  placeholder: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ 
  label, 
  value, 
  onChange, 
  show, 
  onToggleShow, 
  placeholder 
}) => {
  const { theme } = useTheme();
  
  return (
    <div>
      <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn("w-full px-3 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50", theme.components.input.base)}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={onToggleShow}
          className={cn("absolute inset-y-0 right-0 pr-3 flex items-center hover:text-slate-200", theme.textSecondary)}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

const PasswordChangeSection: React.FC<PasswordChangeProps> = ({
  onPasswordChange,
  isLoading,
}) => {
  const { theme } = useTheme();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const updatePasswordData = (field: keyof ChangePasswordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await onPasswordChange(passwordData);
      // Reset form on success
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      // Error is already handled by the mutation's onError callback
      console.error('Password change failed:', error);
    }
  };

  const isFormValid = () => {
    return passwordData.currentPassword && 
           passwordData.newPassword && 
           passwordData.confirmPassword &&
           passwordData.newPassword.length >= 8;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Lock className="h-5 w-5 text-orange-400" />
        <h2 className={cn("text-xl font-semibold", theme.textPrimary)}>Change Password</h2>
      </div>

      <div className="max-w-md space-y-6">
        <PasswordInput
          label="Current Password"
          value={passwordData.currentPassword}
          onChange={(value) => updatePasswordData('currentPassword', value)}
          show={showCurrentPassword}
          onToggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
          placeholder="Enter current password"
        />

        <div>
          <PasswordInput
            label="New Password"
            value={passwordData.newPassword}
            onChange={(value) => updatePasswordData('newPassword', value)}
            show={showNewPassword}
            onToggleShow={() => setShowNewPassword(!showNewPassword)}
            placeholder="Enter new password"
          />
          <p className={cn("text-sm mt-1", theme.textSecondary)}>
            Password must be at least 8 characters long
          </p>
        </div>

        <PasswordInput
          label="Confirm New Password"
          value={passwordData.confirmPassword}
          onChange={(value) => updatePasswordData('confirmPassword', value)}
          show={showConfirmPassword}
          onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
          placeholder="Confirm new password"
        />

        {passwordData.newPassword && passwordData.confirmPassword && 
         passwordData.newPassword !== passwordData.confirmPassword && (
          <p className="text-sm text-red-400">Passwords do not match</p>
        )}

        <div className={cn("flex justify-end border-t pt-6", theme.border)}>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid() || passwordData.newPassword !== passwordData.confirmPassword}
            className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeSection;
