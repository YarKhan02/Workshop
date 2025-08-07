import React from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { themeClasses } from '../../config/theme';

interface ConfirmationActionsProps {
  onPrint?: () => void;
}

const ConfirmationActions: React.FC<ConfirmationActionsProps> = ({ onPrint = () => window.print() }) => {
  return (
    <>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/my-bookings"
          className={`${themeClasses.button.primary} px-8 py-4 rounded-lg text-center font-semibold`}
        >
          View My Bookings
        </Link>
        <Link
          to="/book"
          className={`${themeClasses.button.secondary} px-8 py-4 rounded-lg text-center font-medium`}
        >
          Book Another Service
        </Link>
      </div>

      {/* Download Confirmation */}
      <div className="text-center mt-8">
        <button
          onClick={onPrint}
          className={`inline-flex items-center space-x-2 ${themeClasses.iconColors.orange} hover:text-orange-300 transition-colors`}
        >
          <Download className="w-5 h-5" />
          <span>Download Confirmation</span>
        </button>
      </div>
    </>
  );
};

export default ConfirmationActions;
