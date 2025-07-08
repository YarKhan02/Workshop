import React from 'react';
import { X, Edit, Trash2, Car, Calendar, Gauge } from 'lucide-react';
import type { Car as CarType } from '../../types';
import Portal from '../ui/Portal';

interface CarDetailModalProps {
  car: CarType | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (car: CarType) => void;
  onDelete: (carId: number) => void;
}

const CarDetailModal: React.FC<CarDetailModalProps> = ({
  car,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  if (!isOpen || !car) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Car Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {car.year} {car.make} {car.model}
                </h3>
                {/* <p className="text-gray-600">Car ID: {car.id}</p> */}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(car)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(car.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Vehicle Information</h4>
                
                <div className="flex items-center gap-3">
                  <Car className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Make & Model</p>
                    <p className="text-gray-900">{car.make} {car.model}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="text-gray-900">{car.year}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
                    <div 
                      className={`w-3 h-3 rounded-full bg-${car.color.toLowerCase()}`}
                    ></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Color</p>
                    <p className="text-gray-900">{car.color}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">License Plate</p>
                  <p className="text-gray-900 font-mono text-lg">{car.license_plate}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Technical Details</h4>
                
                {car.vin && (
                  <div>
                    <p className="text-sm text-gray-500">VIN</p>
                    <p className="text-gray-900 font-mono text-sm">{car.vin}</p>
                  </div>
                )}

                {/* {car.mileage && (
                  <div className="flex items-center gap-3">
                    <Gauge className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Mileage</p>
                      <p className="text-gray-900">{car.mileage.toLocaleString()} km</p>
                    </div>
                  </div>
                )} */}
              </div>
            </div>

            {/* {car.notes && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Notes</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900">{car.notes}</p>
                </div>
              </div>*/}
            {/* )} */}

            {/* <div className="mt-8 pt-6 border-t">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Created: {new Date(car.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(car.updatedAt).toLocaleDateString()}</span>
              </div>
            </div> */}
          </div>

          <div className="flex justify-end gap-3 p-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default CarDetailModal; 