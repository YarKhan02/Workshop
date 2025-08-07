import React from 'react';
import { Car } from 'lucide-react';
import { themeClasses } from '../../config/theme';
import type { Car as CarType } from '../../services/interfaces/booking';

interface VehicleInfoCardProps {
  car: CarType;
}

const VehicleInfoCard: React.FC<VehicleInfoCardProps> = ({ car }) => {
  return (
    <div className={`${themeClasses.card.primary} p-6`}>
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Car className={`w-6 h-6 mr-2 ${themeClasses.iconColors.orange}`} />
        Vehicle Information
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-white/70">Vehicle:</span>
          <span className="text-white">
            {car.make} {car.model} ({car.year})
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/70">License Plate:</span>
          <span className="text-white font-mono">{car.license_plate}</span>
        </div>
        {car.color && (
          <div className="flex justify-between">
            <span className="text-white/70">Color:</span>
            <span className="text-white">{car.color}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleInfoCard;
