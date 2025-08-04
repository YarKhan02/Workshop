// ==================== CONFIRMATION MODAL COMPONENT ====================

import React from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import { ThemedModal } from '../ThemedModal';
import { ThemedButton } from '../ThemedButton';
import { useTheme, cn } from '../index';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'warning' | 'success' | 'danger';
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false
}) => {
  const { theme } = useTheme();

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'danger':
        return <X className="w-8 h-8 text-red-500" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getConfirmVariant = () => {
    switch (type) {
      case 'success':
        return 'primary';
      case 'danger':
        return 'danger';
      default:
        return 'primary';
    }
  };

  return (
    <ThemedModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="space-y-6">
        {/* Icon and Message */}
        <div className="flex flex-col items-center text-center space-y-4">
          {getIcon()}
          <p className={cn("text-base", theme.textSecondary)}>
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <ThemedButton
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </ThemedButton>
          <ThemedButton
            variant={getConfirmVariant()}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </ThemedButton>
        </div>
      </div>
    </ThemedModal>
  );
};

export default ConfirmationModal;
