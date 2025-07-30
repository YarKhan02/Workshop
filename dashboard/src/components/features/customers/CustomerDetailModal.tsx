import React from 'react';
import { Edit, Phone, Mail, MapPin, Car } from 'lucide-react';
import type { CustomerDetailModalProps, CustomerCar } from '../../../types';
import { useTheme, cn, ThemedModal, ThemedButton } from '../../ui';

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  isOpen,
  onClose,
  onEdit
}) => {
  const { theme } = useTheme();
  
  if (!isOpen || !customer) return null;

  return (
    <ThemedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Customer Profile"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={cn("text-xl font-semibold", theme.textPrimary)}>
              {customer.first_name} {customer.last_name}
            </h3>
          </div>
          <div className="flex gap-2">
            <ThemedButton
              variant="primary"
              onClick={() => onEdit(customer)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Modify
            </ThemedButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className={cn("text-lg font-semibold", theme.textPrimary)}>Contact Information</h4>
            
            <div className="flex items-center gap-3">
              <Phone className={theme.primary} size={20} />
              <div>
                <p className={cn("text-sm", theme.textSecondary)}>Phone</p>
                <p className={theme.textPrimary}>{customer.phone_number}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className={theme.primary} size={20} />
              <div>
                <p className={cn("text-sm", theme.textSecondary)}>Email</p>
                <p className={theme.textPrimary}>{customer.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className={theme.primary} size={20} />
              <div>
                <p className={cn("text-sm", theme.textSecondary)}>Address</p>
                <p className={theme.textPrimary}>{customer.address}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className={cn("text-lg font-semibold", theme.textPrimary)}>Additional Information</h4>
            
            <div>
              <p className={cn("text-sm", theme.textSecondary)}>City</p>
              <p className={theme.textPrimary}>
                {customer.city || 'Not provided'}
              </p>
            </div>

            <div>
              <p className={cn("text-sm", theme.textSecondary)}>State</p>
              <p className={theme.textPrimary}>{customer.state || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {customer.cars && customer.cars.length > 0 && (
          <div className="mt-8">
            <h4 className={cn("text-lg font-semibold mb-4", theme.textPrimary)}>Registered Vehicles</h4>
            <div className="space-y-3">
              {customer.cars?.map((car: CustomerCar) => (
                <div key={car.id} className={cn("flex items-center gap-3 p-3 rounded-lg border", theme.surface, theme.border)}>
                  <Car className={theme.primary} size={20} />
                  <div>
                    <p className={cn("font-medium", theme.textPrimary)}>
                      {car.year} {car.make} {car.model}
                    </p>
                    <p className={cn("text-sm", theme.textSecondary)}>
                      {car.color} • {car.license_plate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={cn("mt-8 pt-6 border-t", theme.border)}>
          <div className={cn("flex items-center justify-between text-sm", theme.textSecondary)}>
            {customer.date_joined && (
              <span>Joined: {new Date(customer.date_joined).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        <div className={cn("flex justify-end gap-3 mt-6 pt-6 border-t", theme.border)}>
          <ThemedButton
            variant="secondary"
            onClick={onClose}
          >
            Close
          </ThemedButton>
        </div>
      </div>
    </ThemedModal>
  );
};

export default CustomerDetailModal; 