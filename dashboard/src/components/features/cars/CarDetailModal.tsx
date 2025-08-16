import React from 'react';
import { Car, Calendar, Hash, Palette } from 'lucide-react';
import type { CarDetailModalProps } from '../../../types';
import { useTheme, cn, ThemedModal, ThemedButton, ThemedCard } from '../../ui';

const CarDetailModal: React.FC<CarDetailModalProps> = ({
  car,
  isOpen,
  onClose,
  // onEdit,
  // onDelete
}) => {
  const { theme } = useTheme();
  
  if (!isOpen || !car) return null;

  return (
    <ThemedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Vehicle Details"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={cn("text-xl font-semibold", theme.textPrimary)}>
              {car.year} {car.make} {car.model}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vehicle Information Card */}
          <ThemedCard className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("p-2 rounded-lg", theme.primaryLight)}>
                <Car className="w-5 h-5 text-orange-400" />
              </div>
              <h4 className={cn("text-lg font-semibold", theme.textPrimary)}>Vehicle Information</h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg mt-1", theme.backgroundSecondary)}>
                  <Car className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", theme.textSecondary)}>Make & Model</p>
                  <p className={cn("text-base font-semibold", theme.textPrimary)}>{car.make} {car.model}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg mt-1", theme.backgroundSecondary)}>
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", theme.textSecondary)}>Year</p>
                  <p className={cn("text-base", theme.textPrimary)}>{car.year}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg mt-1", theme.backgroundSecondary)}>
                  <Hash className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", theme.textSecondary)}>License Plate</p>
                  <p className={cn("font-mono text-lg px-3 py-1 rounded-md inline-block", theme.backgroundTertiary, theme.textPrimary)}>
                    {car.license_plate}
                  </p>
                </div>
              </div>
            </div>
          </ThemedCard>

          {/* Technical Details Card */}
          <ThemedCard className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("p-2 rounded-lg", theme.primaryLight)}>
                <Hash className="w-5 h-5 text-orange-400" />
              </div>
              <h4 className={cn("text-lg font-semibold", theme.textPrimary)}>Technical Details</h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg mt-1", theme.backgroundSecondary)}>
                  <Palette className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", theme.textSecondary)}>Color</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: car.color.toLowerCase() }}
                      title={`Color: ${car.color}`}
                    ></div>
                    <p className={cn("text-base", theme.textPrimary)}>{car.color}</p>
                  </div>
                </div>
              </div>

              {car.vin && (
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg mt-1", theme.backgroundSecondary)}>
                    <Hash className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className={cn("text-sm font-medium", theme.textSecondary)}>VIN Number</p>
                    <p className={cn("font-mono text-sm px-3 py-2 rounded-md break-all", theme.backgroundTertiary, theme.textPrimary)}>
                      {car.vin}
                    </p>
                  </div>
                </div>
              )}
              
              {!car.vin && (
                <div className="flex items-center justify-center py-4">
                  <p className={cn("text-center text-sm", theme.textTertiary)}>
                    No VIN information available
                  </p>
                </div>
              )}
            </div>
          </ThemedCard>
        </div>
        
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

export default CarDetailModal; 