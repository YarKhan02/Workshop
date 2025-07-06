import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 md:p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 