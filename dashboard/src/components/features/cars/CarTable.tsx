// ==================== CAR TABLE COMPONENT ====================

import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import type { Car, CarTableProps } from '../../../types';

const CarTable: React.FC<CarTableProps> = ({
  cars,
  isLoading,
  onViewCar,
  onEditCar,
  onDeleteCar,
}) => {
  const handleDeleteClick = (car: Car) => {
    if (window.confirm('Are you sure you want to remove this racing machine? This action cannot be undone.')) {
      onDeleteCar(car.id);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-xl shadow-2xl border border-gray-700/30 overflow-hidden backdrop-blur-md">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-400">Loading racing fleet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-xl shadow-2xl border border-gray-700/30 overflow-hidden backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-900/80 to-slate-900/80 border-b border-gray-600/30">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Racing Machine
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Track ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Paint Job
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                VIN Code
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600/30">
            {cars.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="text-gray-400">
                    <p className="text-lg font-medium">No racing machines found</p>
                    <p className="mt-2">Your fleet is empty. Add some machines to get started!</p>
                  </div>
                </td>
              </tr>
            ) : (
              cars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-700/30 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-100">
                        {car.year} {car.make} {car.model}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-orange-400 font-bold">
                      {car.license_plate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-500 shadow-sm"
                        style={{ backgroundColor: car.color.toLowerCase() }}
                      ></div>
                      <span className="text-sm text-gray-200 capitalize">{car.color}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs font-mono text-gray-400">
                      {car.vin?.slice(-8) || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onViewCar(car)}
                        className="text-orange-400 hover:text-orange-300 transition-colors duration-200 p-1 rounded-lg hover:bg-orange-500/20"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEditCar(car)}
                        className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200 p-1 rounded-lg hover:bg-emerald-500/20"
                        title="Edit Machine"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(car)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200 p-1 rounded-lg hover:bg-red-500/20"
                        title="Remove Machine"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarTable;
