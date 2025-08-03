import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 md:p-8 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 