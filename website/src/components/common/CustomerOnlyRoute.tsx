import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface CustomerOnlyRouteProps {
  children: React.ReactNode;
}

const CustomerOnlyRoute: React.FC<CustomerOnlyRouteProps> = ({ children }) => {
  const { isAuthenticated, isCustomer, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isCustomer) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-4">
            This platform is for customers only. Please use the appropriate login portal.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default CustomerOnlyRoute;
