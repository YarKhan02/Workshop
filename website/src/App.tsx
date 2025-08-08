import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/common';

import { AppLayout } from './components';
import { PublicRoutes, AuthRoutes, ProtectedRoutes } from './routes';
import { NotFound } from './pages';

const App: React.FC = () => (
  <ErrorBoundary>
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppLayout>
          <Routes>
            {PublicRoutes}
            {AuthRoutes}
            {ProtectedRoutes}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  </ErrorBoundary>
);

export default App; 