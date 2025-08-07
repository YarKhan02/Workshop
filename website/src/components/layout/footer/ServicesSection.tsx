import React from 'react';
import { Star, Shield, Car, Users, Clock } from 'lucide-react';
import { themeClasses } from '../../../config/theme';

const services = [
  { name: 'Exterior Detailing', icon: Star },
  { name: 'Interior Deep Clean', icon: Shield },
  { name: 'Premium Full Detail', icon: Car },
  { name: 'Ceramic Coating', icon: Users },
  { name: 'Paint Correction', icon: Clock },
];

const ServicesSection: React.FC = () => {
  return (
    <div className={themeClasses.spacing.footerSection}>
      <h4 className={themeClasses.text.footerHeading}>Our Services</h4>
      <ul className={themeClasses.spacing.footerLinksContainer}>
        {services.map((service) => (
          <li key={service.name} className={`flex items-center ${themeClasses.text.footerText}`}>
            <service.icon className={`w-4 h-4 ${themeClasses.iconColors.orange} mr-2`} />
            {service.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServicesSection;
