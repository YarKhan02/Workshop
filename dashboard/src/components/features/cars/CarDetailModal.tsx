import React from 'react';
import { Edit, Trash2, Car, Calendar } from 'lucide-react';
import type { CarDetailModalProps } from '../../../types';
import { useTheme, cn, ThemedModal, ThemedButton } from '../../ui';

const CarDetailModal: React.FC<CarDetailModalProps> = ({
  car,
  isOpen,
  onClose,
  onEdit,
  onDelete
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
          <div className="flex gap-2">
            <ThemedButton
              variant="primary"
              onClick={() => onEdit(car)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </ThemedButton>
            <ThemedButton
              variant="primary"
              onClick={() => onDelete(car.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </ThemedButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className={cn("text-lg font-semibold", theme.textPrimary)}>Vehicle Information</h4>
            
            <div className="flex items-center gap-3">
              <Car className={theme.textSecondary} size={20} />
              <div>
                <p className={cn("text-sm", theme.textSecondary)}>Make & Model</p>
                <p className={theme.textPrimary}>{car.make} {car.model}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className={theme.textSecondary} size={20} />
              <div>
                <p className={cn("text-sm", theme.textSecondary)}>Year</p>
                <p className={theme.textPrimary}>{car.year}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", theme.border)}>
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: car.color.toLowerCase() }}
                ></div>
              </div>
              <div>
                <p className={cn("text-sm", theme.textSecondary)}>Color</p>
                <p className={theme.textPrimary}>{car.color}</p>
              </div>
            </div>

            <div>
              <p className={cn("text-sm", theme.textSecondary)}>License Plate</p>
              <p className={cn("font-mono text-lg", theme.textPrimary)}>{car.license_plate}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className={cn("text-lg font-semibold", theme.textPrimary)}>Technical Details</h4>
            
            {car.vin && (
              <div>
                <p className={cn("text-sm", theme.textSecondary)}>VIN</p>
                <p className={cn("font-mono text-sm", theme.textPrimary)}>{car.vin}</p>
              </div>
            )}
          </div>
        </div>
      </div>

          <div className={cn("flex justify-end gap-3 p-6 border-t", theme.border)}>
            <ThemedButton
              variant="secondary"
              onClick={onClose}
            >
              Close
            </ThemedButton>
          </div>
        </ThemedModal>
  );
};

export default CarDetailModal; 