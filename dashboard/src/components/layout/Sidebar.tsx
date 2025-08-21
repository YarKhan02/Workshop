import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBookingStats } from '../../hooks/useBookings';
import NotificationBell from '../features/notifications/NotificationBell';
import {
  HomeIcon,
  UsersIcon,
  TruckIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Squares2X2Icon,
  ChartBarIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  // const isAdmin = user?.role === 'admin';
  
  // Get booking stats to show pending count
  const { data: bookingStats } = useBookingStats();
  const pendingBookingsCount = bookingStats?.pendingBookings || 0;

  const mainNavLinks = [
    { name: 'Dashboard', to: '/', icon: HomeIcon, badge: null, description: 'Overview Center' },
    { name: 'Customers', to: '/customers', icon: UsersIcon, badge: null, description: 'Customer Management' },
    { name: 'Cars', to: '/cars', icon: TruckIcon, badge: null, description: 'Vehicle Management' },
  ];

  const operationsLinks = [
    { 
      name: 'Bookings', 
      to: '/bookings', 
      icon: CalendarDaysIcon, 
      badge: pendingBookingsCount > 0 ? pendingBookingsCount.toString() : null, 
      description: 'Service Schedule' 
    },
    { name: 'Service', to: '/service', icon: WrenchScrewdriverIcon, badge: null, description: 'Service Available' },
    { name: 'Inventory', to: '/inventory', icon: Squares2X2Icon, badge: null, description: 'Parts Depot' },
  ];

  const businessLinks = [
    { name: 'Billing', to: '/billing', icon: CurrencyDollarIcon, badge: null, description: 'Revenue Track' },
    { name: 'Analytics', to: '/analytics', icon: ChartBarIcon, badge: null, description: 'Performance Data' },
  ];

  const systemLinks = [
    { name: 'Settings', to: '/settings', icon: Cog6ToothIcon, badge: null, description: 'Tuning Console' },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const NavSection = ({ title, links }: { title: string; links: any[] }) => (
    <div className="mb-8">
      {!isCollapsed && (
        <div className="flex items-center gap-3 mb-4 px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-1"></div>
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest">
            {title}
          </h3>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-1"></div>
        </div>
      )}
      <div className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `group relative flex items-center px-4 py-3.5 mx-3 rounded-xl transition-all duration-300 font-medium text-sm ${
                isCollapsed ? 'justify-center' : 'gap-4'
              } ${
                isActive 
                  ? 'bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 text-white shadow-lg backdrop-blur-sm border border-orange-400/30 transform scale-105' 
                  : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-slate-800/50 hover:backdrop-blur-sm hover:border hover:border-gray-600/30 hover:transform hover:scale-102'
              }`
            }
            end={link.to === '/'}
            title={isCollapsed ? link.name : ''}
          >
            {({ isActive }) => (
              <>
                <div className="relative flex items-center justify-center">
                  <link.icon className={`${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'} transition-all duration-300`} />
                  {link.badge && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {link.badge}
                    </div>
                  )}
                </div>
                
                {!isCollapsed && (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium tracking-wide">{link.name}</div>
                      <div className="text-xs text-gray-500 opacity-75 group-hover:opacity-100 transition-opacity font-light">
                        {link.description}
                      </div>
                    </div>
                    
                    {/* Racing stripe indicator for active state */}
                    <div className={`w-1 h-8 rounded-full transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-b from-orange-400 to-red-500 shadow-lg' 
                        : 'bg-transparent group-hover:bg-gray-600/50'
                    }`}></div>
                  </>
                )}

                {/* Enhanced tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-4 py-3 bg-black/90 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 whitespace-nowrap backdrop-blur-md border border-gray-700/50">
                    <div className="font-medium">{link.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{link.description}</div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-black/90 rotate-45 border-l border-b border-gray-700/50"></div>
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );

  return (
    <aside className={`hidden md:flex flex-col h-screen bg-gradient-to-b from-slate-900 via-gray-900 to-black text-white shadow-2xl sticky top-0 z-20 transition-all duration-500 ease-in-out ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Header */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} h-20 px-6 py-4 bg-gradient-to-r from-gray-800/50 to-slate-800/50 backdrop-blur-md`}>
        {!isCollapsed && (
          <div className="flex items-center gap-4">
            <div className="relative">
                <img 
                  src="/assets/detailing-hub-logo-no-bg.png" 
                  alt="Detailing Hub" 
                  className="h-20 w-auto object-contain drop-shadow-none bg-transparent"
                  style={{ background: 'none' }}
                />
            </div>
          </div>
        )}
        
        {isCollapsed && (
          <div className="flex items-center justify-center">
              <img 
                src="/assets/detailing-hub-logo-no-bg.png" 
                alt="Detailing Hub" 
                className="h-12 w-12 object-contain drop-shadow-none bg-transparent"
                style={{ background: 'none' }}
              />
          </div>
        )}
        
        <button
          onClick={toggleCollapse}
          className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm border border-gray-600/30 hover:border-orange-400/50 group mt-2"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4 text-gray-300 group-hover:text-orange-400 transition-colors" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4 text-gray-300 group-hover:text-orange-400 transition-colors" />
          )}
        </button>
      </div>

      {/* User Profile Section */}
      {!isCollapsed && user && (
        <div className="p-5 bg-gradient-to-r from-gray-800/30 to-slate-800/30 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-gray-700/50 group-hover:ring-orange-400/50 transition-all duration-300">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-100 truncate text-lg">
                {user.name}
              </div>
              <div className="text-xs text-gray-400 capitalize flex items-center gap-2 mt-1">
                <ShieldCheckIcon className="h-3 w-3 text-orange-400" />
                <span className="bg-gray-700/50 px-2 py-0.5 rounded-full text-xs font-medium">
                  {user.role}
                </span>
              </div>
            </div>
            <div className="relative">
              <NotificationBell />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-8 px-2 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700/50">
        <NavSection title="Control" links={mainNavLinks} />
        <NavSection title="Operations" links={operationsLinks} />
        <NavSection title="Analytics" links={businessLinks} />
        <NavSection title="System" links={systemLinks} />
      </nav>

      {/* Footer */}
      <div className={`p-6 border-t border-gray-700/30 bg-gradient-to-r from-gray-800/30 to-slate-800/30 backdrop-blur-md ${isCollapsed ? 'text-center' : ''}`}>
        {isCollapsed ? (
          <img 
            src="/assets/detailing-hub-logo-no-bg.png" 
            alt="Detailing Hub" 
            className="w-10 h-10 mx-auto object-contain opacity-80"
          />
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="text-xs font-medium text-gray-300">System Online</div>
            </div>
            <div className="text-xs text-gray-500 font-light">
              <div>© 2025 Detailing Hub</div>
              <div className="mt-1 text-orange-400/70">Peak Performance Solutions</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 