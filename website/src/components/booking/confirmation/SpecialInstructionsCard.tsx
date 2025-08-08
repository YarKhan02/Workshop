import React from 'react';
import { FileText } from 'lucide-react';
import { themeClasses } from '../../../config/theme';

interface SpecialInstructionsCardProps {
  notes: string;
}

const SpecialInstructionsCard: React.FC<SpecialInstructionsCardProps> = ({ notes }) => {
  return (
    <div className={`${themeClasses.card.primary} p-6`}>
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <FileText className={`w-6 h-6 mr-2 ${themeClasses.iconColors.orange}`} />
        Special Instructions
      </h3>
      <p className="text-white/80">{notes}</p>
    </div>
  );
};

export default SpecialInstructionsCard;
