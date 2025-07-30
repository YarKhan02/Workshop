import React from 'react';

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
  return (
    <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
      <button
        type="button"
        onClick={onCancel}
        className="bg-gray-600 text-gray-200 hover:bg-gray-500 focus:ring-gray-400 px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
        disabled={isLoading}
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        onClick={onSubmit}
        className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : submitLabel}
      </button>
    </div>
  );
};

export default FormActions;
