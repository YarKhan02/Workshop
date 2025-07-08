import React from 'react';
import { X, Edit, Trash2, Phone, Mail, MapPin, Car } from 'lucide-react';
import type { Customer } from '../../types';
import Portal from '../ui/Portal';

interface CustomerDetailModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: number) => void;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  if (!isOpen || !customer) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Customer Details</h2>
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
                  {customer.first_name} {customer.last_name}
                </h3>
                {/* <p className="text-gray-600">Customer ID: {customer.id}</p> */}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(customer)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(customer.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Contact Information</h4>
                
                <div className="flex items-center gap-3">
                  <Phone className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{customer.phone_number}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{customer.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-900">{customer.address}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Additional Information</h4>
                
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="text-gray-900">
                    {customer.city || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">State</p>
                  <p className="text-gray-900">{customer.state || 'Not provided'}</p>
                </div>

              </div>
            </div>

            {customer.cars && customer.cars.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Vehicles</h4>
                <div className="space-y-3">
                  {customer.cars.map((car) => (
                    <div key={car.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Car className="text-gray-400" size={20} />
                      <div>
                        <p className="font-medium text-gray-900">
                          {car.year} {car.make} {car.model}
                        </p>
                        <p className="text-sm text-gray-600">
                          {car.color} • {car.license_plate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Created: {new Date(customer.date_joined).toLocaleDateString()}</span>
                {/* <span>Updated: {new Date(customer.updatedAt).toLocaleDateString()}</span> */}
              </div>
            </div>
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

export default CustomerDetailModal; 