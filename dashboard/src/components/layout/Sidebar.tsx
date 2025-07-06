import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  UsersIcon,
  TruckIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const navLinks = [
    { name: 'Dashboard', to: '/', icon: HomeIcon },
    { name: 'Customers', to: '/customers', icon: UsersIcon },
    { name: 'Cars', to: '/cars', icon: TruckIcon },
    { name: 'Bookings', to: '/bookings', icon: CalendarDaysIcon },
    { name: 'Jobs', to: '/jobs', icon: ClipboardDocumentListIcon },
    { name: 'Billing', to: '/billing', icon: CurrencyDollarIcon },
    ...(isAdmin ? [{ name: 'Users', to: '/users', icon: ShieldCheckIcon }] : []),
    { name: 'Settings', to: '/settings', icon: Cog6ToothIcon },
  ];
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-gradient-to-b from-blue-700 to-indigo-800 text-white shadow-lg sticky top-0 z-20">
      <div className="flex items-center justify-center h-20 border-b border-blue-800">
        <span className="text-2xl font-bold tracking-wide">CarDetailing</span>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 font-medium text-base gap-3 hover:bg-blue-900/80 ${
                isActive ? 'bg-blue-900/90 shadow text-white' : 'text-blue-100 hover:text-white'
              }`
            }
            end={link.to === '/'}
          >
            <link.icon className="h-6 w-6" />
            {link.name}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto p-4 text-xs text-blue-200 text-center">
        © 2024 Car Detailing<br />All rights reserved
      </div>
    </aside>
  );
};

export default Sidebar; 