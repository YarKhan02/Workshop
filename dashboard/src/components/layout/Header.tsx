import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <header className="flex items-center justify-between h-20 px-6 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="text-xl font-bold text-blue-700 tracking-wide">Dashboard</div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="font-medium text-gray-900 text-sm">{user?.firstName} {user?.lastName}</span>
          <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
        </div>
        <button
          onClick={handleLogout}
          className="ml-4 flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow focus:outline-none"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header; 