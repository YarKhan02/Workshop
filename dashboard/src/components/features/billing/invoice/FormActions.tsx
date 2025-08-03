import React from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { cn } from '../../../../lib/utils';

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onSubmit,
  isLoading,
  submitLabel = "Create Invoice",
  cancelLabel = "Cancel",
}) => {
  const { theme } = useTheme();

  return (
    <div className={cn("flex justify-end gap-4 pt-6 border-t", theme.border)}>
      <button
        type="button"
        onClick={onCancel}
        className={cn(
          "px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
          theme.components.button.secondary
        )}
        disabled={isLoading}
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        onClick={onSubmit}
        className="bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500 px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : submitLabel}
      </button>
    </div>
  );
};

export default FormActions;
