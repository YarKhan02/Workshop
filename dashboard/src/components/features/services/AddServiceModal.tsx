import React, { useState } from 'react';
import { ThemedModal } from '../../ui';
import { ServiceForm } from '../../shared/forms';
import type { ServiceFormData } from '../../../types/service';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ServiceFormData) => Promise<void>;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ServiceFormData) => {
    try {
      setIsSubmitting(true);
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Service"
      size="lg"
    >
      <ServiceForm
        onSubmit={handleSubmit}
        submitLabel={isSubmitting ? 'Creating...' : 'Create Service'}
        showSubmitButton={true}
      />
    </ThemedModal>
  );
};

export default AddServiceModal;
