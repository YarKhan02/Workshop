import React from 'react';
import { Car } from 'lucide-react';
import { themeClasses } from '../../../config/theme';

const CompanyInfo: React.FC = () => {
  return (
    <div className={themeClasses.spacing.footerSection}>
      <div className={themeClasses.spacing.logoContainer}>
        <div className={themeClasses.iconContainer.primary}>
          <Car className={`w-6 h-6 ${themeClasses.iconColors.orange}`} />
        </div>
        <div>
          <h3 className={themeClasses.text.footerHeading}>Detailing Hub</h3>
          <p className={themeClasses.text.logoSub}>POWERED BY BIKE DOCTORS</p>
        </div>
      </div>
      <p className={`${themeClasses.text.footerText} leading-relaxed`}>
        Professional car detailing services with premium products, expert technicians, 
        and guaranteed satisfaction. Your vehicle deserves the best care.
      </p>
      <div className={themeClasses.spacing.socialContainer}>
        {['f', 'in', '@'].map((social, index) => (
          <div 
            key={index}
            className={themeClasses.spacing.socialIcon}
          >
            <span className="text-sm font-bold">{social}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyInfo;
