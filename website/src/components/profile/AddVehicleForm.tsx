import React from 'react';
import { NewCarData } from '../../services/interfaces/auth';

interface AddVehicleFormProps {
  newCar: NewCarData;
  onAdd: () => void;
  onCancel: () => void;
  onChange: (field: keyof NewCarData, value: string) => void;
}

const AddVehicleForm: React.FC<AddVehicleFormProps> = ({
  newCar,
  onAdd,
  onCancel,
  onChange,
}) => {
  return (
    <div className="mt-6 p-4 border border-orange-500/30 rounded-lg bg-orange-500/5">
      <h3 className="text-white font-semibold mb-4">Add New Vehicle</h3>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Make (e.g., Toyota)"
            value={newCar.make}
            onChange={(e) => onChange('make', e.target.value)}
            className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-white/40"
          />
          <input
            type="text"
            placeholder="Model (e.g., Camry)"
            value={newCar.model}
            onChange={(e) => onChange('model', e.target.value)}
            className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-white/40"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Year"
            value={newCar.year}
            onChange={(e) => onChange('year', e.target.value)}
            className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-white/40"
            min="1990"
            max="2025"
          />
          <input
            type="text"
            placeholder="License Plate"
            value={newCar.licensePlate}
            onChange={(e) => onChange('licensePlate', e.target.value)}
            className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-white/40"
          />
          <input
            type="text"
            placeholder="Color (optional)"
            value={newCar.color}
            onChange={(e) => onChange('color', e.target.value)}
            className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-white/40"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onAdd}
            className="px-6 py-2 bg-orange-500 text-black rounded-lg font-medium hover:bg-orange-400 transition-colors"
          >
            Add Vehicle
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-black/50 border border-orange-900/30 text-white rounded-lg hover:border-orange-500/50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVehicleForm;
