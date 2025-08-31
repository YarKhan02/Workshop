import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

import { ErrorBoundary, DashboardLayout } from './components';

import { DashboardHome, EmployeeManagement, Analytics, Customers, Cars, Bookings, Services, Billing, Notifications, Settings, Inventory, Login } from './pages';

import { Toaster } from 'react-hot-toast';

// ProtectedRoute component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => (
  <ThemeProvider defaultTheme="dark">
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<DashboardHome />} />
                      <Route path="/customers" element={<Customers />} />
                      <Route path="/cars" element={<Cars />} />
                      <Route path="/employee" element={<EmployeeManagement />} />
                      <Route path="/bookings" element={<Bookings />} />
                      <Route path="/billing" element={<Billing />} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/service" element={<Services />} />
                      <Route path="/analytics" element={<Analytics />} />
                    </Routes>
                  </ErrorBoundary>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

export default App; 