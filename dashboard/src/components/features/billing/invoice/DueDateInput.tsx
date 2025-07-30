import React from 'react';

interface DueDateInputProps {
  value: string;
  onChange: (date: string) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

const DueDateInput: React.FC<DueDateInputProps> = ({
  value,
  onChange,
  disabled = false,
  error,
  required = false,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Due Date {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white ${
          error ? "border-red-500" : "border-gray-600"
        }`}
        disabled={disabled}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default DueDateInput;
