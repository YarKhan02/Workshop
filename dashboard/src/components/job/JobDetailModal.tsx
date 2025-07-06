import React from 'react';
import { X, Edit, Trash2, Calendar, Clock, DollarSign, User, Car, Users } from 'lucide-react';
import type { Job } from '../../types';
import Portal from '../ui/Portal';

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (job: Job) => void;
  onDelete: (jobId: number) => void;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  if (!isOpen || !job) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobTypeColor = (jobType: string) => {
    switch (jobType) {
      case 'basic_wash': return 'bg-blue-100 text-blue-800';
      case 'full_detail': return 'bg-purple-100 text-purple-800';
      case 'interior_detail': return 'bg-green-100 text-green-800';
      case 'exterior_detail': return 'bg-orange-100 text-orange-800';
      case 'premium_detail': return 'bg-pink-100 text-pink-800';
      case 'custom': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this job?')) {
      onDelete(job.id);
      onClose();
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Job Details #{job.id}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(job)}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Job Status and Type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                </div>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(job.status)}`}>
                  {job.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">Priority</span>
                </div>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(job.priority)}`}>
                  {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">Job Type</span>
                </div>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getJobTypeColor(job.jobType)}`}>
                  {job.jobType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
            </div>

            {/* Customer and Car Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="text-blue-600" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
                </div>
                {job.customer && (
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Name:</span> {job.customer.firstName} {job.customer.lastName}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> {job.customer.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span> {job.customer.phone}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Car className="text-green-600" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Vehicle Information</h3>
                </div>
                {job.car && (
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Vehicle:</span> {job.car.year} {job.car.make} {job.car.model}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">License Plate:</span> {job.car.licensePlate}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Color:</span> {job.car.color}
                    </p>
                    {job.car.vin && (
                      <p className="text-sm">
                        <span className="font-medium">VIN:</span> {job.car.vin}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Schedule and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-purple-600" size={20} />
                  <span className="font-medium text-gray-900">Scheduled</span>
                </div>
                <p className="text-sm text-gray-600">{formatDate(job.scheduledDate)}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-orange-600" size={20} />
                  <span className="font-medium text-gray-900">Duration</span>
                </div>
                <p className="text-sm text-gray-600">
                  {job.actualDuration ? formatDuration(job.actualDuration) : formatDuration(job.estimatedDuration) + ' (estimated)'}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-green-600" size={20} />
                  <span className="font-medium text-gray-900">Total Price</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">${job.totalPrice.toFixed(2)}</p>
                {job.discount && job.discount > 0 && (
                  <p className="text-sm text-green-600">-${job.discount.toFixed(2)} discount applied</p>
                )}
              </div>
            </div>

            {/* Staff Assignment */}
            {job.assignedStaff && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="text-indigo-600" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Assigned Staff</h3>
                </div>
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {job.assignedStaff.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {job.assignedStaff.email}
                </p>
              </div>
            )}

            {/* Services */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Services</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {job.services.map((service, index) => (
                  <span key={index} className="inline-flex px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Materials */}
            {job.materials && job.materials.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Materials Used</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {job.materials.map((material, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Timing Information */}
            {(job.startTime || job.endTime) && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Timing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {job.startTime && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Start Time</p>
                      <p className="text-sm text-gray-900">{formatDate(job.startTime)}</p>
                    </div>
                  )}
                  {job.endTime && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">End Time</p>
                      <p className="text-sm text-gray-900">{formatDate(job.endTime)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {(job.notes || job.customerNotes) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {job.notes && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Internal Notes</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{job.notes}</p>
                  </div>
                )}
                {job.customerNotes && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Notes</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{job.customerNotes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Job Metadata */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Created:</span>
                  <p className="text-gray-900">{formatDate(job.createdAt)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Last Updated:</span>
                  <p className="text-gray-900">{formatDate(job.updatedAt)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Job ID:</span>
                  <p className="text-gray-900">#{job.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default JobDetailModal; 