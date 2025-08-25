import React from 'react';
import { ThemedButton } from '../ui';

interface FormFooterProps {
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  submitIcon?: React.ReactNode;
  cancelIcon?: React.ReactNode;
}

export const FormFooter: React.FC<FormFooterProps> = ({
  onCancel,
  isSubmitting = false,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  submitIcon,
  cancelIcon,
}) => (
  <div className="flex justify-end gap-3 mt-8 pt-6">
    <ThemedButton type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
      {cancelIcon}
      {cancelLabel}
    </ThemedButton>
    <ThemedButton type="submit" variant="primary" disabled={isSubmitting}>
      {submitIcon}
      {isSubmitting ? 'Processing...' : submitLabel}
    </ThemedButton>
  </div>
);
