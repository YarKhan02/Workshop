import React from 'react';
import { X } from 'lucide-react';
import Portal from '../../../shared/utility/Portal';

interface InvoiceModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const InvoiceModalWrapper: React.FC<InvoiceModalWrapperProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-4xl"
}) => {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`bg-white rounded-lg shadow-xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}>
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </Portal>
  );
};

export default InvoiceModalWrapper;
