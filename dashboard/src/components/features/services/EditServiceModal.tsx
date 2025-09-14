import React, { useState } from 'react';
import { ThemedModal } from '../../ui';
import { ServiceForm } from '../../shared/forms';
import type { Service, ServiceFormData } from '../../../types/service';

interface EditServiceModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (serviceId: string, data: Partial<ServiceFormData>) => Promise<void>;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({
  service,
  isOpen,
  onClose,
  onSave,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ServiceFormData) => {
    if (!service) return;
    
    try {
      setIsSubmitting(true);
      await onSave(service.id, data);
      onClose();
    } catch (error) {
      console.error('Error updating service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const initialData: Partial<ServiceFormData> = service ? {
    name: service.name,
    description: service.description,
    category: service.category,
    price: service.price,
    is_active: service.is_active,
    items: service.items?.map(item => ({ name: item.name })) || [],
  } : {};

  return (
    <ThemedModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Service: ${service?.name || ''}`}
      size="lg"
    >
      {service && (
        <ServiceForm
          initialData={initialData}
          onSubmit={handleSubmit}
          submitLabel={isSubmitting ? 'Updating...' : 'Update Service'}
          showSubmitButton={true}
        />
      )}
    </ThemedModal>
  );
};

export default EditServiceModal;