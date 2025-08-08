import React from 'react';
import { User, Mail } from 'lucide-react';
import { themeClasses } from '../../../config/theme';

interface CustomerInfoCardProps {
  userName?: string;
  userEmail?: string;
}

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({ userName, userEmail }) => {
  return (
    <div className={`${themeClasses.card.primary} p-6`}>
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <User className={`w-6 h-6 mr-2 ${themeClasses.iconColors.orange}`} />
        Customer Information
      </h3>
      <div className="space-y-3">
        {userName && (
          <div className="flex items-center space-x-3">
            <User className={`w-4 h-4 ${themeClasses.iconColors.orange}`} />
            <span className="text-white">{userName}</span>
          </div>
        )}
        {userEmail && (
          <div className="flex items-center space-x-3">
            <Mail className={`w-4 h-4 ${themeClasses.iconColors.orange}`} />
            <span className="text-white">{userEmail}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerInfoCard;
