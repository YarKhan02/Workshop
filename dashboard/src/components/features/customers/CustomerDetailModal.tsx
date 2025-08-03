import React from 'react';
import { Edit, Phone, Mail, MapPin, Car, Calendar, User } from 'lucide-react';
import type { CustomerDetailModalProps, CustomerCar } from '../../../types';
import { useTheme, cn, ThemedModal, ThemedButton, ThemedCard } from '../../ui';

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
          {/* Contact Information Card */}
          <ThemedCard className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("p-2 rounded-lg", theme.primaryLight)}>
                <Phone className="w-5 h-5 text-orange-400" />
              </div>
              <h4 className={cn("text-lg font-semibold", theme.textPrimary)}>Contact Information</h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg mt-1", theme.backgroundSecondary)}>
                  <Phone className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", theme.textSecondary)}>Phone</p>
                  <p className={cn("text-base", theme.textPrimary)}>{customer.phone_number}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg mt-1", theme.backgroundSecondary)}>
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", theme.textSecondary)}>Email</p>
                  <p className={cn("text-base", theme.textPrimary)}>{customer.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg mt-1", theme.backgroundSecondary)}>
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", theme.textSecondary)}>Address</p>
                  <p className={cn("text-base", theme.textPrimary)}>{customer.address}</p>
                </div>
              </div>
            </div>
          </ThemedCard>

          {/* Additional Information Card */}
          <ThemedCard className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("p-2 rounded-lg", theme.primaryLight)}>
                <User className="w-5 h-5 text-orange-400" />
              </div>
              <h4 className={cn("text-lg font-semibold", theme.textPrimary)}>Additional Information</h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg mt-1", theme.backgroundSecondary)}>
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", theme.textSecondary)}>City</p>
                  <p className={cn("text-base", theme.textPrimary)}>
                    {customer.city || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg mt-1", theme.backgroundSecondary)}>
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", theme.textSecondary)}>State</p>
                  <p className={cn("text-base", theme.textPrimary)}>{customer.state || 'Not provided'}</p>
                </div>
              </div>

              {customer.date_joined && (
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg mt-1", theme.backgroundSecondary)}>
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className={cn("text-sm font-medium", theme.textSecondary)}>Member Since</p>
                    <p className={cn("text-base", theme.textPrimary)}>
                      {new Date(customer.date_joined).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ThemedCard>
        </div>

        {customer.cars && customer.cars.length > 0 && (
          <div className="mt-8">
            <ThemedCard>
              <div className="flex items-center gap-3 mb-6">
                <div className={cn("p-2 rounded-lg", theme.primaryLight)}>
                  <Car className="w-5 h-5 text-orange-400" />
                </div>
                <h4 className={cn("text-lg font-semibold", theme.textPrimary)}>Registered Vehicles</h4>
                <div className={cn("ml-auto px-3 py-1 rounded-full text-sm font-medium", theme.backgroundSecondary, theme.textSecondary)}>
                  {customer.cars.length} {customer.cars.length === 1 ? 'Vehicle' : 'Vehicles'}
                </div>
              </div>
              
              <div className="grid gap-4">
                {customer.cars?.map((car: CustomerCar, index: number) => (
                  <div key={car.id} className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02]",
                    theme.backgroundSecondary, 
                    theme.border,
                    "hover:border-orange-500/30"
                  )}>
                    <div className={cn("p-3 rounded-lg", theme.primaryLight)}>
                      <Car className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={cn("font-semibold text-lg", theme.textPrimary)}>
                          {car.year} {car.make} {car.model}
                        </p>
                        <div className={cn("w-4 h-4 rounded-full border-2 border-white shadow-sm")} 
                             style={{ backgroundColor: car.color?.toLowerCase() || '#gray' }}
                             title={`Color: ${car.color}`}>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={cn("px-2 py-1 rounded-md font-mono", theme.backgroundTertiary, theme.textSecondary)}>
                          {car.license_plate}
                        </span>
                        <span className={cn("text-sm", theme.textTertiary)}>
                          {car.color}
                        </span>
                      </div>
                    </div>
                    <div className={cn("text-right text-sm", theme.textTertiary)}>
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </ThemedCard>
          </div>
        )}

        <div className={cn("flex justify-end gap-3 mt-8 pt-6 border-t", theme.border)}>
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