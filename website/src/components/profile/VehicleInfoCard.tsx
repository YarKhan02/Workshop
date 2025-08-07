import React from 'react';
import { Car } from 'lucide-react';
import { UserCar } from '../../services/interfaces/auth';
import VehicleCard from './VehicleCard';
import AddVehicleForm from './AddVehicleForm';
import { NewCarData } from '../../services/interfaces/auth';

interface VehicleInfoCardProps {
  cars: UserCar[];
  newCar: NewCarData;
  showAddCar: boolean;
  onAddCar: () => void;
  onRemoveCar: (carId: string) => void;
  onSetDefaultCar: (carId: string) => void;
  onToggleAddCar: () => void;
  onNewCarChange: (field: keyof NewCarData, value: string) => void;
}

const VehicleInfoCard: React.FC<VehicleInfoCardProps> = ({
  cars,
  newCar,
  showAddCar,
  onAddCar,
  onRemoveCar,
  onSetDefaultCar,
  onToggleAddCar,
  onNewCarChange,
}) => {
  return (
    <div className="bg-black/50 border border-orange-900/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Car className="w-6 h-6 mr-3 text-orange-400" />
          My Vehicles
        </h2>
        <button
          onClick={onToggleAddCar}
          className="flex items-center px-4 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-all duration-300"
        >
          Add Vehicle
        </button>
      </div>

      <div className="space-y-4">
        {cars.map((car) => (
          <VehicleCard
            key={car.id}
            car={car}
            onRemove={onRemoveCar}
            onSetDefault={onSetDefaultCar}
          />
        ))}

        {cars.length === 0 && (
          <div className="text-center py-8">
            <Car className="w-12 h-12 text-orange-400/50 mx-auto mb-4" />
            <p className="text-white/60">No vehicles added yet</p>
          </div>
        )}
      </div>

      {/* Add Vehicle Form */}
      {showAddCar && (
        <AddVehicleForm
          newCar={newCar}
          onAdd={onAddCar}
          onCancel={onToggleAddCar}
          onChange={onNewCarChange}
        />
      )}
    </div>
  );
};

export default VehicleInfoCard;
