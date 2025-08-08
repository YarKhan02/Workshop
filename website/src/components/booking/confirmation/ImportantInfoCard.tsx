import React from 'react';
import { MapPin } from 'lucide-react';
import { themeClasses } from '../../../config/theme';

interface ImportantInfoCardProps {
  serviceDuration: number;
}

const ImportantInfoCard: React.FC<ImportantInfoCardProps> = ({ serviceDuration }) => {
  return (
    <div className={`${themeClasses.card.primary} p-6 mb-8`}>
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <MapPin className={`w-6 h-6 mr-2 ${themeClasses.iconColors.orange}`} />
        Important Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/80">
        <div>
          <h4 className="font-medium text-white mb-2">What to Expect:</h4>
          <ul className="space-y-1 text-sm">
            <li>• Our team will arrive at the scheduled time</li>
            <li>• Service duration: {serviceDuration} minutes</li>
            <li>• Payment can be made after service completion</li>
            <li>• You'll receive updates via SMS/email</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-white mb-2">Need to Make Changes?</h4>
          <ul className="space-y-1 text-sm">
            <li>• Reschedule: Up to 2 hours before service</li>
            <li>• Cancel: Up to 4 hours before service</li>
            <li>• Contact: +91 9876543210</li>
            <li>• Email: contact@detailinghub.com</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImportantInfoCard;
