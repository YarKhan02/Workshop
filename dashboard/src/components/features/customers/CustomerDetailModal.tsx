import React from 'react';
import { X, Edit, Phone, Mail, MapPin, Car } from 'lucide-react';
import type { CustomerDetailModalProps, CustomerCar } from '../../../types';
import Portal from '../../shared/utility/Portal';

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  isOpen,
  onClose,
  onEdit
}) => {
  if (!isOpen || !customer) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-gray-800/95 to-slate-800/95 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-700/30 backdrop-blur-md">
          <div className="flex items-center justify-between p-6 border-b border-gray-600/30">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Customer Profile
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
                  {customer.first_name} {customer.last_name}
                </h3>
                {/* <p className="text-gray-400">Client ID: {customer.id}</p> */}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(customer)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg"
                >
                  <Edit size={16} />
                  Modify
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-100">Contact Information</h4>
                
                <div className="flex items-center gap-3">
                  <Phone className="text-orange-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-gray-200">{customer.phone_number}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="text-orange-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-gray-200">{customer.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="text-orange-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-400">Address</p>
                    <p className="text-gray-200">{customer.address}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-100">Additional Information</h4>
                
                <div>
                  <p className="text-sm text-gray-400">City</p>
                  <p className="text-gray-200">
                    {customer.city || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">State</p>
                  <p className="text-gray-200">{customer.state || 'Not provided'}</p>
                </div>

              </div>
            </div>

            {customer.cars && customer.cars.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-100 mb-4">Registered Vehicles</h4>
                <div className="space-y-3">
                  {customer.cars?.map((car: CustomerCar) => (
                    <div key={car.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-700/50 to-slate-700/50 rounded-lg border border-gray-600/30">
                      <Car className="text-orange-400" size={20} />
                      <div>
                        <p className="font-medium text-gray-100">
                          {car.year} {car.make} {car.model}
                        </p>
                        <p className="text-sm text-gray-400">
                          {car.color} • {car.license_plate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-600/30">
              <div className="flex items-center justify-between text-sm text-gray-400">
              {customer.date_joined && (
                <span>Joined: {new Date(customer.date_joined).toLocaleDateString()}</span>
              )}
                {/* <span>Updated: {new Date(customer.updatedAt).toLocaleDateString()}</span> */}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-gray-600/30">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-300 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default CustomerDetailModal; 