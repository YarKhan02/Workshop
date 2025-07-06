import React from 'react';
import { X, User, Mail, Phone, Shield, Calendar, Clock } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'accountant' | 'staff';
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
}

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose }) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'accountant':
        return <User className="h-5 w-5 text-blue-500" />;
      case 'staff':
        return <User className="h-5 w-5 text-green-500" />;
      default:
        return <User className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const baseClasses = "px-3 py-1 text-sm font-medium rounded-full";
    switch (role) {
      case 'admin':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'accountant':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'staff':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Avatar and Basic Info */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-blue-600">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-gray-500">@{user.username}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              {getRoleIcon(user.role)}
              <span className={getRoleBadge(user.role)}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              user.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Contact Information</h4>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">{user.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Account Information</h4>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Member Since</p>
                  <p className="text-sm text-gray-600">
                    {user.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Unknown'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Last Login</p>
                  <p className="text-sm text-gray-600">
                    {user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Never'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal; 