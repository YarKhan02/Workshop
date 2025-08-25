import React from 'react';
import { ThemedModal } from '../ui';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'md',
  onSubmit,
  children,
  footer,
  className = '',
}) => {
  return (
    <ThemedModal isOpen={isOpen} onClose={onClose} title={title} subtitle={subtitle} size={size}>
      <form onSubmit={onSubmit} className={className || 'p-6'}>
        {children}
        {footer}
      </form>
    </ThemedModal>
  );
};
