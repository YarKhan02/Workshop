import React from 'react';
import { CheckCircle } from 'lucide-react';
import { themeClasses } from '../../../config/theme';

interface ConfirmationHeaderProps {
  title: string;
  subtitle: string;
}

const ConfirmationHeader: React.FC<ConfirmationHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-12">
      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      <h1 className={`${themeClasses.heading.hero} text-white mb-4`}>
        {title}
      </h1>
      <p className="text-xl text-white/70 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};

export default ConfirmationHeader;
