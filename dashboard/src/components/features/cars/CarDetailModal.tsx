import React from 'react';
import { X, Edit, Trash2, Car, Calendar } from 'lucide-react';
import type { CarDetailModalProps } from '../../../types';
import Portal from '../../shared/utility/Portal';

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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-gray-800/95 to-slate-800/95 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-700/30 backdrop-blur-md">
          <div className="flex items-center justify-between p-6 border-b border-gray-600/30">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Racing Machine Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-orange-400 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-100">
                  {car.year} {car.make} {car.model}
                </h3>
                {/* <p className="text-gray-300">Car ID: {car.id}</p> */}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(car)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(car.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-100">Vehicle Information</h4>
                
                <div className="flex items-center gap-3">
                  <Car className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Make & Model</p>
                    <p className="text-gray-100">{car.make} {car.model}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="text-gray-100">{car.year}</p>
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
                    <p className="text-gray-100">{car.color}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">License Plate</p>
                  <p className="text-gray-100 font-mono text-lg">{car.license_plate}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-100">Technical Details</h4>
                
                {car.vin && (
                  <div>
                    <p className="text-sm text-gray-500">VIN</p>
                    <p className="text-gray-100 font-mono text-sm">{car.vin}</p>
                  </div>
                )}

                {/* {car.mileage && (
                  <div className="flex items-center gap-3">
                    <Gauge className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Mileage</p>
                      <p className="text-gray-100">{car.mileage.toLocaleString()} km</p>
                    </div>
                  </div>
                )} */}
              </div>
            </div>

            {/* {car.notes && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-100 mb-2">Notes</h4>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-gray-100">{car.notes}</p>
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