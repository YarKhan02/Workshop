import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/themeUtils';

const Header: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const { theme } = useTheme();

  return (
    <header className="flex items-center justify-between h-20 px-6 bg-gradient-to-r from-[#000000] to-black border-b border-[#000000] shadow-2xl sticky top-0 z-10 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <img 
          src="/assets/logo-200x60.png" 
          alt="Detailing Hub" 
          className="h-8 w-auto object-contain md:hidden"
        />
        <div className="text-xl font-light tracking-wider text-gray-100">
          <span className={cn(theme.textPrimary)}>Detailing</span>
          <span className="font-bold text-orange-400 ml-1">Hub</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="ml-4 flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
        >
          <LogOut className="h-5 w-5 mr-1" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header; 