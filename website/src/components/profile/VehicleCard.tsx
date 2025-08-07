import React from 'react';
import { X } from 'lucide-react';
import { UserCar } from '../../services/interfaces/auth';

interface VehicleCardProps {
  car: UserCar;
  onRemove: (carId: string) => void;
  onSetDefault: (carId: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ car, onRemove, onSetDefault }) => {
  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
        car.isDefault
          ? 'border-orange-500 bg-orange-500/10'
          : 'border-orange-900/30 bg-black/30'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white font-medium">
            {car.year} {car.make} {car.model}
          </div>
          <div className="text-white/60 text-sm">
            {car.licensePlate} • {car.color}
          </div>
          {car.isDefault && (
            <div className="text-orange-400 text-xs font-medium mt-1">
              Default Vehicle
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!car.isDefault && (
            <button
              onClick={() => onSetDefault(car.id)}
              className="text-xs px-3 py-1 bg-orange-500/20 text-orange-400 rounded hover:bg-orange-500/30 transition-colors"
            >
              Set Default
            </button>
          )}
          <button
            onClick={() => onRemove(car.id)}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
