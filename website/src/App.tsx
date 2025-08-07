import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import { AppLayout } from './components';
import { PublicRoutes, AuthRoutes, ProtectedRoutes } from './routes';
import { NotFound } from './pages';

const App: React.FC = () => (
  <AuthProvider>
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppLayout>
        <Routes>
          <PublicRoutes />
          <AuthRoutes />
          <ProtectedRoutes />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </Router>
  </AuthProvider>
);

export default App; 