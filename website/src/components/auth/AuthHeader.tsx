import React from 'react';
import { Car } from 'lucide-react';

interface AuthHeaderProps {
  isLogin: boolean;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ isLogin }) => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
          <Car className="w-8 h-8 text-black" />
        </div>
      </div>
      
      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">
        <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
          Detailing Hub
        </span>
      </h1>
      
      {/* Subtitle */}
      <p className="text-white/60">
        {isLogin 
          ? 'Welcome back! Please sign in to continue.' 
          : 'Create your account to book premium car detailing services.'
        }
      </p>
    </div>
  );
};

export default AuthHeader;
