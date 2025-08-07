import React from 'react';
import { Car } from 'lucide-react';

interface RegisterHeaderProps {
  title: string;
  subtitle: string;
}

const RegisterHeader: React.FC<RegisterHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-8">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
        <Car className="w-10 h-10 text-black" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
      <p className="text-white/70">{subtitle}</p>
    </div>
  );
};

export default RegisterHeader;
